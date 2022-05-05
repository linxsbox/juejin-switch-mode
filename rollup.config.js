import { content_scripts, background } from "./src/manifest.json";
import json from "@rollup/plugin-json";
import { terser } from "rollup-plugin-terser";

const fileTree = {
  js: content_scripts[0].js[0],
  css: content_scripts[0].css,
  sw: background.service_worker,
};

export default {
  input: "./src/scripts/switch-mode.js",
  output: [
    {
      file: `./dist/${fileTree.js}`,
      format: "iife",
      name: "jsm",
    },
  ],
  plugins: [json({ preferConst: true }), terser()],
  watch: {
    include: "src/**",
  },
};
