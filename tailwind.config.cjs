/** @type {import('tailwindcss').Config} */
const config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      container: {
        padding: '20px',
        // you can configure the container to be centered
        center: true,
        // default breakpoints but with 40px removed
        screens: {
          sm: '600px',
          md: '728px',
          lg: '984px',
          xl: '1200px',
          '2xl': '1300px',
        },
      },
      colors: {
        bgGray: "#f4f0ee",
        bgLight: "#fffff",
        // bgLightGray: "#42414d",
        metamaskOrange: "#ee811a",
        intmaxPurple: "#9f7aea"
      },
      fontFamily: {
        roboto: ['Roboto', 'sans-serif']
      },
    },
  },
  corePlugins: {
    preflight: false,
  },
  plugins: [],
};

module.exports = config;
