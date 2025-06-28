import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      container: {
        center: true,
        padding: {
          DEFAULT: "1rem",
          sm: "2rem",
          lg: "4rem",
          xl: "5rem",
          "2xl": "6rem",
        },
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        red:{
          100: "#ffe2e2",
          200: "#ffc9c9",
          300: "#ffa2a2",
          400: "#ff6467",
          500: "#fb2c36",
          600: "#e7000b",
          700: "#c10007",
        },
        
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        light: {
          ...require("daisyui/src/theming/themes")["[data-theme=light]"],
          background: "#ffffff",
          foreground: "#171717",
        },
      },
    ]
  }
} satisfies Config;
