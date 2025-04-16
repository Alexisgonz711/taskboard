/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        mirage: {
          50: '#f0f7fe',
          100: '#ddedfc',
          200: '#c2e0fb',
          300: '#99cdf7',
          400: '#68b1f2',
          500: '#4591ec',
          600: '#3075e0',
          700: '#2760ce',
          800: '#264ea7',
          900: '#244584',
          950: '#0e172b',
        },
      },
      fontFamily: {
        sans: ['Satoshi', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
