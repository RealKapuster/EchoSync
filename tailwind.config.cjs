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
          md: '950px',
          lg: '950px',
          xl: '950px',
          '2xl': '950px',
        },
      },
      colors: {
        bgGray: "#f5f8fa",
        bgLight: "#fffff",
        btnColour: "#007aff",
        btnColourHover: "#0060c8",
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
