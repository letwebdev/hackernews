<script setup lang="ts">
"use strict"
import { useSettingsStore } from "@/stores/settings"
const settings = useSettingsStore().settings
const reset = useSettingsStore().reset
</script>
<template>
  <section>
    <h2>Settings</h2>
    <ul>
      <template v-for="(properties, item) in settings" :key="item">
        <li>
          {{ properties.description }}:
          <button
            v-if="typeof properties.value === 'boolean'"
            @click="properties.value = !properties.value"
          >
            {{ properties.value }}
          </button>
          <input v-else v-model="properties.value" type="number" />
        </li>
      </template>
      <button @click="reset">reset</button>
    </ul>
  </section>
</template>
<style scoped>
button {
  border-radius: 5px;
  /* cursor: pointer; */
  z-index: 2;
}
h2 {
  color: hsla(160, 92%, 27%, 1);
}
</style>
