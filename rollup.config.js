// new rollup.config.js

export default {
  input: "src/index.js",
  output: {
    file: "build/tux-eggs.js",
    format: "cjs",
    name: "tux-eggs",
    sourcemap: true
  }};
