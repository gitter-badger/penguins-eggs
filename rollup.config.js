// new rollup.config.js

export default {
  input: "src/index.js",
  output: {
    file: "build/teggs.js",
    format: "cjs",
    name: "teggs",
    sourcemap: true
  }};
