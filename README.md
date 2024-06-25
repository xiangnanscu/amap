# @xiangnanscu/amap

[@xiangnanscu/amap](https://xiangnanscu.github.io/amap/) transform lua to js literally.

# Install

```sh
npm install -g @xiangnanscu/amap
```

# Usage

## command

Concat one or more js files and transform them to one lua string:

```sh
amap [options] file1, file2, ...
```

where options are:

```js
const defaultOptions = {
  printToConsoleLog: true,
  tryUseOfLoop: true,
  indexMinusOne: true,
  returnNilToThrow: true,
  errorToThrow: true,
  tostring: true,
  dict: true,
  list: true,
  unpack: true,
  tonumber: true,
  class: true,
  selfToThis: true,
  clsToThis: true,
  typeToTypeof: true,
  stringFormat: true,
  tableConcat: true,
  tableInsert: true,
  camelStyle: false,
};
```

### examples

Basic:

```sh
amap foo.lua > foo.js
```

To disable a feature `--no-[option]`:

```sh
amap --no-camelStyle foo.lua
```

To enable a feature `--[option]`:

```sh
amap --camelStyle foo.lua
```

## api

```js
import { amap } from "amap";

const jscode = amap(`local snake_var = 1`, { camelStyle: true });
// let snakeVar = 1;
```

## see also

[@xiangnanscu/js2lua](https://xiangnanscu.github.io/js2lua/) transform js to lua
