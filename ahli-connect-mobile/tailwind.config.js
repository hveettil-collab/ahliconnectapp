/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        cream: '#F4EFE8',
        navy: '#1B3A6B',
        'navy-light': '#2D5AA0',
        gold: '#C8973A',
        'gold-light': '#E0B85C',
        border: '#E8E2D9',
        'surface': '#FAFAF8',
        'text-primary': '#1A1A2E',
        'text-secondary': '#6B7280',
        'text-muted': '#9CA3AF',
      },
    },
  },
  plugins: [],
};
