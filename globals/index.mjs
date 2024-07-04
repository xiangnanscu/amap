export * as imageUtils from "~/lib/imageUtils.mjs";
export * as amapUtils from "~/lib/amapUtils";
export * as utils from "~/lib/utils.mjs";
export * as helpers from "~/lib/helpers.js";
export { default as Http, usePost, useGet } from "~/lib/Fetch.mjs";
export { default as Docx } from "~/lib/Docx";
export { default as Alioss } from "~/lib/Alioss";
export { default as Xlsx } from "~/lib/Xlsx";

export const log = (...x) => {
  console.log(...x);
};
