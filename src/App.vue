<script setup>
import { onMounted } from "vue";
</script>

<template>
  <RouterLink to="/Home">Projects</RouterLink>|
  <RouterLink to="/About">About</RouterLink>
  <suspense><router-view /></suspense>
</template>
