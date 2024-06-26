export const getBounds = (coordinates: [number, number][]): [number[], number[]] => {
  let minLat = Number.MAX_VALUE;
  let maxLat = Number.MIN_VALUE;
  let minLng = Number.MAX_VALUE;
  let maxLng = Number.MIN_VALUE;

  for (const coordinate of coordinates) {
    const lat = coordinate[0];
    const lng = coordinate[1];
    minLat = Math.min(minLat, lat);
    maxLat = Math.max(maxLat, lat);
    minLng = Math.min(minLng, lng);
    maxLng = Math.max(maxLng, lng);
  }

  return [
    [maxLat, maxLng],
    [minLat, minLng],
  ];
};

export const getZoomLevel = (bounds: [number[], number[]], mapDim: [number, number]): number => {
  const WORLD_DIM = 256;
  const ZOOM_MAX = 21;

  const ne = bounds[0];
  const sw = bounds[1];

  const latDiff = ne[0] - sw[0];
  const lngDiff = ne[1] - sw[1];

  const latZoom = Math.log((mapDim[0] * 360) / latDiff / WORLD_DIM) / Math.log(2);
  const lngZoom = Math.log((mapDim[1] * 180) / lngDiff / WORLD_DIM) / Math.log(2);
  return Math.min(Math.min(latZoom, lngZoom), ZOOM_MAX);
};

export const getCenterPoint = (bounds: [number[], number[]]): [number, number] => {
  const ne = bounds[0];
  const sw = bounds[1];

  const lat = (ne[0] + sw[0]) / 2;
  const lng = (ne[1] + sw[1]) / 2;

  return [lat, lng];
};

// 示例用法
// const coordinates = [
// [30.123, 120.456],
// [31.789, 121.789],
// [32.456, 122.123],
// // 添加更多坐标点
// ];
// const bounds = getBounds(coordinates);
// const mapDim = [800, 600];
// const zoomLevel = getZoomLevel(bounds, mapDim);
// const centerPoint = getCenterPoint(bounds);
