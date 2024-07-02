<script setup>
import { onMounted, onUnmounted } from "vue";
import AMapLoader from "@amap/amap-jsapi-loader";

const props = defineProps({
  points: { type: Array, default: () => [] },
  AMAP_SECRET: { type: String },
  AMAP_KEY: { type: String },
});
const nowDiv = ref();
const xys = computed(() => props.points.map((p) => [p.x, p.y]));
function calculateCentroid(coords) {
  const sumLat = coords.reduce((a, b) => a + b[0], 0);
  const sumLon = coords.reduce((a, b) => a + b[1], 0);
  const centroid = [sumLat / coords.length, sumLon / coords.length];
  return centroid;
}
// https://blog.csdn.net/qq_38003260/article/details/132412635
// https://blog.csdn.net/qq_40156604/article/details/88953660
let map = null;
onMounted(async () => {
  window._AMapSecurityConfig = {
    securityJsCode: props.AMAP_SECRET || process.env.AMAP_SECRET,
  };
  const AMap = await AMapLoader.load({
    key: props.AMAP_KEY || process.env.AMAP_KEY,
    version: "2.0",
    plugins: ["AMap.Scale"],
  });
  const centerXY = calculateCentroid(xys.value);
  const markers = props.points.map(
    (p) =>
      new AMap.Marker({
        position: [p.x, p.y],
        title: `${p.name}${p.x}|${p.y}`,
        draggable: true,
      }),
  );
  map = new AMap.Map("container", {
    viewMode: "2D", // 是否为3D地图模式
    zoom: 10, // 初始化地图级别
    center: centerXY, // 初始化地图中心点位置
  });

  const { width, height } = map.getSize();
  const bounds = amapUtils.getBounds(xys.value);
  const mapDim = [width, height];
  const zoomLevel = amapUtils.getZoomLevel(bounds, mapDim);
  const centerPoint = amapUtils.getCenterPoint(bounds);
  console.log({ markers, zoomLevel, centerPoint, centerXY });
  map.setZoom(zoomLevel);
  map.add(markers);
  map.on("click", function (e) {
    // Get the clicked point's coordinates
    var point = e.lnglat;
    var marker = new AMap.Marker({
      position: point,
      title: "Clicked point",
      draggable: true,
    });
    marker.on("dragend", function (event) {
      console.log("Marker has been moved to:", event.lnglat);
      console.log(marker);
    });
    marker.on("rightclick", function (event) {
      // Remove the marker from the map
      marker.remove();
    });
    map.add(marker);
    console.log("Clicked point coordinates:", point.lng, point.lat);
  });
});
onUnmounted(() => {
  map?.destroy();
});
</script>

<template>
  <div id="container" ref="nowDiv"></div>
</template>

<style scoped>
#container {
  width: 100%;
  height: 800px;
}
</style>
