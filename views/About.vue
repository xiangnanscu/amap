<script setup>
const imageURL = "https://lzwlkj.oss-cn-shenzhen.aliyuncs.com/jahy/vc-upload-1713342032387-22.jpg";

// fetch(imageURL).then(async (response) => {
//   const reader = response.body.getReader();
//   let received = 0;
//   const total = response.headers.get("Content-Length");

//   while (1) {
//     const result = await reader.read();
//     if (result.done) {
//       console.log("Download complete!");
//       break;
//     }

//     received += result.value.length;
//     const progress = (received / total) * 100;
//     console.log(`Progress: ${progress.toFixed(2)}%`);
//     if (received == total) {
//       break;
//     }
//   }
// });
const img1 = ref();
onMounted(async () => {
  img1.value = document.getElementById("img1");
  const tags = await imageUtils.getImageGPS(imageURL);
  log(tags);
  for (const [k, v] of Object.entries(tags)) {
    if (k.startsWith("GPS")) {
      if (Array.isArray(v)) {
        for (const e of v) {
          log(k, e);
        }
      }
      log(k, v);
    }
  }
});
// 用你的图片URL替换这里的URL

const upload = async (e) => {
  const res = await imageUtils.parseImage(e.target.files[0]);
  log("upload", res);
};
const text = ref("");
</script>

<template>
  <button @click="main">test</button>
  <input @input="upload" type="file" />
  <div id="makeAndModel"></div>
  <div><img :src="imageURL" id="img1" /></div>
</template>

<style scoped>
:deep(.ant-table-tbody) > tr > td {
  padding: 8px;
}

.logo {
  font-size: 150%;
  padding: 0 8px;
  margin-left: -40px;
}
</style>
