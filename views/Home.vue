<script setup>
const getPoints = async (logs) => {
  const points = [];
  for (const e of logs) {
    if (e.location) {
      points.push({
        x: e.location.longitude,
        y: e.location.latitude,
        img: e.pic,
        name: e.name,
      });
    } else if (e.pic) {
      const [x, y] = await imageUtils.getImageGPS(e.pic);
      if (x) {
        points.push({ x, y, img: imgurl, name: e.name });
        break;
      }
    }
  }
  return points;
};

const data = [
  {
    project_watch_id__title: "测试项目",
    location: {
      longitude: 120.456,
      latitude: 30.123,
    },
    name: "测试点位A",
    pic: "https://jahykj.cn/static/images/logo.png",
  },
  {
    project_watch_id__title: "测试项目",
    location: {
      longitude: 120.209,
      latitude: 30.245,
    },
    name: "测试点位B",
    pic: "https://jahykj.cn/static/images/logo.png",
  },
  {
    project_watch_id__title: "测试项目",
    location: {
      longitude: 120.587,
      latitude: 30.287,
    },
    name: "测试点位C",
    pic: "https://jahykj.cn/static/images/logo.png",
  },
];

const points = await getPoints(data);
log({ points });
</script>

<template>
  <MapContainer :points="points" />
</template>
