import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ['Montserrat', 'sans-serif'],
        montserrat: ['Montserrat', 'sans-serif'],
        arabic: ['Noto Sans Arabic', 'sans-serif'],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      backdropBlur: {
        xs: '2px',
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "blob-1": {
          "0%, 100%": { transform: "translate(0, 0) scale(1)", borderRadius: "40% 60% 70% 30% / 40% 50% 60% 50%" },
          "25%": { transform: "translate(30px, -50px) scale(1.05)", borderRadius: "70% 30% 50% 50% / 30% 60% 40% 70%" },
          "50%": { transform: "translate(-20px, 20px) scale(0.95)", borderRadius: "50% 60% 30% 60% / 60% 40% 70% 30%" },
          "75%": { transform: "translate(50px, 30px) scale(1.02)", borderRadius: "30% 50% 60% 40% / 50% 70% 30% 60%" },
        },
        "blob-2": {
          "0%, 100%": { transform: "translate(0, 0) scale(1)", borderRadius: "60% 40% 30% 70% / 50% 60% 40% 50%" },
          "25%": { transform: "translate(-40px, 30px) scale(1.08)", borderRadius: "30% 60% 70% 40% / 60% 30% 50% 70%" },
          "50%": { transform: "translate(30px, -40px) scale(0.92)", borderRadius: "50% 30% 60% 40% / 40% 70% 30% 60%" },
          "75%": { transform: "translate(-20px, -20px) scale(1.04)", borderRadius: "70% 50% 40% 60% / 30% 50% 70% 40%" },
        },
        "blob-3": {
          "0%, 100%": { transform: "translate(0, 0) scale(1)", borderRadius: "50% 70% 40% 60% / 60% 30% 70% 40%" },
          "33%": { transform: "translate(40px, 30px) scale(1.06)", borderRadius: "30% 50% 70% 40% / 50% 70% 30% 60%" },
          "66%": { transform: "translate(-30px, -50px) scale(0.96)", borderRadius: "60% 40% 50% 70% / 40% 60% 50% 30%" },
        },
        "blob-4": {
          "0%, 100%": { transform: "translate(0, 0) scale(1)", borderRadius: "70% 30% 60% 40% / 50% 60% 30% 70%" },
          "50%": { transform: "translate(-50px, 40px) scale(1.1)", borderRadius: "40% 60% 30% 70% / 70% 40% 60% 30%" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.6s ease-out",
        "slide-up": "slide-up 0.6s ease-out",
        "scale-in": "scale-in 0.4s ease-out",
        "blob-1": "blob-1 20s ease-in-out infinite",
        "blob-2": "blob-2 25s ease-in-out infinite",
        "blob-3": "blob-3 22s ease-in-out infinite",
        "blob-4": "blob-4 18s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
