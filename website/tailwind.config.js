const path = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  // content: [
  //   "index.html",
  //   "src/**/*.{vue,js,ts,jsx,tsx,css}",
  // ],
  content: {
    files: [
      './index.html',
      './src/**/*.{vue,js,ts,jsx,tsx}',
      './src/**/!(*.test).{js,ts,jsx,tsx}',
    ].map(p => path.resolve(__dirname, p)),
  },
  darkMode: 'class',
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '2rem',
        md: '4rem',
        lg: '6rem',
        xl: '8rem',
      },
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1180px',
      },
    },
    extend: {},
  },
  plugins: [],
};