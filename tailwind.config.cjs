/** @type {import('tailwindcss').Config} */
const config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
    container: {
      padding: '20px',
    },
  },
  corePlugins: {
    preflight: false,
  },
  plugins: [],
};

module.exports = config;
