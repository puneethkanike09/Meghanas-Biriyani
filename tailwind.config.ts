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
        // Primary Brand Color (Orange shades)
        brand: {
          25: '#FFF2F2',
          50: '#FFF1F5',
          100: '#FFE8E2',
          200: '#FFDBE2',
          300: '#FFC4AB',
          400: '#FFAD36',
          500: '#FFAE2E',
          600: '#FD9948',
          700: '#F47722', // Tango - Main brand color
          800: '#EB6A17',
          900: '#CA5100',
        },

        // Gray Scale
        gray: {
          25: '#FCFCFD',
          50: '#F9F9FA',
          100: '#F2F2F3',
          200: '#E9EAEB',
          300: '#D0D5DD',
          400: '#AAA4AC',
          500: '#717680',
          600: '#555862',
          700: '#414651',
          800: '#1D2939',
          900: '#101828',
        },

        // Semantic Color Palette
        tango: '#F47722',          // Main brand orange
        lightOrange: '#F3F3F4',    // Light background
        hotJazz: '#BF3030',        // Red (Non-veg indicator)
        tropicalGreen: '#00804D',  // Dark green (veg symbol green)
        midnight: '#181D2C',       // Almost black
        mint: '#48BB6C',           // Light green (Veg indicator)
        parchment: '#F2CDB3',      // Light peach/tan
        sunRay: '#FFCAA9',         // Light orange/peach (hover states)
        cream: '#F5E6D3',          // Light cream (Categories section bg)
        peachLight: '#FFF6F1',     // Very light peach (Testimonials section bg)
      },
      fontFamily: {
        'proxima-nova': ['var(--font-proxima-nova)', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;
