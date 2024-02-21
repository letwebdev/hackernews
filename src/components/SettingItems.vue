<script setup lang="ts">
import { useSettingsStore } from "@/stores/settings"

const settingsStore = useSettingsStore()
function reset() {
  settingsStore.settingOperations.reset()
}
</script>
<template>
  <div class="settingItems">
    <menu>
      <template
        v-for="(property, _index) in settingsStore.settings"
        :key="_index"
      >
        <li class="flex list-none items-center justify-between <lg:block">
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
              thumb-label
              hide-details
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
      variant="outlined"
      class="text-none"
      density="comfortable"
      @click="reset"
    >
      Reset
    </v-btn>
  </div>
</template>
<style lang="scss">
.settingItems {
  max-width: 850px;

  .v-btn {
    letter-spacing: 0.03em;
  }
}
</style>
