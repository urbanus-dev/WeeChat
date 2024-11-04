/** @type {import('tailwindcss').Config} */
export default {
   content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
   theme: {
    screens: {
      'tablet': '640px',
      'laptop': '1024px',
      'desktop': '1280px',
    extend: {},
  },
},
  plugins: [],
}

