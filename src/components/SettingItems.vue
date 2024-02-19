<script setup lang="ts">
import { useSettingsStore } from "@/stores/settings"

const settings = storeToRefs(useSettingsStore()).settings
const settingOperations = useSettingsStore().settingOperations
function reset() {
  settingOperations.reset()
}
</script>
<template>
  <div>
    <menu>
      <template
        v-for="(property, _index) in settings"
        :key="_index"
      >
        <li class="list-none">
          <div class="flex items-center justify-between">
            <label>{{ property.description }}:</label>
            <v-switch
              v-if="typeof property.value === 'boolean'"
              v-model="property.value"
              :label="String(property.value)"
              color="primary"
              hide-details
            />
            <v-slider
              v-else
              v-model="property.value"
              hide-details
              thumb-label
              track-color="indigo"
              color="indigo"
              min="1"
              max="400"
              class="max-w-300px"
              :step="1"
            >
              <template #append>
                <v-text-field
                  v-model="property.value"
                  hide-details
                  single-line
                  density="compact"
                  type="number"
                  class="max-w-80px"
                />
              </template>
            </v-slider>
          </div>
        </li>
      </template>
    </menu>
    <v-btn
      height="42"
      min-width="164"
      variant="outlined"
      class="text-none"
      @click="reset"
    >
      Reset
    </v-btn>
  </div>
</template>
