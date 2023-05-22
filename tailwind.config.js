const plugin = require("tailwindcss/plugin");
const textGlowPlugin = plugin(function ({ matchUtilities, theme }) {
  matchUtilities(
    {
      "text-glow": (value) => ({
        textShadow: value,
      }),
    },
    { values: theme("textShadow") }
  );
});

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
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
    },
  },
  plugins: [require("daisyui"), textGlowPlugin],
};
