import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0a0a0a",
        foreground: "#ededed",
        accent: {
          DEFAULT: "#00d1ff",
          dark: "#00a3cc",
        },
        card: {
          DEFAULT: "#121212",
          hover: "#1a1a1a",
        }
      },
      fontFamily: {
        poppins: ["var(--font-poppins)", "sans-serif"],
        stylish: ["var(--font-stylish)", "serif"],
      },
      animation: {
        "scroll-left": "scroll-left 20s linear infinite",
      },
      keyframes: {
        "scroll-left": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
