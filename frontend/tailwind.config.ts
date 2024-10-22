import withMT from "@material-tailwind/react/utils/withMT";

module.exports = withMT({
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "card-background-gradient":
          "linear-gradient(to bottom, #E1E7388F, #39FF148F)",
      },
      colors: {
        "neon-green": "#39FF14",
        "electric-yellow": "#FFFF33",
        "deep-turquoise": "#00CED1",
        primary: "#E1E738",
      },
      boxShadow: {
        "card-shadow": "0 2px 5px rgba(125, 255, 125, 0.5)",
      },
    },
  },
  plugins: [],
});
