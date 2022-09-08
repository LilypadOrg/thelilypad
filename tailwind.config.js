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
      },
    },
  },
  plugins: [],
  darkMode: 'class',
};
