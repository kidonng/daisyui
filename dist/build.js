import { expandGlobSync, emptyDirSync, ensureDirSync } from "std/fs/mod.ts";
import { dirname, basename } from "std/path/mod.ts";
import postcss from "postcss";
import nested from "postcss-nested";
import stripIndent from "strip-indent";
import themes from "daisyui/src/colors/themes";
import functions from "daisyui/src/colors/functions";
import { replacePrefix, replaceSlash, writeIndex } from "./utils.ts";
const processor = postcss([nested]);
const root = "daisyui/src";
const stripRoot = (path) => path.replace(`${Deno.cwd()}/${root}/`, "");
const dirs = ["base", "themes", "components", "utilities"];
const [baseDir, themesDir, ...styleDirs] = dirs;
for (const dir of dirs) {
  emptyDirSync(dir);
  writeIndex(".", `${dir}/index.css`, dir !== dirs[0]);
}
for (const { path } of expandGlobSync(`${root}/${baseDir}/*.css`)) {
  const dest = stripRoot(path);
  const css = replaceSlash(replacePrefix(Deno.readTextFileSync(path)));
  console.log("Writing", dest);
  Deno.writeTextFileSync(dest, css);
  writeIndex(baseDir, basename(dest));
}
for (const { path } of expandGlobSync(
  `${root}/{${styleDirs.join(",")}}/**/*.css`
)) {
  const dest = stripRoot(path);
  const destDir = dirname(dest);
  ensureDirSync(destDir);
  const rawCss = replaceSlash(replacePrefix(Deno.readTextFileSync(path)));
  const { css } = processor.process(rawCss);
  console.log("Writing", dest);
  Deno.writeTextFileSync(dest, css);
  writeIndex(destDir, basename(dest));
}
const order = /* @__PURE__ */ new Map([
  ["global", 0],
  ["unstyled", 1],
  ["styled", 2]
]);
for (const dir of styleDirs) {
  const ordered = [];
  const unordered = [];
  for (const { name } of Deno.readDirSync(dir)) {
    if (order.has(name)) {
      ordered[order.get(name)] = name;
    } else {
      unordered.push(name);
    }
  }
  for (const name of [...ordered.filter(Boolean), ...unordered])
    writeIndex(dir, `${name}/index.css`);
}
const auto = /* @__PURE__ */ new Map();
const autoCss = "auto.css";
writeIndex(themesDir, autoCss);
for (const [selector, theme] of Object.entries(themes)) {
  const [, name] = /\[data-theme=(.+)]/.exec(selector);
  const vars = functions.convertToHsl(theme);
  const css = stripIndent(`
		${selector} {
			${Object.entries(vars).map(
    ([prop, value]) => [prop, value.replaceAll(" ", ", ")].join(": ")
  ).join(";\n			")};
		}
	`).trim();
  const file = `${name}.css`;
  const dest = `${themesDir}/${file}`;
  console.log("Writing", dest);
  Deno.writeTextFileSync(dest, css);
  writeIndex(themesDir, file);
  if (name === "dark" || name === "light")
    auto.set(name, css.replace(selector, ":root"));
}
const autoDest = `${themesDir}/${autoCss}`;
console.log("Writing", autoDest);
Deno.writeTextFileSync(
  autoDest,
  `${auto.get("light")}
@media (prefers-color-scheme: dark) {
${auto.get(
    "dark"
  )}
}`
);
