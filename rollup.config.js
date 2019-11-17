// @ts-check

import ts from "@wessberg/rollup-plugin-ts"
import nodeResolve from "rollup-plugin-node-resolve"

/** @type { import("rollup").RollupOptions } */
const options = {
  input: "src/index.ts",
  output: [
    { file: "dist/index.js", format: "cjs", exports: "named" },
    { file: "dist/index.mjs", format: "esm" }
  ],
  plugins: [nodeResolve(), ts()]
}

export default options
