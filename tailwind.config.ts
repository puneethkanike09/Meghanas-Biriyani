import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'class',
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
      colors: {
        primary: '#F47729',
        bgColor: '#FFFFFF',
        textColor: '#000000',
        inputBgColor: '#F5F5F5',
        inputPlaceholderColor: '#717680',
      },
      fontFamily: {
        'proxima-nova': ['var(--font-proxima-nova)', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;
