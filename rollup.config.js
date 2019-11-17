// @ts-check

import ts from "@wessberg/rollup-plugin-ts"

/** @type { import("rollup").RollupOptions } */
const options = {
  input: "src/index.ts",
  output: [
    { file: "dist/index.js", format: "cjs" },
    { file: "dist/index.mjs", format: "esm" }
  ],
  plugins: [ts()]
}

export default options
