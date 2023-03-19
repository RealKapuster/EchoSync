/** @type {import('tailwindcss').Config} */
const config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
    container: {
      padding: '20px',
    },
    colors: {
      metamaskOrange: "#ee811a",
      intmaxPurple: "#9f7aea"
    }
  },
  corePlugins: {
    preflight: false,
  },
  plugins: [],
};

module.exports = config;
