/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        vintage: {
          bg: "#0D0E11",
          card: "#14161B",
          cardBorder: "#262933",
          gold: "#D4AF37",
          goldHover: "#E5C05B",
          goldMuted: "#8C7426",
          cream: "#F5F3EF",
          creamMuted: "#B8B5AE",
          redAccent: "#A63838"
        }
      },
      fontFamily: {
        serif: ["Georgia", "Cambria", "Times New Roman", "serif"],
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"]
      }
    },
  },
  plugins: [],
}

