import { useFetch } from "@vueuse/core";
import { EXIF } from "@xnscu/exif-js";

export function parseImageBlob(blob) {
  return EXIF.readFromBinaryFile(blob);
}

export async function parseImageUrl(url) {
  const {
    data: { value },
  } = await useFetch(url).get().arrayBuffer();
  return parseImageBlob(value);
}

export async function parseImage(data) {
  if (typeof data == "string") {
    return await parseImageUrl(data);
  } else if (data instanceof self.Blob || data instanceof self.File) {
    return new Promise((resolve, reject) => {
      EXIF.getData(data, function () {
        resolve(EXIF.getAllTags(this));
      });
    });
  } else {
    throw `invalid type`;
  }
}

export async function getImageGPS(url) {
  const data = await parseImage(url);
}
