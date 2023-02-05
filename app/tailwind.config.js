/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'primary-600': '#1D2A49',
        'primary-500': '#2C406D',
        'primary-400': '#4B5FA6',
        'primary-300': '#7188C6',
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
