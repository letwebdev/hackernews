<script setup lang="ts">
"use strict"
import { computed, ref } from "vue"
import ControlPanel from "@/components/ControlPanel.vue"
import SettingItems from "@/components/SettingItems.vue"
import ItemPost from "@/components/ItemPost.vue"
import { useLocalStorage } from "@vueuse/core"

import { useItemsStore } from "@/stores/items"
import { storeToRefs } from "pinia"
// TODO Auto fetch more when scrolling to the bottom

const items = storeToRefs(useItemsStore()).items
/* console.log(items) */

const promptForFetching = ref<string>("")

const folded = useLocalStorage("folded", false)
const foldSign = computed(() => (folded.value ? "  ∨  " : "  ∧  "))
function fold() {
  folded.value = !folded.value
}
</script>
<template>
  <main>
    <ControlPanel
      class="controlPanel"
      @show-prompt="promptForFetching = 'Fetching selected lists...'"
      @clear-prompt="promptForFetching = ''"
    />
    <h2 class="settingItems">
      <button @click="fold">Settings {{ foldSign }}</button>
    </h2>
    <SettingItems class="settingItems" v-show="!folded" />
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

h2.settingItems {
  margin-left: 22%;
  margin-bottom: 1%;
  color: hsla(160, 92%, 27%, 1);
  :is(button) {
    border-radius: 5px;
    z-index: 2;
    background-color: transparent;
    border: none;
  }
  :is(button):hover {
    color: #00aa00;
    font-weight: bold;
    cursor: pointer;
  }
}
.settingItems {
  margin-left: 22%;
  margin-bottom: 1%;
}
</style>
