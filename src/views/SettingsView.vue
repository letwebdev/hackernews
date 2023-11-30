<script setup lang="ts">
"use strict"
import SettingItems from "@/components/SettingItems.vue"
</script>
<template>
  <main class="wrapper">
    <h1>Settings</h1>
    <SettingItems />
  </main>
</template>

<style scoped>
@media (min-width: 1024px) {
  .wrapper {
    margin: 7% 0 0 5%;
    display: block;
    align-items: center;
  }
}
</style>
