/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f3f2ff',
          100: '#e9e8ff',
          200: '#d5d4ff',
          300: '#b7b1ff',
          400: '#9385ff',
          500: '#7b61ff',
          600: '#5d30f7',
          700: '#4f1ee3',
          800: '#4218bf',
          900: '#37169c',
        },
        "dark-blue" : '#0D2548',
        'secondary-500': '#346B64',
        'secondary-400': '#40ADA5',
        'secondary-300': '#83DAD6',
        'main-yellow': '#F7DC16',
        'main-gray-dark': '#C4C4C4',
        'main-gray-light': '#F5F5F5',
        'polygon-purple': '#7b61ff',
      },
      animation: {
        blob: 'blob 8s infinite',
      },

      keyframes: {
        blob: {
          '0%': {
            transform: 'translate(0px,0px) scale(0.8)',
          },
          '25%': {
            transform: 'translate(-30px,-20px) scale(0.9)',
          },
          '50%': {
            transform: 'translate(50px,-50px) scale(1)',
          },
          '75%': {
            transform: 'translate(20px, 30px) scale(0.9)',
          },
          '100%': {
            transform: 'translate(0px,0px) scale(0.8)',
          },
        },
      },
    },
  },
  plugins: [require('daisyui')],
  darkMode: 'class',
};
