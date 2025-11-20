import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        tablet: "768px",
        desktop: "1280px",
      },
    },
  },
  plugins: [
    plugin(function ({ addVariant }) {
      addVariant("tablet", "@media (min-width: 768px)");
      addVariant("desktop", "@media (min-width: 1280px)");
    }),
  ],
};

export default config;
