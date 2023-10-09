<script setup lang="ts">
"use strict"
import { computed, ref } from "vue"
import ControlPanel from "@/components/ControlPanel.vue"
import SettingItems from "@/components/SettingItems.vue"
import ItemPost from "@/components/ItemPost.vue"
import { useLocalStorage } from "@vueuse/core"

import { useCoreDataStore } from "@/stores/coreData"
import { storeToRefs } from "pinia"
// TODO Auto fetch more when scrolling to the bottom

const items = storeToRefs(useCoreDataStore()).items
/* console.log(items) */

const promptForFetching = ref<string>("")

const folded = useLocalStorage("folded", false)
const foldSign = computed(() => (folded.value ? "  ∨  " : "  ∧  "))
function fold() {
  folded.value = !folded.value
}
</script>
<template>
  <nav>
    <ControlPanel
      class="controlPanel"
      @show-prompt="promptForFetching = 'Fetching selected lists...'"
      @clear-prompt="promptForFetching = ''"
    />
  </nav>
  <main>
    <section class="settingItems">
      <h2>
        <button @click="fold">Settings {{ foldSign }}</button>
      </h2>
      <SettingItems v-show="!folded" />
    </section>
    <ItemPost class="itemPost" v-for="item in items" :key="item.id" :item="item" />
    <div>
      {{ promptForFetching }}
    </div>
  </main>
</template>
<style scoped>
nav {
  position: fixed;
  margin: 0 0 10% 10%;
}
main {
  margin-bottom: 10%;
}
.itemPost {
  margin-left: 32%;
}
.settingItems {
  display: flex;
  flex-flow: column;
  margin-left: 32%;
  margin-bottom: 1%;
  h2 {
    color: hsla(160, 92%, 27%, 1);
  }
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
</style>
