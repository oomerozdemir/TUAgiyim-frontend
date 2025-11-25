/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        black: "#000000",
        beige: "#D7C0A8",
        cream: "#F6F1EB",
        rose:  "#B66E63",
        gold:  "#C2A676",
      },
      boxShadow: { soft: "0 10px 30px rgba(0,0,0,0.08)" },
    },
  },
  plugins: [],
};
