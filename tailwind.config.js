const plugin = require("tailwindcss/plugin")
const textGlowPlugin = plugin(function ({ matchUtilities, theme }) {
  matchUtilities(
    {
      "text-glow": (value) => ({
        textShadow: value,
      }),
    },
    { values: theme("textShadow") }
  )
})

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        glow: "0 0 10px 2px #F80B52, 0 4px 80px rgb(255 73 128 / 60%), inset 0 0 10px 2px #F80B52, inset 0 4px 40px rgb(255 73 128 / 60%)",
        "glow-yella":
          "0 0 10px 2px #B1FF0C, 0 4px 80px #b1ff0c99, inset 0 0 10px 2px #B1FF0C, inset 0 4px 40px #b1ff0c99",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      fontFamily: {
        orbitron: ["var(--font-orbitron)"],
      },
      colors: {
        "bold-dark": "#070114",
      },
      textShadow: {
        sm: "0 0px 4px var(--tw-shadow-color)",
        DEFAULT: "0 0px 8px var(--tw-shadow-color)",
        lg: "0 0px 16px var(--tw-shadow-color)",
      },
      keyframes: {
        "rotate-bounce": {
          "0%": { transform: "rotate(0deg) translateY(0px)" },
          "25%": { transform: "rotate(45deg) translateY(0px)" },
          "50%": { transform: "rotate(90deg) translateY(-20px)" },
          "75%": { transform: "rotate(135deg) translateY(0px)" },
          "100%": { transform: "rotate(180deg) translateY(0px)" },
        },
      },
      animation: {
        "rotate-bounce": "rotate-bounce 2s infinite",
      },
    },
  },
  plugins: [require("daisyui"), textGlowPlugin],
}
