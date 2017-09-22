// new rollup.config.js
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

import shebang from "rollup-plugin-shebang";
import json from "rollup-plugin-json";

export default {
  input: "./src/index.js",
  output: {
    file: "./build/index.js",
    format: "cjs",
    name: "eggs",
    sourcemap: true
  },
  plugins: [
    shebang(),
    json()/*,
    resolve(),
    commonjs() */
  ]
};
