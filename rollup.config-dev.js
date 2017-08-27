// new rollup.config.js
import json from "rollup-plugin-json";
import commonjs from "rollup-plugin-commonjs";
import nodeResolve from "rollup-plugin-node-resolve";
import nodeBuiltins from "rollup-plugin-node-builtins";
import nodeGlobals from "rollup-plugin-node-globals";
import babel from 'rollup-plugin-babel';

export default {
  input: "src/index.js",
  output: {
    file: "bundle/eggs.js",
    format: "cjs",
    name: "Eggs",
    sourcemap: true
  },
  plugins: [
    nodeResolve({
      jsnext: true,
      main: true,
      browser: false,
      extensions: [".js", ".json"]
    }) ,
    commonjs({
      include: "node_modules/**",
      extensions: [".js", ".coffee"],
      ignoreGlobal: false,
      sourceMap: true
    }),
    babel({
      exclude: "node_modules/**"
    }),
    json(),
    nodeBuiltins(),
    nodeGlobals()
  ]
};
