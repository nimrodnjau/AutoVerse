/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        head: ["'Bebas Neue'", "sans-serif"],
        body: ["'DM Sans'", "sans-serif"],
      },
      colors: {
        brand: {
          red: "#c0392b",
          "red-dark": "#922b21",
          gold: "#c9a84c",
          black: "#0a0a0a",
          gray: "#1a1a1a",
          "gray-2": "#2a2a2a",
          "gray-3": "#444444",
          "gray-4": "#888888",
          "gray-5": "#cccccc",
        },
      },
    },
  },
  plugins: [],
};

