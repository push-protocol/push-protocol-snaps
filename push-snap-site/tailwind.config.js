/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'bg-light': '#ffffff',
        'bg-dark': '#26272B',
        'bg-secondary': '#141517', 
        'text-light': "#000000",
        'text-dark': "#ffffff",
        'text-secondary': '#E5208C',
      },
      fontFamily: {
        'rubik': ['Rubik', 'sans-serif'] 
      }
    },
  },
  plugins: [],
}
