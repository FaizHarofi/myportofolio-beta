export default {
  multipass: true,
  js2svg: {
    indent: 0,
  },
  plugins: [
    {
      name: "preset-default",
      params: {
        overrides: {
          // Keep viewBox for responsive scaling
          removeViewBox: false,
          // Keep IDs (might be referenced via xlink:href, aria-labelledby, etc.)
          cleanupIds: false,
        },
      },
    },
  ],
};
