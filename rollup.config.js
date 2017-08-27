// new rollup.config.js

export default {
  input: "src/index.js",
  output: {
    file: "bundle/eggs.js",
    format: "cjs",
    name: "Eggs",
    sourcemap: true
  }};
