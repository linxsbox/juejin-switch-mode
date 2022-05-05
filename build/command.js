export const sassCmd = {
  cmd: "node_modules/.bin/sass",
  opts: (icss, ocss, isDev = true) => {
    const cmdOpts = [
      `${icss}:${ocss}`,
      `--style=${isDev ? "expanded" : "compressed"}`,
      "--color",
    ];
    isDev && cmdOpts.unshift("--watch");
    !isDev && cmdOpts.push("--no-source-map");

    return cmdOpts;
  },
};

export const rollupCmd = {
  cmd: "node_modules/.bin/rollup",
  opts: (isDev = true) => {
    const cmdOpts = ["-c"];
    isDev && cmdOpts.push("--watch");
    return cmdOpts;
  },
};
