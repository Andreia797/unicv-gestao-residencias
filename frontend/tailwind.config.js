/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#AB162B', // Vermelho Uni-CV
        secondary: '#2C2A2B', // Preto Uni-CV
        gray: '#808284', // Cinza Uni-CV
        blue: '#0097CD', // Azul Uni-CV
        green: '#94D500', // Verde Uni-CV
      },
      fontFamily: {
        'pt-futura': ['PT FuturaFuturis Medium Cyrillic', 'sans-serif'],
        'adobe-garamond': ['Adobe Garamond Pro', 'serif'],
        'arial': ['Arial', 'sans-serif'],
        'univers': ['Univers LT Std', 'sans-serif'],
      },
    },
  },
  plugins: [],
};