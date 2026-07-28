const { heroui } = require("@heroui/react");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {},
  },

  plugins: [
    heroui({
      layout: {
        radius: {
          small: "6px",
          medium: "10px",
          large: "14px",
        },

        borderWidth: {
          small: "1px",
          medium: "1px",
          large: "2px",
        },

        boxShadow: {
          small: "0 1px 2px rgba(0,0,0,0.05)",
          medium: "0 2px 6px rgba(0,0,0,0.08)",
          large: "0 8px 20px rgba(0,0,0,0.12)",
        },

        disabledOpacity: "0.5",
      },

      themes: {
        light: {
          colors: {
            primary: "#2563eb",
            secondary: "#9333ea",
            success: "#22c55e",
            warning: "#f59e0b",
            danger: "#ef4444",
          },
        },
      },
    }),
  ],
};
