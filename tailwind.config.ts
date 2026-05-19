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
        background: "#000000",
        foreground: "#ffffff",
        accent: {
          DEFAULT: "#44443a",
          dark: "#33332b",
        },
        card: {
          DEFAULT: "#000000",
          hover: "#0a0a0a",
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
