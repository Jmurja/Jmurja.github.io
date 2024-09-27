/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Open Sans', 'sans-serif'],
        heading: ['Montserrat', 'sans-serif'],
      },
      colors: {
        primary: '#4f46e5',
        secondary: '#3730a3',
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
      }
    }
  },
  darkMode: 'class',
}