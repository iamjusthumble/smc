/** @type {import('tailwindcss').Config} */

export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#2465C2",
        "primary-500": "#017CB8",
        "primary-600": "#00609E",
        "primary-700": "#004884",
        "primary-800": "#00336A",
        "primary-900": "#002458",
        bg_light: "#F2F3F8",
        primary_light: "#5E90CC",
        secondary: "#010024",
        available: "#00C095",
        tertiary: "#FE9DE2",
        background: "#F5F7F9",
        dark: "#010024",
        darktxt: "#637381",
        darkBlue: "#151a33",
        lightgray: "#98A2B3",
        skills: "#2065D129",
        projects: "#161616",
        darknight: "#252A2F",
        icon: "#9E9E9E",
        sidebar: "#333333",
      },
      fontFamily: {
        sans: [
          "Manrope",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
        manrope: ["Manrope"],
        poppins: ["Poppins"],
        inter: ["Inter"],
      },
      fontWeight: {
        200: 200,
        500: 500,
        300: 300,
        400: 400,
        600: 600,
      },
      boxShadow: {
        card: "0 1px 2px 0 rgba(16, 24, 40, 0.06), 0 1px 3px 0 rgba(16, 24, 40, 0.1)",
        dropdown:
          "0 4px 6px -2px rgba(16, 24, 40, 0.05), 0 12px 16px -4px rgba(16, 24, 40, 0.1)",
      },
    },
  },
  plugins: [import("@tailwindcss/forms"), import("@tailwindcss/aspect-ratio")],
};
