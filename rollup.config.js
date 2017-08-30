// new rollup.config.js

import shebang from 'rollup-plugin-shebang';

export default {
  input: "src/index.js",
  output: {
    file: "build/teggs.js",
    format: "cjs",
    name: "teggs",
    sourcemap: true
  },
  plugins: [
     shebang()
   ]
};
