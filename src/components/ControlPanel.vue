<script setup lang="ts">
"use strict"
import { useSettingsStore } from "@/stores/settings"
import { useItemsStore } from "@/stores/items"
import type { Item } from "@/libs/types"
import { computed, ref } from "vue"
import { generateRandomInteger, shuffleArray } from "@/libs/math"
const settings = useSettingsStore().settings
let items = useItemsStore().items
function fetchingListsAfterSelection() {
  settings.fetchingListsAfterSelection.value && fetchMore()
}

interface List {
  readonly name: string
  readonly description: string
}
type Lists = List[]
const lists = ref<Lists>([
  { name: "topstories", description: "Top stories" },
  { name: "newstories", description: "New stories" },
  { name: "beststories", description: "Best stories" },
  { name: "askstories", description: "Ask stories" },
  { name: "showstories", description: "Show stories" },
  { name: "jobstories", description: "Job stories" },
  // Current largest item id
  { name: "maxitem", description: "any" },
  { name: "updates", description: "Changed items" },
])
type LiveData = number[] | { items: number[]; profiles: string[] } | undefined
interface ElementOfLiveDataSet {
  listName: string
  liveData: LiveData
}
type LiveDataSet = ElementOfLiveDataSet[]
const liveDataSet: LiveDataSet = []
function fetchSelectedLists() {
  // FIXME
  /* promptForFetching.value = "Fetching selected lists..." */
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
  // TODO After all promises finished
  /* promptForFetching.value = "" */
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
      const readableTime = new Date(item.time * 1000)
      item.readableTime = `${readableTime.getFullYear()}-${
        readableTime.getMonth() + 1
      }-${readableTime.getDate()} ${readableTime.getHours()}:${readableTime.getMinutes()}`

      item.discuss = discussURL

      items.push(item)
    })
    .catch((error) => console.error(`Error fetching data: ${error.message}`))
}

const baseURL: URL = new URL("https://hacker-news.firebaseio.com/v0")
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
  for await (const list of lists.value) {
    const liveData = await fetchLiveData(list.name)
    const elementOfLiveDataSet = {
      listName: list.name,
      liveData: liveData,
    }
    liveDataSet.push(elementOfLiveDataSet)
    if (list.name === "topstories") {
      // FIXME Wait until previous displayed
      fetchList(list.name)
    }
  }
  // Fetch once
  fetchList("maxitem")
  /* console.log(liveDataSet) */
  //----
})()

const selected = ref([{ name: "topstories", description: "Top stories" }])
const descriptions = computed<string[]>(() => selected.value.map((option) => option.description))
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
  items = []
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
  /*
    width>624px
   */
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
      /* transform: scale(0.5); */
      /* transform-origin: right; */
    }
  }
  .refresh {
    margin: 0%;
  }
}
</style>
