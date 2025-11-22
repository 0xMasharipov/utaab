import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Shield, Eye, EyeOff, Mail } from "lucide-react";
import { TurnstileWidget } from "@/components/security/TurnstileWidget";
import { useSecurity } from "@/hooks/useSecurity";
import { Separator } from "@/components/ui/separator";

export default function AdminLogin() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string>("");
  const [failedAttempts, setFailedAttempts] = useState(0);
  const { config, verifyCaptcha, checkRateLimit, logSecurityEvent } = useSecurity();
  const requireCaptcha = config.captchaEnabled || failedAttempts >= 3;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Check rate limit
      const rateLimitCheck = await checkRateLimit(email, 'admin_login', 5);
      if (!rateLimitCheck.allowed) {
        toast({
          title: t("common.error"),
          description: t("auth.tooManyAttempts"),
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // Verify CAPTCHA if required
      if (requireCaptcha) {
        if (!captchaToken) {
          toast({
            title: t("common.error"),
            description: t("auth.captchaRequired"),
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }

        const captchaValid = await verifyCaptcha(captchaToken);
        if (!captchaValid) {
          toast({
            title: t("common.error"),
            description: t("auth.captchaFailed"),
            variant: "destructive",
          });
          setCaptchaToken("");
          setIsLoading(false);
          return;
        }
      }

      // Sign in
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (authError) {
        setFailedAttempts(prev => prev + 1);
        await logSecurityEvent('admin_login_failed', 'medium', { email });
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
          expires_at: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(), // 8 hours
        });

      if (sessionError) throw sessionError;

      await logSecurityEvent('admin_login_success', 'low', { email });

      toast({
        title: t("common.success"),
        description: "Admin login successful",
      });

      navigate("/admin/dashboard");
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
      setCaptchaToken("");
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
            // Check if user has admin role
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

            // Create admin session
            const sessionToken = crypto.randomUUID();
            const { error: sessionError } = await supabase
              .from('admin_sessions')
              .insert({
                user_id: session.user.id,
                session_token: sessionToken,
                expires_at: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(),
              });

            if (sessionError) throw sessionError;

            await logSecurityEvent('admin_login_success', 'low', { 
              email: session.user.email,
              provider: 'google' 
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
  }, [navigate, toast, t, logSecurityEvent]);

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
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
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
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Security Verification</Label>
              <TurnstileWidget
                onVerify={setCaptchaToken}
                onError={() => setCaptchaToken("")}
                onExpire={() => setCaptchaToken("")}
                theme="dark"
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || !captchaToken}
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
