<script setup lang="ts">
import { computed, ref } from "vue"

import { useSettingsStore } from "@/stores/settings"
import { useItemsStore } from "@/stores/items"
import { storeToRefs } from "pinia"

import { generateRandomInteger, shuffleArray } from "@/libs/math"
import type { Item, Lists, LiveData, LiveDataSet } from "@/libs/types"

const settings = useSettingsStore().settings
const items = storeToRefs(useItemsStore()).items
const emit = defineEmits(["showPrompt", "clearPrompt"])

function fetchMore() {
  // Clear count
  itemsInQueue = 0
  fetchSelectedLists()
}
function refresh() {
  clear()
  fetchMore()
}
function clear() {
  // Clear displayed items
  items.value = []
}

const selected = ref([{ name: "topstories", description: "Top stories" }])
const descriptions = computed<string[]>(() => selected.value.map((option) => option.description))
function fetchingListsAfterSelection() {
  settings.fetchingListsAfterSelection.value && fetchMore()
}
</script>
<template>
  <section>
    <h2>Control Panel</h2>
    <button @click="refresh" class="refresh">Refresh</button>
    <button @click="clear" class="clear">Clear</button>
    <ul class="descriptionsOfSelected">
      Selected:
      <li v-for="description in descriptions" :key="description">{{ description }}</li>
    </ul>
    <select
      v-model="selected"
      multiple
      v-on:change="fetchingListsAfterSelection"
      class="selectedLists"
    >
      <option
        v-for="list in lists"
        :key="list.name"
        :value="{ description: list.description, name: list.name }"
      >
        {{ list.description }}
      </option>
    </select>
    <button @click="fetchMore" class="fetchMore">Fetch more</button>
  </section>
</template>
<style scoped>
h2 {
  text-decoration: none;
  color: hsla(160, 100%, 37%, 1);
  transition: 0.4s;
}
.controlPanel {
  display: flex;
  flex-wrap: nowrap;
  flex-direction: column;
  :is(button) {
    margin: 5px auto;
    height: 4ex;
    background-image: linear-gradient(135deg, #00f059 60%, #42f0a5);
    border: none;
    border-radius: 5px;
    font-weight: bold;
    color: white;
  }
}
@media (min-width: 624px) {
  /* width>624px */
  .controlPanel {
    position: fixed;
    margin: 0 0 10% 0;
    width: 200px;
    :is(select) {
      margin: 5% 0;
      max-width: 165px;
      height: 230px;
    }
    :is(button) {
      width: 120px;
      margin: 5px auto;
      height: 4ex;
      background-image: linear-gradient(135deg, #00f059 60%, #42f0a5);
      border: none;
      border-radius: 5px;
      font-weight: bold;
      color: white;
      cursor: pointer;
      z-index: 2;
    }
    :is(button):active {
      box-shadow: 2px 2px 5px #00ff00;
    }
  }
  .settingItems,
  article {
    margin-left: 22%;
    margin-bottom: 1%;
  }
  .selectedLists {
    max-width: 35%;
    float: left;
  }
  .descriptionsOfSelected {
    display: none;
  }
  .refresh {
    margin: 5% 0 0 11%;
  }
}
@media (max-width: 624px) {
  /* width <= 624 */
  .controlPanel {
    align-items: center;
    justify-content: center;
    width: 200px;
    :is(button) {
      width: 120px;
    }
    /* TODO long press the button to open control panel
     */
    :is(button).fetchMore {
      width: 50px;
      height: 40px;
      position: fixed;
      right: 0%;
    }
  }
  .refresh {
    margin: 0%;
  }
}
</style>
