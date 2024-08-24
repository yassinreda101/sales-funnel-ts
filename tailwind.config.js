module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'navy-blue': '#001F3F',
        'navy-blue-600': '#00305f',
      },
    },
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),
  ],
}