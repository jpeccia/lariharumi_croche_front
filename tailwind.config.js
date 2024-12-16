/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'brand-blue': '#E6F3FF',
        'brand-pink': '#FFE6F3',
        'brand-purple': '#F3E6FF',
      },
    },
  },
  plugins: [],
};