<script setup lang="ts">
"use strict"
import { ref } from "vue"
import ControlPanel from "@/components/ControlPanel.vue"
import SettingItems from "@/components/SettingItems.vue"
import ItemPost from "@/components/ItemPost.vue"

import { useItemsStore } from "@/stores/items"
import { storeToRefs } from "pinia"
// TODO Auto fetch more when scrolling to the bottom

const items = storeToRefs(useItemsStore()).items
/* console.log(items) */
const promptForFetching = ref<string>("")
</script>
<template>
  <main>
    <ControlPanel
      class="controlPanel"
      @show-prompt="promptForFetching = 'Fetching selected lists...'"
      @clear-prompt="promptForFetching = ''"
    />
    <SettingItems class="settingItems" />
    <ItemPost v-for="item in items" :key="item.id" :item="item" />
    <div>
      {{ promptForFetching }}
    </div>
  </main>
</template>
<style scoped>
main {
  margin-bottom: 11%;
}

.settingItems {
  margin-left: 22%;
  margin-bottom: 1%;
}
</style>
