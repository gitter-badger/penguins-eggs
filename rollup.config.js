// new rollup.config.js

import shebang from 'rollup-plugin-shebang';
import json from "rollup-plugin-json";

export default {
  input: "./src/index.js",
  output: {
    file: "./build/index.js",
    format: "cjs",
    name: "teggs",
    sourcemap: true
  },
  plugins: [
     shebang(),
     json()
   ]
};
