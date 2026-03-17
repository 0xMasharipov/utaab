import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useToast } from "@/hooks/use-toast";
import { Shield, Eye, EyeOff, Mail, RefreshCw } from "lucide-react";
import { useSecurity } from "@/hooks/useSecurity";
import { Separator } from "@/components/ui/separator";
import { UtaabCaptcha, UtaabCaptchaRef } from "@/components/security/UtaabCaptcha";

const logAdminLogin = async (params: {
  event_type: string;
  email: string;
  provider?: string;
  session_token?: string;
}) => {
  try {
    await supabase.functions.invoke('admin-login-log', {
      body: params,
    });
  } catch (e) {
    console.error('Failed to log admin login:', e);
  }
};

export default function AdminLogin() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const { checkRateLimit } = useSecurity();
  const [utaabToken, setUtaabToken] = useState<string | null>(null);
  const utaabRef = useRef<UtaabCaptchaRef>(null);

  // OTP state
  const [awaitingOtp, setAwaitingOtp] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpEmail, setOtpEmail] = useState('');
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleVerifyAdminOtp = async () => {
    if (otpCode.length !== 6) return;

    // Rate limit OTP verification
    const rateLimitCheck = await checkRateLimit(otpEmail, 'admin_otp_verify', 5);
    if (!rateLimitCheck.allowed) {
      toast({
        title: t("common.error"),
        description: t("auth.tooManyAttempts"),
        variant: "destructive",
      });
      return;
    }

    setIsVerifyingOtp(true);
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email: otpEmail,
        token: otpCode,
        type: 'email',
      });

      if (error) throw error;
      if (!data.user) throw new Error('No user returned');

      // Check admin role
      const { data: hasAdmin, error: roleError } = await supabase.rpc('has_role', {
        _user_id: data.user.id,
        _role: 'admin',
      });

      if (roleError) throw roleError;
      if (!hasAdmin) {
        await supabase.auth.signOut();
        throw new Error("Access denied. Admin privileges required.");
      }

      // Create admin session
      const sessionToken = crypto.randomUUID();
      const { error: sessionError } = await supabase
        .from('admin_sessions')
        .insert({
          user_id: data.user.id,
          session_token: sessionToken,
          expires_at: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(),
        });

      if (sessionError) throw sessionError;

      await logAdminLogin({
        event_type: 'admin_login_success',
        email: otpEmail,
        session_token: sessionToken,
      });

      toast({
        title: t("common.success"),
        description: "Admin login successful",
      });

      navigate("/admin/dashboard");
    } catch (error: any) {
      toast({
        title: t("common.error"),
        description: error.message || "Invalid verification code",
        variant: "destructive",
      });
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleResendAdminOtp = async () => {
    if (resendCooldown > 0) return;

    const rateLimitCheck = await checkRateLimit(otpEmail, 'admin_otp_resend', 3);
    if (!rateLimitCheck.allowed) {
      toast({
        title: t("common.error"),
        description: t("auth.tooManyAttempts"),
        variant: "destructive",
      });
      return;
    }

    try {
      await supabase.auth.signInWithOtp({ email: otpEmail });
      setResendCooldown(60);
      toast({
        title: "Code resent",
        description: `A new verification code has been sent to ${otpEmail}`,
      });
    } catch (error: any) {
      toast({
        title: t("common.error"),
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check UTAAB verification
    if (!utaabToken) {
      toast({
        title: t("common.error"),
        description: t("auth.captchaRequired"),
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Check rate limit - identifier is ignored server-side for admin_login (uses IP)
      const rateLimitCheck = await checkRateLimit('_', 'admin_login', 5);
      if (!rateLimitCheck.allowed) {
        toast({
          title: t("common.error"),
          description: t("auth.tooManyAttempts"),
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // Sign in
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (authError) {
        setFailedAttempts(prev => prev + 1);
        await logAdminLogin({ event_type: 'admin_login_failed', email: email.trim().toLowerCase() });
        
        // If email not confirmed, show OTP input
        if (authError.message?.includes('Email not confirmed')) {
          setOtpEmail(email.trim().toLowerCase());
          setAwaitingOtp(true);
          setResendCooldown(60);
          toast({
            title: "Email not verified",
            description: "Please enter the verification code sent to your email.",
          });
          setIsLoading(false);
          return;
        }
        
        throw authError;
      }

      // Check if user has admin role
      const { data: hasAdmin, error: roleError } = await supabase.rpc('has_role', {
        _user_id: authData.user.id,
        _role: 'admin'
      });

      if (roleError) throw roleError;

      if (!hasAdmin) {
        await supabase.auth.signOut();
        throw new Error("Access denied. Admin privileges required.");
      }

      // Create admin session
      const sessionToken = crypto.randomUUID();
      const { error: sessionError } = await supabase
        .from('admin_sessions')
        .insert({
          user_id: authData.user.id,
          session_token: sessionToken,
          expires_at: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(),
        });

      if (sessionError) throw sessionError;

      // 2FA: Sign out immediately and send OTP
      await supabase.auth.signOut();
      const { error: otpError } = await supabase.auth.signInWithOtp({
        email: email.trim().toLowerCase(),
      });
      if (otpError) throw otpError;

      setOtpEmail(email.trim().toLowerCase());
      setAwaitingOtp(true);
      setResendCooldown(60);
      toast({
        title: "Verification Required",
        description: "A 6-digit code has been sent to your email.",
      });
    } catch (error: any) {
      console.error("Admin login error:", error);
      
      let errorMessage = error.message;
      if (error.message?.includes('Invalid login credentials')) {
        errorMessage = t("auth.incorrectPassword");
      } else if (error.message?.includes('Email not confirmed')) {
        errorMessage = t("auth.verifyEmail");
      }

      toast({
        title: t("common.error"),
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/admin/login?oauth=callback`,
        },
      });

      if (error) throw error;
    } catch (error: any) {
      toast({
        title: t("common.error"),
        description: error.message,
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  // Handle OAuth callback
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('oauth') === 'callback') {
      supabase.auth.getSession().then(async ({ data: { session } }) => {
        if (session?.user) {
          try {
            const { data: hasAdmin, error: roleError } = await supabase.rpc('has_role', {
              _user_id: session.user.id,
              _role: 'admin'
            });

            if (roleError) throw roleError;

            if (!hasAdmin) {
              await supabase.auth.signOut();
              toast({
                title: "Access Denied",
                description: "This Google account isn't authorized for admin access.",
                variant: "destructive",
              });
              window.history.replaceState({}, '', '/admin/login');
              return;
            }

            const sessionToken = crypto.randomUUID();
            const { error: sessionError } = await supabase
              .from('admin_sessions')
              .insert({
                user_id: session.user.id,
                session_token: sessionToken,
                expires_at: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(),
              });

            if (sessionError) throw sessionError;

            await logAdminLogin({ 
              event_type: 'admin_login_success',
              email: session.user.email || '',
              provider: 'google',
              session_token: sessionToken,
            });

            toast({
              title: t("common.success"),
              description: "Admin login successful",
            });

            navigate("/admin/dashboard");
          } catch (error: any) {
            console.error("OAuth callback error:", error);
            toast({
              title: t("common.error"),
              description: error.message,
              variant: "destructive",
            });
          }
        }
      });
    }
  }, [navigate, toast, t]);

  // OTP Verification Screen
  if (awaitingOtp) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
        <Card className="w-full max-w-md glass-card">
          <CardHeader className="space-y-4 text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Mail className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold">Verify Your Email</CardTitle>
            <CardDescription>
              We sent a 6-digit code to <strong>{otpEmail}</strong>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-center">
              <InputOTP
                maxLength={6}
                value={otpCode}
                onChange={setOtpCode}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>

            <Button
              onClick={handleVerifyAdminOtp}
              className="w-full"
              disabled={otpCode.length !== 6 || isVerifyingOtp}
            >
              {isVerifyingOtp ? "Verifying..." : "Verify Code"}
            </Button>

            <div className="flex items-center justify-center gap-2 text-sm">
              <span className="text-muted-foreground">Didn't receive the code?</span>
              <button
                onClick={handleResendAdminOtp}
                disabled={resendCooldown > 0}
                className="text-primary hover:underline font-medium disabled:opacity-50 flex items-center gap-1"
              >
                <RefreshCw className="h-3 w-3" />
                {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend"}
              </button>
            </div>

            <Button
              variant="ghost"
              className="w-full"
              onClick={() => {
                setAwaitingOtp(false);
                setOtpCode('');
              }}
            >
              Back to login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
      <Card className="w-full max-w-md glass-card">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Admin Login</CardTitle>
          <CardDescription>
            Secure access for administrators only
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Google Sign-In Button */}
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continue with Google
            </Button>

            <div className="relative">
              <Separator className="my-4" />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
                or
              </span>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {/* UTAAB Anti-bot Verification */}
            <UtaabCaptcha
              ref={utaabRef}
              onVerify={(token) => setUtaabToken(token)}
              onError={() => toast({
                title: t("common.error"),
                description: t("auth.captchaFailed"),
                variant: "destructive",
              })}
              mode="interactive"
              difficulty="high"
            />

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || !utaabToken}
            >
              <Mail className="w-4 h-4 mr-2" />
              {isLoading ? "Signing in..." : "Sign In with Email"}
            </Button>

            <p className="text-xs text-center text-muted-foreground mt-4">
              {t("auth.privacyNotice")}
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
