import daisyui from "daisyui";

/** @type {import('tailwindcss').Config} */
export default{
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"], // Adjust based on your file structure
  theme: {
    extend: {
      colors: {
        darkBg: "#121212",   // Background
        darkCard: "#1E1E1E", // Navbar & Cards
        textPrimary: "#FFFFFF",
        textSecondary: "#B0B3B8",
        accentGreen: "#22C55E",
        accentBlue: "#3B82F6",
        hoverGreen: "#16A34A",
        hoverBlue: "#2563EB",
        borderGray: "#262626",
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      "light",
      "dark",
      "cupcake",
      "bumblebee",
      "emerald",
      "corporate",
      "synthwave",
      "retro",
      "cyberpunk",
      "valentine",
      "halloween",
      "garden",
      "forest",
      "aqua",
      "lofi",
      "pastel",
      "fantasy",
      "wireframe",
      "black",
      "luxury",
      "dracula",
      "cmyk",
      "autumn",
      "business",
      "acid",
      "lemonade",
      "night",
      "coffee",
      "winter",
      "dim",
      "nord",
      "sunset",
    ]
  }
};
