import { format } from "https://deno.land/std/datetime/mod.ts";
import { sassCmd, rollupCmd } from "./command.js";

const filePath = (path) => `${Deno.cwd()}/${path}`;

const dist = filePath("dist");

const rmDist = () => {
  try {
    Deno.removeSync(dist, { recursive: true });
  } catch (error) {}
};
rmDist();

const recursiveCopyFile = async (fpath, tpath) => {
  for await (const dirEntry of Deno.readDir(fpath)) {
    const fromFile = `${fpath}/${dirEntry.name}`;
    const toFile = `${tpath}/${dirEntry.name}`;
    if (dirEntry.isFile && dirEntry.name !== ".DS_Store") {
      await Deno.mkdir(tpath, { recursive: true });
      Deno.copyFile(fromFile, toFile);
    }
    if (dirEntry.isDirectory) {
      recursiveCopyFile(fromFile, toFile);
    }
  }
};

recursiveCopyFile(filePath("src"), dist);

console.log("结构生成完成！");

const buildInfo = (buildType) => {
  console.log(
    "[Error]",
    format(new Date(), "yyyy-MM-dd HH:mm:ss"),
    `${buildType} 编译失败！`
  );
  rmDist();
  console.log(
    "[Success]",
    format(new Date(), "yyyy-MM-dd HH:mm:ss"),
    "回滚完成！"
  );
  Deno.exit(codeSass);
};

const cpSass = Deno.run({
  cmd: [
    filePath(sassCmd.cmd),
    ...sassCmd.opts(
      filePath("src/styles/dark-support.css"),
      filePath("dist/styles/dark-support.css"),
      false
    ),
  ],
  stdout: "inherit",
  stderr: "inherit",
});

const { code: codeSass } = await cpSass.status();
if (codeSass !== 0) buildInfo();

console.log(
  "[Success]",
  format(new Date(), "yyyy-MM-dd HH:mm:ss"),
  "Sass 编译完成！"
);

const cpRollup = Deno.run({
  cmd: [filePath(rollupCmd.cmd), ...rollupCmd.opts(false)],
  stdout: "inherit",
  stderr: "inherit",
});

const { code: codeRollup } = await cpRollup.status();
if (codeRollup !== 0) buildInfo("Rollup");

console.log(
  "[Success]",
  format(new Date(), "yyyy-MM-dd HH:mm:ss"),
  "Rollup 编译完成！"
);

try {
  Deno.removeSync(filePath("dist/styles/dark-support.css.map"));
} catch (error) {}

console.log(
  "[Success]",
  format(new Date(), "yyyy-MM-dd HH:mm:ss"),
  "构建完成！"
);

