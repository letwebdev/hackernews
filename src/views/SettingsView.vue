<script setup lang="ts">
import SettingItems from "@/components/SettingItems.vue"
</script>
<template>
  <main class="wrapper">
    <h1>Settings</h1>
    <SettingItems />
  </main>
</template>

<style scoped>
@media (width >= 1024px) {
  .wrapper {
    display: block;
    align-items: center;
    margin: 7% 0 0 5%;
  }
}
</style>
