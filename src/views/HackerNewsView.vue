<script setup lang="ts">
"use strict"
import { computed, ref } from "vue"
import ControlPanel from "@/components/ControlPanel.vue"
import SettingItems from "@/components/SettingItems.vue"
import NavigatingButtons from "@/components/NavigatingButtons.vue"
import ItemPost from "@/components/ItemPost.vue"
import { useLocalStorage } from "@vueuse/core"

import { useCoreDataStore } from "@/stores/coreData"
import { storeToRefs } from "pinia"

const items = storeToRefs(useCoreDataStore()).items
/* console.log(items) */

const promptForFetching = ref<string>("")

const folded = useLocalStorage("folded", false)
const foldSign = computed(() => (folded.value ? "  ∨  " : "  ∧  "))
function fold() {
  folded.value = !folded.value
}
// TODO Be able to drag controlPanel
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
    <section class="settings">
      <h2>
        <button @click="fold">Settings {{ foldSign }}</button>
      </h2>
      <SettingItems class="settingItems" v-show="!folded" />
    </section>
    <ItemPost class="itemPost" v-for="item in items" :key="item.id" :item="item" />
    <div>
      {{ promptForFetching }}
    </div>
  </main>
  <NavigatingButtons />
</template>
<style scoped>
@media (min-width: 1024px) {
  main {
    margin: 0 20% 10% 1%;
  }
  nav {
    position: fixed;
    right: 2%;
  }
}
.settings {
  display: flex;
  flex-flow: column;
  margin-bottom: 1%;
  :is(h2) button {
    color: hsla(160, 92%, 27%, 1);
    border: none;
    background-color: transparent;
  }
  .settingItems {
    :global(:is(button):hover) {
      color: hsla(160, 92%, 27%, 1);
      background-color: hsla(160, 100%, 37%, 0.2);
    }
  }
}
@media (max-width: 1024px) {
  nav section {
    margin: auto auto;
  }
  main {
    padding: 0 1% 30% 1%;
    .settings {
      margin: auto 4%;
    }
  }
}
</style>
