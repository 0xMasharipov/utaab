import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Shield, Eye, EyeOff } from "lucide-react";
import { TurnstileWidget } from "@/components/security/TurnstileWidget";
import { useSecurity } from "@/hooks/useSecurity";

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
            {requireCaptcha && (
              <div className="space-y-2">
                <Label>{t("auth.captchaRequired")}</Label>
                <TurnstileWidget
                  onVerify={setCaptchaToken}
                  onError={() => setCaptchaToken("")}
                  onExpire={() => setCaptchaToken("")}
                  theme="dark"
                />
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || (requireCaptcha && !captchaToken)}
            >
              {isLoading ? "Signing in..." : "Sign In"}
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
