const { resolve } = require("path");
const { defineConfig } = require("vite");

module.exports = defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "p5.modulate",
      fileName: (format) => `p5.modulate.${format}.js`,
      formats: ["umd"],
    },
  },
  resolve: {
    alias: [
      {
        find: /^@/,
        replacement: resolve(__dirname, "src"),
      },
    ],
  },
  // test: {
  //   include: ["tests/unit/**/*.test.ts"],
  //   environment: "happy-dom",
  // },
});
