<script setup lang="ts">
"use strict"
import { ref } from "vue"
import ControlPanel from "@/components/ControlPanel.vue"
import SettingItems from "@/components/SettingItems.vue"
import { useItemsStore } from "@/stores/items"
import ItemPost from "@/components/ItemPost.vue"
// TODO Auto fetch more when scrolling to the bottom

const items = useItemsStore().items
/* console.log(items) */
const promptForFetching = ref<string>()
</script>
<template>
  <main>
    <ControlPanel class="controlPanel" />
    <SettingItems class="settingItems" />
    <div>
      {{ promptForFetching }}
    </div>
    <ItemPost v-for="item in items" :key="item.id" :item="item" />
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
