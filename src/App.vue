<script setup>
import { onMounted } from "vue";
</script>

<template>
  <RouterLink to="/Home">Home</RouterLink>
  <suspense><router-view /></suspense>
</template>
