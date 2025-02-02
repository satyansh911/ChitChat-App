module.exports = {
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
  plugins: [require("daisyui")],
};
