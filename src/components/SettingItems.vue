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
        <li class="flex list-none items-center justify-between">
          <v-btn
            v-if="typeof property.value === 'boolean'"
            class="text-none my-5px"
            :text="property.description"
            :color="property.value ? 'indigo' : 'null'"
            variant="tonal"
            @click="property.value = !property.value"
          />

          <template v-else>
            <label>{{ property.description }}:</label>
            <v-slider
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
          </template>
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
