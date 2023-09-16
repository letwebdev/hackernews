<script setup lang="ts">
"use strict"
import SettingItems from "@/components/SettingItems.vue"
</script>
<template>
  <main class="settings">
    <h2>Settings</h2>
    <SettingItems />
  </main>
</template>

<style>
@media (min-width: 1024px) {
  .settings {
    margin-top: 30%;
    min-height: 100vh;
    display: block;
    align-items: center;
  }
}
</style>
