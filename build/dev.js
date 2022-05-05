import path from "path";
import { fork } from "child_process";
import { sassCmd, rollupCmd } from "./command.js";

const inputCss = path.resolve("./src/styles/dark-support.css");
const outputCss = path.resolve("./dist/styles/dark-support.css");

console.log(sassCmd.opts(inputCss, outputCss, true));
const sassFork = fork(sassCmd.cmd, sassCmd.opts(inputCss, outputCss, true));
sassFork.on("error", (err) => {
  console.log("[Sass Fork Error]", err);
});
const rollupFork = fork(rollupCmd.cmd, rollupCmd.opts(true));
rollupFork.on("error", (err) => {
  console.log("[Rollup Fork Error]", err);
});
