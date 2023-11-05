/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        color1: "#FABB18",
        color2: "#FFF8E8",
        color3: "#F9F9F9",
        color4: "#757575",
        white: "#FFFFFF",
        black: "#000000",
      },

      backgroundImage: {
        traitementSeismique: "url('/src/assets/traitementSeismique.jpg')",
      },

      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
    },
  },
  plugins: [],
};
