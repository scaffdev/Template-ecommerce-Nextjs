import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      screens: {
        "3xl": "1800px",
      },
      colors: {
        canvas: {
          DEFAULT: "#F5F5F6",
          soft: "#FAFAFA",
          deep: "#EFEFF1",
        },
        surface: "#FFFFFF",
        ink: {
          DEFAULT: "#18181B",
          soft: "#3F3F46",
          muted: "#71717A",
        },
        brand: {
          50: "#FFF1F2",
          100: "#FFE4E6",
          200: "#FECDD3",
          300: "#FDA4AF",
          400: "#FB7185",
          500: "#F43F5E",
          600: "#E11D48",
          700: "#BE123C",
          800: "#9F1239",
          900: "#881337",
        },
        accent: {
          50: "#FFF7ED",
          100: "#FFEDD5",
          200: "#FED7AA",
          300: "#FDBA74",
          400: "#FB923C",
          500: "#F97316",
          600: "#EA580C",
          700: "#C2410C",
        },
        brass: {
          50: "#FFF1F2",
          100: "#FFE4E6",
          200: "#FECDD3",
          300: "#FDA4AF",
          400: "#FB7185",
          500: "#F43F5E",
          600: "#E11D48",
          700: "#BE123C",
          800: "#9F1239",
          900: "#881337",
        },
        olive: {
          50: "#F0FDF4",
          100: "#DCFCE7",
          200: "#BBF7D0",
          300: "#86EFAC",
          400: "#4ADE80",
          500: "#22C55E",
          600: "#16A34A",
          700: "#15803D",
          800: "#166534",
          900: "#14532D",
        },
        sand: {
          50: "#FAFAFA",
          100: "#F4F4F5",
          200: "#E4E4E7",
          300: "#D4D4D8",
          400: "#A1A1AA",
          500: "#71717A",
        },
        danger: "#DC2626",
        success: "#16A34A",
      },
      fontFamily: {
        sans: ["var(--font-manrope)", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["var(--font-manrope)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        widest2: "0.22em",
      },
      boxShadow: {
        soft: "0 12px 40px -24px rgba(28, 25, 23, 0.35)",
        card: "0 1px 2px rgba(28, 25, 23, 0.04), 0 18px 50px -32px rgba(28, 25, 23, 0.35)",
        lift: "0 30px 70px -40px rgba(28, 25, 23, 0.5)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(18px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(.97)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "slide-in-right": {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" },
        },
        "slide-in-bottom": {
          "0%": { transform: "translateY(100%)" },
          "100%": { transform: "translateY(0)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: ".55" },
        },
      },
      animation: {
        "fade-up": "fade-up .7s cubic-bezier(.22,1,.36,1) both",
        "fade-in": "fade-in .5s ease both",
        "scale-in": "scale-in .35s cubic-bezier(.22,1,.36,1) both",
        "slide-in-right": "slide-in-right .45s cubic-bezier(.22,1,.36,1) both",
        "slide-in-bottom": "slide-in-bottom .4s cubic-bezier(.22,1,.36,1) both",
        marquee: "marquee 32s linear infinite",
        shimmer: "shimmer 1.8s linear infinite",
        float: "float 6s ease-in-out infinite",
        "pulse-soft": "pulse-soft 2.4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
