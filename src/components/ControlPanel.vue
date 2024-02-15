<script setup lang="ts">
import { computed, ref } from "vue"

import { storeToRefs } from "pinia"
import { useSettingsStore } from "@/stores/settings"
import { useCoreDataStore } from "@/stores/coreData"
import { useFetchingDataStore } from "@/stores/fetchData"

const settings = useSettingsStore().settings
const coreDataRef = storeToRefs(useCoreDataStore())
const items = coreDataRef.items
const lists = coreDataRef.lists
const fetchLists = useFetchingDataStore().useFetchingLists
const fetchList = useFetchingDataStore().useFetchingList
const changePrompt = useFetchingDataStore().changePrompt
const changeItemsInQueue = useFetchingDataStore().changeItemsInQueue
const liveDataSetInitialied = useFetchingDataStore().getLiveDataSetInitializationState

const selected = ref([{ name: "topstories", description: "Top stories" }])
function fetchSelectedLists() {
  const names: string[] = []
  selected.value.forEach((list) => {
    names.push(list.name)
  })
  fetchLists(names)
}

function fetchMore() {
  // Clear count
  changeItemsInQueue(0)
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

const descriptions = computed<string[]>(() => selected.value.map((option) => option.description))
function fetchingListsAfterSelection() {
  if (settings.fetchingListsAfterSelection.value) {
    fetchMore()
  }
}

// Init: Fetch stories
changePrompt("Fetching selected lists...")
// TODO refresh live data when refresh()
let interValId: number | null = window.setInterval(() => {
  if (liveDataSetInitialied.value) {
    fetchList(selected.value[0].name).then(() => changePrompt(""))
    fetchList("maxitem")
    if (interValId) {
      clearInterval(interValId)
      interValId = null
    }
  }
}, 200)

// TODO Onmounted
window.addEventListener("scroll", () => {
  if (settings.automaticallyFetchingMoreWhenScrollingToTheBottom.value === false) {
    return
  }
  if (window.innerHeight + Math.round(window.scrollY) + 1 >= document.body.offsetHeight) {
    fetchMore()
  }
})
</script>
<template>
  <section>
    <h1>Control Panel</h1>
    <button
      class="refresh"
      @click="refresh"
    >
      Refresh
    </button>
    <button
      class="clear"
      @click="clear"
    >
      Clear
    </button>
    <ul>
      Selected:
      <li
        v-for="description in descriptions"
        :key="description"
      >
        {{ description }}
      </li>
    </ul>
    <select
      v-model="selected"
      multiple
      class="selectedLists"
      @change="fetchingListsAfterSelection"
    >
      <option
        v-for="list in lists"
        :key="list.name"
        :value="{ description: list.description, name: list.name }"
      >
        {{ list.description }}
      </option>
    </select>
    <button
      class="fetchMore"
      @click="fetchMore"
    >
      Fetch more
    </button>
  </section>
</template>
<style scoped>
h1 {
  text-decoration: none;
  color: hsla(160, 100%, 37%, 1);
  transition: 0.4s;
}
section {
  display: flex;
  flex-wrap: nowrap;
  flex-direction: column;
  width: 200px;
}
button {
  width: 120px;
  margin: 5px auto;
  height: 4ex;
  background-image: linear-gradient(135deg, #00f059 60%, #42f0a5);
  border: none;
  border-radius: 5px;
  font-weight: bold;
  color: white;
}
@media (min-width: 1024px) {
  button {
    cursor: pointer;
    &:active {
      box-shadow: 2px 2px 5px #00ff00;
    }
  }

  select {
    margin: 5% 0;
    max-width: 165px;
    height: 230px;
  }

  ul {
    display: none;
  }
}
@media (max-width: 1024px) {
  section {
    align-items: center;
    justify-content: center;
  }
  button {
    &.fetchMore {
      width: 50px;
      height: 40px;
      position: fixed;
      top: 30%;
      right: 0%;
    }
    &.refresh {
      margin: 0%;
    }
  }
  select {
    max-width: 55%;
    float: left;
  }
}
</style>
