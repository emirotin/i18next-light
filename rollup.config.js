import babel from "rollup-plugin-babel";
import nodeResolve from "rollup-plugin-node-resolve";
import { terser } from "rollup-plugin-terser";

const getBabelOptions = ({ useESModules }) => ({
  exclude: /node_modules/,
  runtimeHelpers: true,
  plugins: [["@babel/transform-runtime", { useESModules }]],
});

const input = "./src/index.js";
const name = "i18next-light";
// check relative and absolute paths for windows and unix
const external = (id) => !id.startsWith(".") && !id.startsWith("/") && !id.includes(":");

export default [
  {
    input,
    output: { format: "cjs", file: `dist/cjs/${name}.js` },
    external,
    plugins: [babel(getBabelOptions({ useESModules: false }))],
  },
  {
    input,
    output: { format: "umd", name, file: `dist/umd/${name}.js` },
    plugins: [babel(getBabelOptions({ useESModules: true })), nodeResolve()],
  },
  {
    input,
    output: { format: "umd", name, file: `dist/umd/${name}.min.js` },
    plugins: [babel(getBabelOptions({ useESModules: true })), nodeResolve(), terser()],
  },
];
