<script setup lang="ts">
"use strict"
import { useSettingsStore } from "@/stores/settings"
import { ref } from "vue"
import { useLocalStorage } from "@vueuse/core"
const settings = useSettingsStore().settings
/* console.log(settings) */
const folded = useLocalStorage("folded", false)
// Spaces seems invalid
const foldSign = ref(folded ? "  ∨  " : "  ∧  ")
function fold() {
  folded.value = !folded.value
  foldSign.value = foldSign.value === "  ∧  " ? "  ∨  " : "  ∧  "
}
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
    <h2>
      <button @click="fold">Settings{{ foldSign }}</button>
    </h2>
    <ul v-show="!folded">
      <template v-for="(property, item) in settings" :key="item">
        <li>
          {{ property.description }}:
          <button v-if="typeof property.value === 'boolean'" @click="toggle(property)">
            {{ property.value }}
          </button>
          <input v-else v-model="property.value" type="number" />
        </li>
      </template>
      <button @click="reset">Reset and reload current page</button>
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
  :is(button) {
    background-color: transparent;
    border: none;
  }
  :is(button):hover {
    color: #00aa00;
    font-weight: bold;
    cursor: pointer;
  }
}
</style>
