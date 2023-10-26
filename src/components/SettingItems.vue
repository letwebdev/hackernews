<script setup lang="ts">
"use strict"
import { useSettingsStore } from "@/stores/settings"
const settings = useSettingsStore().settings
/* console.log(settings) */
function toggle(property: { value: boolean }) {
  property.value = !property.value
}
function reset() {
  localStorage.removeItem("settings")
  // BUG: have to refresh to make reset() take effect
  window.location.reload()
}
</script>
<template>
  <section>
    <ul>
      <template v-for="(property, item) in settings" :key="item">
        <li>
          {{ property.description }}:
          <button v-if="typeof property.value === 'boolean'" @click="toggle(property)">
            {{ property.value }}
          </button>
          <input v-else v-model="property.value" type="number" />
        </li>
      </template>
    </ul>
    <button @click="reset">Reset and reload current page</button>
  </section>
</template>
<style scoped>
button {
  border-radius: 5px;
  &:hover {
    cursor: pointer;
  }
}
</style>
