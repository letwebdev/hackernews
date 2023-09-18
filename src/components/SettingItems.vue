<script setup lang="ts">
"use strict"
import { useSettingsStore } from "@/stores/settings"
const settings = useSettingsStore().settings
const reset = useSettingsStore().reset
</script>
<template>
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
</template>
<style>
button {
  border-radius: 5px;
  /* cursor: pointer; */
  z-index: 2;
}
</style>
