import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#16161D",
        paper: "#FBFAF7",
        surface: "#F1EFE9",
        line: "#E2DFD6",
        muted: "#6B6A63",
        accent: "#2347E6",
        "accent-dark": "#1B36B4",
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
