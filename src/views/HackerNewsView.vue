<script setup lang="ts">
"use strict"
import { ref } from "vue"
import SettingItems from "@/components/SettingItems.vue"
import { useSettingsStore } from "@/stores/settings"
const settings = useSettingsStore().settings

function generateRandomInteger(max: number, min = 1): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}
function shuffle(arrayToShuffle: any[]): any[] {
  /* Fisher–Yates shuffle */
  const array = arrayToShuffle
  let currentIndex = array.length
  let randomIndex: number
  // While there remain elements to shuffle.
  while (currentIndex > 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex--
    // And swap it with the current element.
    ;[array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]]
  }
  return array
}

interface List {
  readonly name: string
  readonly description: string
}
type Lists = List[]
interface Item {
  readonly by: string
  readonly id: number
  discuss: URL
  readonly poll: number
  readonly score: number
  readonly text: string
  readonly time: number
  readableTime: string
  readonly type: string
  readonly url: string
  readonly title: string
  // TODO Solve dead item
}
type Items = Item[]
type LiveData = number | number[] | { items: number[]; profiles: string[] } | undefined
interface ElementOfLiveDataSet {
  listName: string
  liveData: LiveData
}
type LiveDataSet = ElementOfLiveDataSet[]

const promptForFetching = ref<string>()
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
const items = ref<Items>([])
const liveDataSet: LiveDataSet = []
const selected = ref([{ name: "topstories", description: "Top stories" }])
function fetchSelectedLists() {
  promptForFetching.value = "Fetching selected lists..."
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
  promptForFetching.value = ""
}
function getItemIds(liveData: LiveData): number[] {
  console.log(liveData)
  if (typeof liveData === "number") {
    console.log("Live data is currently largest item id: " + liveData)
    const maxItemId: number = liveData
    const randomItemId = [generateRandomInteger(maxItemId)]
    console.log("Fetch the random id: " + randomItemId)
    return randomItemId
  } else if (Array.isArray(liveData)) {
    console.log("Live data is an array ")
    let itemIds: number[]
    if (settings.fetchingRandomly.enabled) {
      itemIds = shuffle(liveData)
    } else {
      itemIds = [...liveData]
    }
    return itemIds
  } else if (typeof liveData === "object") {
    console.log("Live data is an non-array object ")
    console.log(liveData)
    let itemIds: number[]
    if (settings.fetchingRandomly.enabled) {
      itemIds = shuffle(liveData.items)
    } else {
      itemIds = [...liveData.items]
    }
    return itemIds
  } else {
    console.log("Unknwon live data type:")
    console.log(liveData)
    // TODO see :43
    return [1]
  }
}
let itemsInQueue: number = 0
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
      const readableTime = new Date(item.time * 1000)
      item.readableTime = `${readableTime.getFullYear()}-${
        readableTime.getMonth() + 1
      }-${readableTime.getDate()} ${readableTime.getHours()}:${readableTime.getMinutes()}`
      item.discuss = discussURL

      items.value.push(item)
    })
    .catch((error) => console.error(`Error fetching data: ${error.message}`))
}
function fetchMore() {
  // Clear count
  itemsInQueue = 0
  fetchSelectedLists()
}
function refresh() {
  // Clear displayed items
  items.value = []
  fetchMore()
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
;(async () => {
  // Prefetch live data
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
</script>

<template>
  <main>
    <section class="controlPanel">
      <h2>Control Panel</h2>
      <button @click="refresh" class="refresh">Refresh</button>
      <!-- 
      <div>Selected: {{ selected.map((option) => option.description) }}</div>
      -->
      <select
        v-model="selected"
        multiple
        v-on:change="settings.fetchingListsAfterSelection.value && fetchMore()"
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
    <SettingItems class="settingItems" />
    <div>
      {{ promptForFetching }}
    </div>
    <article v-for="item in items" :key="item.id">
      <a :href="item.url">
        <h2 v-html="item.title" class="itemTitle"></h2>
      </a>
      <ul>
        <p v-show="settings.displayingItemText.enabled" v-html="item.text"></p>
        <li>time: {{ item.readableTime }}</li>
        <li>type: {{ item.type }}</li>
        <li v-if="item.url && settings.maximumLinkLengthToDisplay.value > item.url.length">
          link: <a :href="item.url">{{ item.url }}</a>
        </li>
        <li>id: {{ item.id }}</li>
        <li>
          discuss: <a :href="item.discuss.toString()">{{ item.discuss }}</a>
        </li>
      </ul>
    </article>
  </main>
</template>
<style scoped>
main {
  margin-bottom: 11%;
}
.controlPanel {
  display: flex;
  flex-wrap: nowrap;
  flex-direction: column;
  position: fixed;
  margin: 0 0 10% 0;
  width: 200px;
  /* padding: 0 0 0 0; */
  :is(select) {
    margin: 5% 0;
    max-width: 165px;
    height: 230px;
  }
  :is(button) {
    width: 120px;
    height: 4ex;
    background-image: linear-gradient(135deg, #00f059 40%, #62f0f5);
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
}
h2 {
  text-decoration: none;
  color: hsla(160, 100%, 37%, 1);
  transition: 0.4s;
}
.itemTitle:hover {
  background-color: hsla(160, 100%, 37%, 0.2);
  cursor: pointer;
}

@media (min-width: 624px) {
  .selectedLists {
    max-width: 35%;
    float: left;
  }
  .refresh {
    margin: 5% 0 0 11%;
  }
}
@media (max-width: 624px) {
  .refresh {
    margin: 0%;
  }
}
/* Firefox doesn't support :has() */
li:has(.itemUrl:empty) {
  display: none;
}
.itemText {
  position: relative;
  margin-top: 10%;
}
</style>
