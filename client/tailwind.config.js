/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#E8E3DE",
        secondary: "#000000",
        accent: "#E8634E",
      }
    },
    screens: {
      ...require("tailwindcss/defaultTheme").screens,
      "laptop-l": "1440px",
    },
  },
  plugins: [],
};