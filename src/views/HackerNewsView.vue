<script setup lang="ts">
import ControlPanel from "@/components/ControlPanel.vue"
import NavigatingButtons from "@/components/NavigatingButtons.vue"
import ItemPost from "@/components/ItemPost.vue"
import DataCharts from "@/components/DataCharts.vue"

import { useCoreDataStore } from "@/stores/coreData"
import { useFetchingDataStore } from "@/stores/fetchData"

const liveDataCacheInitialized = useFetchingDataStore().getLiveDataCacheInitializationState

const promptOfFetching = storeToRefs(useFetchingDataStore()).promptOfFetching
const items = storeToRefs(useCoreDataStore()).items
/* console.log(items) */

const isLargeScreen = computed(() => window.matchMedia("(min-width: 2560px)").matches)
// TODO Be able to drag controlPanel
const mounted = ref(false)
</script>
<template>
  <ControlPanel class="controlPanel" />

  <div class="hackerNewsView mt-1%">
    <main :class="{ 'min-h-101vh': liveDataCacheInitialized }">
      <ItemPost
        v-for="item in items"
        :key="item.id"
        :item="item"
      />
      <div>
        <!--
          TODO when current list is empty
        -->
        {{ promptOfFetching }}
      </div>
      <footer class="pb-30%" />
    </main>
    <!--
      TODO use windi variant
    -->
    <section
      v-if="isLargeScreen"
      class="placeholder"
    >
      <DataCharts class="chart" />
    </section>
  </div>
  <NavigatingButtons />
</template>
<style lang="scss" scoped>
main {
  width: 100%;
}

@media (width >= 1024px) {
  .controlPanel {
    position: fixed;
    right: 4%;
  }

  main {
    max-width: 900px;
  }
}

@media (width >= 2560px) {
  .hackerNewsView {
    display: flex;
    column-gap: 100px;
  }

  .controlPanel {
    top: 15%;
    right: 8%;
  }

  main {
    max-width: 1000px;
    margin-left: 2%;
  }

  .chart {
    position: fixed;
    top: 20%;
  }
}
</style>
