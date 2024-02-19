<script setup lang="ts">
import ControlPanel from "@/components/ControlPanel.vue"
import SettingItems from "@/components/SettingItems.vue"
import NavigatingButtons from "@/components/NavigatingButtons.vue"
import ItemPost from "@/components/ItemPost.vue"
import DataCharts from "@/components/DataCharts.vue"

import { useCoreDataStore } from "@/stores/coreData"
import { useFetchingDataStore } from "@/stores/fetchData"

const promptOfFetching = useFetchingDataStore().getPromptOfFetching
const items = storeToRefs(useCoreDataStore()).items
/* console.log(items) */

const folded = useLocalStorage("folded", false)
const foldSign = computed(() => (folded.value ? "  ∨  " : "  ∧  "))
function fold() {
  folded.value = !folded.value
}

const isLargeScreen = computed(() => window.matchMedia("(min-width: 2560px)").matches)
// TODO Be able to drag controlPanel
</script>
<template>
  <ControlPanel class="controlPanel" />

  <div class="wrapper">
    <main>
      <section class="settings">
        <h1>
          <button @click="fold">
            Settings <span>{{ foldSign }}</span>
          </button>
        </h1>
        <SettingItems
          v-show="!folded"
          class="settingItems"
        />
      </section>

      <ItemPost
        v-for="item in items"
        :key="item.id"
        :item="item"
      />

      <div>
        {{ promptOfFetching }}
      </div>
    </main>
    <div
      v-if="isLargeScreen"
      class="wrapper"
    >
      <DataCharts class="chart" />
    </div>
  </div>
  <footer class="pb-30%" />
  <NavigatingButtons />
</template>
<style lang="scss" scoped>
.settings {
  margin: auto 5% 1% 4%;

  h1 button {
    span {
      cursor: pointer;
    }

    border: none;
    background-color: transparent;
    color: hsl(160 92% 27% / 1);
  }
}

@media (width >= 1024px) {
  .controlPanel {
    position: fixed;
    right: 2%;
  }

  main {
    max-width: 900px;
  }
}

@media (width >= 2560px) {
  .controlPanel {
    top: 12%;
    right: 12%;
  }

  main {
    width: 1000px;
    margin-left: 2%;
  }

  div.wrapper {
    display: flex;
  }

  .chart {
    position: fixed;
    top: 12%;
  }
}
</style>
