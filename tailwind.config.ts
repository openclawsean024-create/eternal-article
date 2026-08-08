import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      colors: {
        // 主鏈官方配色
        sui: {
          DEFAULT: "#4ca3ff",
          dark: "#0f1b3a",
          glow: "#6fb1ff",
        },
        arweave: {
          DEFAULT: "#ff5a32",
          dark: "#0a0a0a",
          glow: "#ff8a32",
        },
        base: {
          DEFAULT: "#2151f5",
          dark: "#0a1226",
          glow: "#5a82ff",
        },
        ink: {
          50: "#f5f6fa",
          900: "#0b0d12",
          950: "#060709",
        },
      },
      backgroundImage: {
        "grid-faint":
          "linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)",
        "radial-sui":
          "radial-gradient(circle at 30% 20%, rgba(76,163,255,0.18), transparent 60%)",
        "radial-arweave":
          "radial-gradient(circle at 70% 30%, rgba(255,90,50,0.18), transparent 60%)",
        "radial-base":
          "radial-gradient(circle at 50% 50%, rgba(33,81,245,0.18), transparent 60%)",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "shimmer": "shimmer 2.5s linear infinite",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-1000px 0" },
          "100%": { backgroundPosition: "1000px 0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
