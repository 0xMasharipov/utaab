import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Home, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo-new.webp";

const NotFound = () => {
  const location = useLocation();
  const { t } = useTranslation();

  useEffect(() => {
    document.title = "404 — UTAAB";
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <main
      role="main"
      className="relative min-h-screen overflow-hidden bg-background text-foreground flex items-center justify-center px-6 py-20 font-[Montserrat]"
    >
      {/* Technical grid background */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none bg-technical-grid opacity-60"
      />
      {/* Vignette fade */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 0%, hsl(var(--background) / 0.6) 70%, hsl(var(--background)) 100%)",
        }}
      />

      {/* Ambient gradient orbs */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] rounded-full blur-3xl animate-glow-pulse"
        style={{
          background:
            "radial-gradient(circle, hsl(var(--accent) / 0.35) 0%, hsl(var(--primary) / 0.15) 40%, transparent 70%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-20 -right-20 w-[380px] h-[380px] rounded-full blur-3xl opacity-40"
        style={{
          background:
            "radial-gradient(circle, hsl(var(--primary) / 0.4) 0%, transparent 70%)",
        }}
      />

      {/* Content card */}
      <div className="relative z-10 w-full max-w-2xl text-center animate-fade-up">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="relative animate-float-slow">
            <div
              aria-hidden
              className="absolute inset-0 -m-6 rounded-full blur-2xl opacity-60"
              style={{
                background:
                  "radial-gradient(circle, hsl(var(--accent) / 0.5), transparent 70%)",
              }}
            />
            <img
              src={logo}
              alt="UTAAB"
              className="relative w-20 h-20 md:w-24 md:h-24 object-contain"
              style={{ mixBlendMode: "screen" }}
            />
          </div>
        </div>

        {/* 404 headline */}
        <h1
          className="font-extrabold tracking-tight leading-none text-[7rem] md:text-[10rem] mb-2 bg-clip-text text-transparent animate-gradient-sweep"
          style={{
            backgroundImage:
              "linear-gradient(90deg, hsl(var(--foreground)) 0%, hsl(var(--accent)) 35%, hsl(var(--primary)) 65%, hsl(var(--foreground)) 100%)",
          }}
        >
          {t("notFound.title", "404")}
        </h1>

        {/* Heading */}
        <h2 className="text-2xl md:text-3xl font-extrabold mb-4 text-foreground">
          {t("notFound.heading", "Lost in the chain")}
        </h2>

        {/* Message */}
        <p className="text-base md:text-lg text-muted-foreground mb-10 max-w-md mx-auto leading-relaxed">
          {t("notFound.message", "The page you're looking for doesn't exist or has been moved.")}
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button asChild size="lg" className="min-w-[180px] gap-2">
            <Link to="/">
              <Home className="w-4 h-4" />
              {t("notFound.backHome", "Return Home")}
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="min-w-[180px] gap-2 border-border/60">
            <Link to="/education">
              <GraduationCap className="w-4 h-4" />
              {t("notFound.exploreEducation", "Explore Education")}
            </Link>
          </Button>
        </div>

        {/* Brand tagline */}
        <div className="mt-16 flex items-center justify-center gap-3">
          <span className="h-px w-12 bg-border/60" />
          <span className="text-xs md:text-sm font-semibold tracking-[0.3em] text-muted-foreground/80">
            {t("notFound.tagline", "CONNECT · LEARN · BUILD")}
          </span>
          <span className="h-px w-12 bg-border/60" />
        </div>

        {/* Path hint */}
        <p className="mt-6 text-xs text-muted-foreground/60 font-mono break-all">
          {location.pathname}
        </p>
      </div>
    </main>
  );
};

export default NotFound;
