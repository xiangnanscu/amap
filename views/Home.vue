<script setup>
import { createFetch } from "@vueuse/core";
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
const getPoints = async (logs) => {
  const points = [];
  for (const e of logs) {
    if (e.location) {
      points.push({ x: e.location.longitude, y: e.location.latitude, img: e.pics[0], name: e.name });
    } else if (e.pics) {
      for (const imgurl of e.pics) {
        const [x, y] = await imageUtils.getImageGPS(imgurl);
        if (x) {
          points.push({ x, y, img: imgurl, name: e.name });
          break;
        }
      }
    }
  }
  return points;
};
const { data } = await useMyFetch("/project_watch_log/query")
  .post({ payload: { select: ["project_watch_id__title"] } })
  .json();
const points = await getPoints(data.value);
log({ points });
</script>

<template>
  <MapContainer :points="points" />
</template>
