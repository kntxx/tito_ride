/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f0fdf4",
          100: "#dcfce7",
          200: "#bbf7d0",
          300: "#86efac",
          400: "#4ade80",
          500: "#22c55e",
          600: "#16a34a",
          700: "#15803d",
          800: "#166534",
          900: "#14532d",
        },
        dark: {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a",
          950: "#020617",
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-premium": "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        "gradient-green": "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
        "gradient-blue": "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
        "gradient-purple": "linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)",
        "gradient-mesh":
          "radial-gradient(at 27% 37%, hsla(215, 98%, 61%, 0.2) 0px, transparent 50%), radial-gradient(at 97% 21%, hsla(125, 98%, 72%, 0.2) 0px, transparent 50%), radial-gradient(at 52% 99%, hsla(354, 98%, 61%, 0.2) 0px, transparent 50%), radial-gradient(at 10% 29%, hsla(256, 96%, 67%, 0.2) 0px, transparent 50%)",
      },
      boxShadow: {
        glow: "0 0 20px rgba(34, 197, 94, 0.4)",
        "glow-lg": "0 0 30px rgba(34, 197, 94, 0.5)",
        glass: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
        premium: "0 20px 60px -15px rgba(0, 0, 0, 0.3)",
        "inner-glow": "inset 0 2px 8px 0 rgba(255, 255, 255, 0.1)",
      },
      backdropBlur: {
        xs: "2px",
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        shimmer: "shimmer 2s linear infinite",
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        gradient: "gradient 8s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-1000px 0" },
          "100%": { backgroundPosition: "1000px 0" },
        },
        gradient: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
      },
    },
  },
  plugins: [],
};
