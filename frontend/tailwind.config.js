/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary - Deep Teal/Turquoise (Corporate & Trustworthy)
        primary: {
          light: '#14B8A6', // Teal 500
          DEFAULT: '#0D9488', // Teal 600
          dark: '#0F766E', // Teal 700
        },
        // Secondary - Soft Rose (Elegant Accent)
        secondary: {
          light: '#FFC9C0',
          DEFAULT: '#E8A09A',
          dark: '#D6776F',
        },
        // Neutrals
        neutral: {
          50: '#FDFBF7', // Ivory
          100: '#F5F5F4',
          200: '#E7E5E4',
          800: '#292524',
          900: '#1C1917',
        },
        // Status
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        info: '#3B82F6',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'serif'], // Optional for headings
      },
      boxShadow: {
        'soft': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
        'medium': '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.025)',
      }
    },
  },
  plugins: [],
}
