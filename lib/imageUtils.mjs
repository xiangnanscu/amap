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

const PI = Math.PI;
const A = 6378245.0;
// eslint-disable-next-line no-loss-of-precision
const EE = 0.00669342162296594323;

function outOfChina(lng, lat) {
  // China region - latitude: 3.86 ~ 53.55, longitude: 73.66 ~ 135.05
  return !(lng > 73.66 && lng < 135.05 && lat > 3.86 && lat < 53.55);
}

function transformLat(x, y) {
  let ret = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x));
  ret += ((20.0 * Math.sin(6.0 * x * PI) + 20.0 * Math.sin(2.0 * x * PI)) * 2.0) / 3.0;
  ret += ((20.0 * Math.sin(y * PI) + 40.0 * Math.sin((y / 3.0) * PI)) * 2.0) / 3.0;
  ret += ((160.0 * Math.sin((y / 12.0) * PI) + 320 * Math.sin((y * PI) / 30.0)) * 2.0) / 3.0;
  return ret;
}

function transformLon(x, y) {
  let ret = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x));
  ret += ((20.0 * Math.sin(6.0 * x * PI) + 20.0 * Math.sin(2.0 * x * PI)) * 2.0) / 3.0;
  ret += ((20.0 * Math.sin(x * PI) + 40.0 * Math.sin((x / 3.0) * PI)) * 2.0) / 3.0;
  ret += ((150.0 * Math.sin((x / 12.0) * PI) + 300.0 * Math.sin((x / 30.0) * PI)) * 2.0) / 3.0;
  return ret;
}

export function wgs84ToGcj02([lng, lat]) {
  if (outOfChina(lng, lat)) {
    return [lng, lat];
  }
  let dLat = transformLat(lng - 105.0, lat - 35.0);
  let dLon = transformLon(lng - 105.0, lat - 35.0);
  const radLat = (lat / 180.0) * PI;
  let magic = Math.sin(radLat);
  magic = 1 - EE * magic * magic;
  const sqrtMagic = Math.sqrt(magic);
  dLat = (dLat * 180.0) / (((A * (1 - EE)) / (magic * sqrtMagic)) * PI);
  dLon = (dLon * 180.0) / ((A / sqrtMagic) * Math.cos(radLat) * PI);
  const mgLat = lat + dLat;
  const mgLon = lng + dLon;
  return [mgLon, mgLat];
}

export function gcj02ToWgs84(lng, lat) {
  if (outOfChina(lng, lat)) {
    return [lng, lat];
  }
  let dLat = transformLat(lng - 105.0, lat - 35.0);
  let dLon = transformLon(lng - 105.0, lat - 35.0);
  const radLat = (lat / 180.0) * PI;
  let magic = Math.sin(radLat);
  magic = 1 - EE * magic * magic;
  const sqrtMagic = Math.sqrt(magic);
  dLat = (dLat * 180.0) / (((A * (1 - EE)) / (magic * sqrtMagic)) * PI);
  dLon = (dLon * 180.0) / ((A / sqrtMagic) * Math.cos(radLat) * PI);
  const mgLat = lat + dLat;
  const mgLon = lng + dLon;
  return [lng * 2 - mgLon, lat * 2 - mgLat];
}

export async function getImageGPS(url) {
  const data = await parseImage(url);
  console.log({ data });
  const gpsLatitude = data.GPSLatitude;
  const gpsLongitude = data.GPSLongitude;
  if (Array.isArray(gpsLatitude) && Array.isArray(gpsLongitude)) {
    const lat = gpsLatitude[0] + gpsLatitude[1] / 60 + gpsLatitude[2] / 3600;
    const lon = gpsLongitude[0] + gpsLongitude[1] / 60 + gpsLongitude[2] / 3600;
    return wgs84ToGcj02([lon, lat]);
  } else {
    return [];
  }
}
