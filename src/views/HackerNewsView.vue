<script setup lang="ts">
"use strict"
import { computed } from "vue"
import ControlPanel from "@/components/ControlPanel.vue"
import SettingItems from "@/components/SettingItems.vue"
import NavigatingButtons from "@/components/NavigatingButtons.vue"
import ItemPost from "@/components/ItemPost.vue"
import DataCharts from "@/components/DataCharts.vue"
import { useLocalStorage } from "@vueuse/core"

import { useCoreDataStore } from "@/stores/coreData"
import { useFetchingDataStore } from "@/stores/fetchData"
import { storeToRefs } from "pinia"

const promptOfFetching = useFetchingDataStore().getPromptOfFetching
const items = storeToRefs(useCoreDataStore()).items
/* console.log(items) */

const folded = useLocalStorage("folded", false)
const foldSign = computed(() => (folded.value ? "  ∨  " : "  ∧  "))
function fold() {
  folded.value = !folded.value
}
const largeScreen = computed(() => window.matchMedia("(max-width: 2560px)"))
// TODO Be able to drag controlPanel
</script>
<template>
  <nav>
    <ControlPanel class="controlPanel" />
  </nav>
  <main>
    <section class="settings">
      <h1>
        <button @click="fold">
          Settings <span>{{ foldSign }}</span>
        </button>
      </h1>
      <SettingItems class="settingItems" v-show="!folded" />
    </section>
    <ItemPost class="itemPost" v-for="item in items" :key="item.id" :item="item" />
    <div>
      {{ promptOfFetching }}
    </div>
  </main>
  <DataCharts v-if="largeScreen" />
  <footer></footer>
  <NavigatingButtons />
</template>
<style lang="scss" scoped>
nav section {
  margin: auto auto;
}
footer {
  padding-bottom: 30%;
}

.settings {
  display: flex;
  flex-flow: column;
  margin: auto 5% 1% 4%;
  h1 button {
    span {
      cursor: pointer;
    }
    color: hsla(160, 92%, 27%, 1);
    border: none;
    background-color: transparent;
  }
  .settingItems {
    :global(button:hover) {
      color: hsla(160, 92%, 27%, 1);
      background-color: hsla(160, 100%, 37%, 0.2);
    }
  }
}
@media (min-width: 1024px) {
  nav {
    position: fixed;
    right: 2%;
  }
}
@media (min-width: 2560px) {
  main {
    max-width: 1200px;
  }
}
</style>
