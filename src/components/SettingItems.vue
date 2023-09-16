<script setup lang="ts">
"use strict"
import { useSettingsStore } from "@/stores/settings"
const settings = useSettingsStore().settings
const reset = useSettingsStore().reset
</script>
<template>
  <main class="settings">
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
          <input v-model="properties.value" type="number" v-else />
        </li>
      </template>
      <button @click="reset">reset</button>
    </ul>
  </main>
</template>
