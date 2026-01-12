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
        void: {
          900: "#0a0a0a",
          800: "#121212", 
          700: "#1e1e1e", 
        },
        axiom: {
          brand: "#ffffff",
          muted: "#888888",
          acid: "#ccff00",
          alert: "#ff4d00",
          crit: "#ff0033",
        }
      },
      fontFamily: {
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      backgroundImage: {
        'grid-pattern': "linear-gradient(to right, #1e1e1e 1px, transparent 1px), linear-gradient(to bottom, #1e1e1e 1px, transparent 1px)",
      },
    },
  },
  plugins: [],
};
export default config;