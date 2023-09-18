<script setup lang="ts">
"use strict"
import { useSettingsStore } from "@/stores/settings"
import { ref } from "vue"
const settings = useSettingsStore().settings
const reset = useSettingsStore().reset
const folded = ref(false)
const foldSign = ref("∨")
function fold() {
  folded.value = !folded.value
  foldSign.value = foldSign.value === "∧" ? "∨" : "∧"
}
</script>
<template>
  <section>
    <h2>
      Settings <span @click="fold">{{ foldSign }}</span>
    </h2>
    <ul v-show="!folded">
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
