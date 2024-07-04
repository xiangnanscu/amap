<script setup>
const getPoints = async (logs) => {
  const points = [];
  for (const e of logs) {
    if (e.location) {
      points.push({
        x: e.location.longitude,
        y: e.location.latitude,
        img: e.pics[0],
        name: e.name,
      });
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
const data = await usePost("/project_watch_log/query", {
  select: ["project_watch_id__title", "location", "video", "name", "pics"],
});

const points = await getPoints(data);
log({ points });
</script>

<template>
  <MapContainer :points="points" />
</template>
