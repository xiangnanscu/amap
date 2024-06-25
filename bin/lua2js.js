#!/usr/bin/env node

import { amap, defaultOptions } from "../src/amap.mjs";
import fs from "fs";
import yargsParser from "yargs-parser";

const argv = yargsParser(process.argv.slice(2), {
  boolean: Object.keys(defaultOptions),
  alias: {
    // o1: "option1",
  },
});

const files = argv._;
// console.log(argv);
files.forEach((file) => {
  const luaCode = fs.readFileSync(file, "utf8");
  const jsCode = amap(luaCode, argv);
  console.log(jsCode);
});
