<script setup lang="ts">
import { computed, ref } from "vue"

import { useSettingsStore } from "@/stores/settings"
import { useCoreDataStore } from "@/stores/coreData"
import { storeToRefs } from "pinia"

import { generateRandomInteger, shuffleArray } from "@/libs/math"
import type { Item, LiveData } from "@/libs/types"

const settings = useSettingsStore().settings
const items = storeToRefs(useCoreDataStore()).items
const lists = storeToRefs(useCoreDataStore()).lists
const liveDataSet = useCoreDataStore().liveDataSet
const emit = defineEmits(["showPrompt", "clearPrompt"])

function fetchSelectedLists() {
  const names: string[] = []
  selected.value.forEach((list) => {
    names.push(list.name)
  })
  fetchLists(names)
}
function fetchLists(listNames: string[]) {
  listNames.forEach((listName: string) => {
    fetchList(listName)
  })
}

async function fetchList(listName: string = "topstories") {
  /* console.log(listName) */
  let liveDataToFetch
  for (const element of liveDataSet) {
    /* console.log(element) */
    if (element.listName === listName) {
      liveDataToFetch = element.liveData
      break
    }
  }
  /* console.log(liveDataToFetch) */
  const itemIds = getItemIds(liveDataToFetch)
  itemIds.forEach((itemId: number) => {
    fetchItem(itemId)
  })
}

function getItemIds(liveData: LiveData): number[] {
  console.log("liveData:")
  console.log(liveData)
  let itemIds: number[]
  if (typeof liveData === "number") {
    console.log("Live data is currently largest item id: " + liveData)
    itemIds = []
    const maxItemId: number = liveData
    for (let i = 0; i < settings.numberOfItemsFetchedEachTime.value; i++) {
      const randomItemId = generateRandomInteger(maxItemId)
      itemIds.push(randomItemId)
    }
    console.log("Fetch generated random ids: " + itemIds)
  } else if (typeof liveData === "object") {
    let itemIdsInLiveData: number[]
    if (Array.isArray(liveData)) {
      console.log("Live data is an array ")
      itemIdsInLiveData = liveData
    } else {
      console.log("Live data is a non-array object ")
      itemIdsInLiveData = liveData.items
    }
    if (settings.fetchingRandomly.value) {
      itemIds = shuffleArray(itemIdsInLiveData)
    } else {
      itemIds = [...itemIdsInLiveData]
    }
    // Remove the ids of fetched items to prevent duplication
    for (const element of liveDataSet) {
      /* console.log(element) */
      if (element.liveData === liveData) {
        const start = settings.numberOfItemsFetchedEachTime.value
        if (Array.isArray(element.liveData)) {
          const end = element.liveData.length - 1
          element.liveData = element.liveData.splice(start, end)
          console.log(element.liveData)
        } else {
          const end = element.liveData.items.length - 1
          element.liveData.items = element.liveData.items.splice(start, end)
          console.log(element.liveData.items)
        }
        break
      }
    }
  } else {
    console.log("Unknwon live data type:")
    console.log(liveData)
    return [1]
  }
  return itemIds
}

const baseURL: URL = new URL("https://hacker-news.firebaseio.com/v0")

function fetchItem(id: number) {
  itemsInQueue += 1
  if (itemsInQueue > settings.numberOfItemsFetchedEachTime.value) {
    return
  }
  const itemURL: URL = new URL(`${baseURL}/item/${id}.json?print=pretty`)
  const discussURL: URL = new URL(`https://news.ycombinator.com/item?id=${id}`)
  fetch(itemURL)
    .then((response) => response.json())
    .then((item: Item) => {
      // Convert Unix time to readable time
      const unixTime = new Date(item.time * 1000)
      item.readableTime = `
      ${unixTime.getFullYear()}-${unixTime.getMonth() + 1}-${unixTime.getDate()}
      ${unixTime.getHours()}:${unixTime.getMinutes()}
      `
      item.discuss = discussURL
      items.value.push(item)
    })
    .catch((error) => console.error(`Error fetching data: ${error.message}`))
}

async function fetchLiveData(listName: string = "topstories"): Promise<LiveData> {
  try {
    const listURL: URL = new URL(`${baseURL}/${listName}.json?print=pretty`)
    const response = await fetch(listURL)
    const liveData: LiveData = await response.json()
    return liveData
  } catch (error: any) {
    console.log(`Error: ${error.message}`)
  }
}

// Init
;(async () => {
  // Prefetch live data
  // TODO refresh live data when refresh()
  emit("showPrompt")
  for await (const list of lists.value) {
    const liveData: LiveData = await fetchLiveData(list.name)
    const elementOfLiveDataSet = {
      listName: list.name,
      liveData: liveData,
    }
    liveDataSet.push(elementOfLiveDataSet)
    if (list.name === "topstories") {
      fetchList(list.name)
      emit("clearPrompt")
    }
  }
  fetchList("maxitem")
  /* console.log(liveDataSet) */
  //----
})()

let itemsInQueue: number = 0
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
    <button @click="refresh" class="refresh">Refresh</button>
    <button @click="clear" class="clear">Clear</button>
    <ul>
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
