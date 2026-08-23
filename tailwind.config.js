/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // fontFamily: {
      //   anton: ['"Anton"', 'sans-serif'],
      // },
      colors: {
        brandPink: "#f9edf5",
        grayish: "#5B576F",
        darkNavy: "#161C2B",
        brandBlue: "#1E60DB",
      },
    },
  },
  plugins: [],
}
