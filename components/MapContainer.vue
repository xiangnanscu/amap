<script setup>
import { onMounted, onUnmounted } from "vue";
import AMapLoader from "@amap/amap-jsapi-loader";
import { createFetch } from "@vueuse/core";
const props = defineProps({
  AMAP_SECRET: { type: String },
  AMAP_KEY: { type: String },
});
let map = null;
const nowDiv = ref();
const useMyFetch = createFetch({
  baseUrl: "https://jahykj.cn",
  options: {
    async beforeFetch({ options }) {
      // const myToken = await getMyToken()
      // options.headers.Authorization = `Bearer ${myToken}`

      return { options };
    },
  },
  fetchOptions: {
    mode: "cors",
  },
});
function calculateCentroid(coords) {
  const sumLat = coords.reduce((a, b) => a + b[0], 0);
  const sumLon = coords.reduce((a, b) => a + b[1], 0);
  const centroid = [sumLat / coords.length, sumLon / coords.length];
  return centroid;
}
// https://blog.csdn.net/qq_38003260/article/details/132412635
// https://blog.csdn.net/qq_40156604/article/details/88953660
onMounted(async () => {
  const { data } = await useMyFetch("/project_watch_log/query")
    .post({ payload: { select: ["project_watch_id__title"] } })
    .json();

  // console.log(logs);
  window._AMapSecurityConfig = {
    securityJsCode: props.AMAP_SECRET || process.env.AMAP_SECRET,
  };
  AMapLoader.load({
    key: props.AMAP_KEY || process.env.AMAP_KEY, // 申请好的Web端开发者Key，首次调用 load 时必填
    version: "2.0", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
    plugins: ["AMap.Scale"], //需要使用的的插件列表，如比例尺'AMap.Scale'，支持添加多个如：['...','...']
  })
    .then((AMap) => {
      const xys = data.value.filter((e) => e.location).map((e) => [e.location.longitude, e.location.latitude]);
      const centerXY = calculateCentroid(xys);
      const markers = data.value
        .filter((e) => e.location)
        .map(
          (e) =>
            new AMap.Marker({
              position: [e.location.longitude, e.location.latitude],
              title: e.location.address,
            }),
        );
      console.log(centerXY);
      map = new AMap.Map("container", {
        // 设置地图容器id
        viewMode: "3D", // 是否为3D地图模式
        zoom: 10, // 初始化地图级别
        center: centerXY, // 初始化地图中心点位置
      });
      console.log(markers, map.getSize());
      const { width, height } = map.getSize();
      const bounds = getBounds(xys);
      const mapDim = [width, height];
      const zoomLevel = getZoomLevel(bounds, mapDim);
      const centerPoint = getCenterPoint(bounds);
      console.log({ zoomLevel, centerPoint, centerXY });
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
        });
        marker.on("rightclick", function (event) {
          // Remove the marker from the map
          marker.remove();
        });
        map.add(marker);
        console.log("Clicked point coordinates:", point.lng, point.lat);
      });
    })
    .catch((e) => {
      console.log(e);
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
