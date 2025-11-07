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
          25: '#FEFCFB',
          50: '#FFF6F1',
          100: '#FFEBDF',
          200: '#FFD8BE',
          300: '#FFCAA9',
          400: '#FFBD99',
          500: '#F5AC86',
          600: '#E99468',
          700: '#F47729',
          800: '#E86A0F',
          900: '#CA5300',
        },

        // Gray Scale
        gray: {
          25: '#FCFCFD',
          50: '#FAFAFA',
          100: '#F5F5F5',
          200: '#E9EAEB',
          300: '#D5D7DA',
          400: '#A4A7AE',
          500: '#717680',
          600: '#535862',
          700: '#414651',
          800: '#252B37',
          900: '#101828',
        },

        // Semantic Color Palette
        tango: '#F47729',          // Main brand orange
        lightOrange: '#F2E7D4',    // Light background
        hotJazz: '#BF3030',        // Red (Non-veg indicator)
        tropicalGreen: '#00804D',  // Dark green (veg symbol green)
        midnight: '#FBB21C',       // Almost black
        mint: '#4EB57E',           // Light green (Veg indicator)
        parchment: '#F2E7D4',      // Light peach/tan
        sunRay: '#FBB21C',         // Light orange/peach (hover states)
        cream: '#F5E6D3',          // Light cream (Categories section bg)
        peachLight: '#FFF6F1',
        // Very light peach (Testimonials section bg)
      },
      fontFamily: {
        'proxima-nova': ['var(--font-proxima-nova)', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;
