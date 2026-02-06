module.exports = {
  mode: "jit",
  content: ["./src/**/*.{js,ts,jsx,tsx}", "./public/**/*.html"],
  theme: {
    extend: {
      spacing: {
        0.1: "1px",
        0.3: "3px",
        0.7: "7px",
      },
      backgroundImage: {
        "mobile-app": "url(images/image.png)",
      },
      colors: (theme) => ({
        "brand-color": "#f27a1b",
      }),
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
