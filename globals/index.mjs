export * as imageUtils from "~/lib/imageUtils.mjs";
export * as amapUtils from "~/lib/amapUtils";
export { default as Http, usePost, useGet } from "~/lib/Http.mjs";

export const log = (...x) => {
  console.log(...x);
};
