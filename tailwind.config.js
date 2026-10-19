/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Токены экрана расходов; значения из :root в designs/screens/category-spending.html
        spending: {
          surface: "#10101C",
          elevated: "#181828",
          border: "rgba(255,255,255,0.08)",
          primary: "#F2F2FF",
          secondary: "#8888AA",
          red: "#FF4B6B",
          "red-glow": "rgba(255,75,107,0.2)",
          "red-soft": "rgba(255,75,107,0.10)",
          "red-line": "rgba(255,75,107,0.35)",
          green: "#00E089",
          "green-tint": "rgba(0,224,137,0.12)",
          inverse: "#080810",
        },
      },
    },
  },
  plugins: [],
};
