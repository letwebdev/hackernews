<script setup lang="ts">
import ControlPanel from "@/components/ControlPanel.vue"
import NavigatingButtons from "@/components/NavigatingButtons.vue"
import ItemPost from "@/components/ItemPost.vue"

import { useCoreDataStore } from "@/stores/coreData"
import { useFetchingDataStore } from "@/stores/fetchData"

const liveDataCacheInitialized = useFetchingDataStore().getLiveDataCacheInitializationState

const promptOfFetching = storeToRefs(useFetchingDataStore()).promptOfFetching
const items = storeToRefs(useCoreDataStore()).items
/* console.log(items) */

// TODO Be able to drag controlPanel
</script>
<template>
  <ControlPanel class="controlPanel" />

  <div class="hackerNewsView mt-1% max-w-100%">
    <main :class="{ 'min-h-101vh': liveDataCacheInitialized }">
      <ItemPost
        v-for="item in items"
        :key="item.id"
        :item="item"
      />
      <div>
        {{ promptOfFetching }}
      </div>
      <footer class="pb-30%" />
    </main>
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
