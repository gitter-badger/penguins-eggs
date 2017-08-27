// new rollup.config.js
import json from "rollup-plugin-json";
import commonjs from "rollup-plugin-commonjs";
import nodeResolve from "rollup-plugin-node-resolve";
import nodeBuiltins from "rollup-plugin-node-builtins";
import nodeGlobals from "rollup-plugin-node-globals";
import babel from "rollup-plugin-babel";

export default {
  input: "src/index.js",
  output: {
    file: "build/eggs.js",
    format: "cjs",
    name: "Eggs",
    sourcemap: true
  },
  plugins: [
    commonjs({
      namedExports: {
        "node_modules/buffer-es6/index.js": ["bufferEs6"],
        "node_modules/es6/index.js": ["stringDecoder"]
      },
      include: "node_modules/**",
      extensions: [".js", ".coffee"],
      ignoreGlobal: false,
      sourceMap: true
    }),
    nodeResolve({
      jsnext: true,
      main: true,
      browser: false,
      extensions: [".js", ".json"],
      preferBuiltins: true,
      modulesOnly: false
    }),
    babel({
      babelrc: false,
      sourceMap: true,
      exclude: "node_modules/**", // only transpile our source code
      plugins: [["external-helpers"]]
    }),
    json(),
    nodeBuiltins(),
    nodeGlobals()
  ]
};
