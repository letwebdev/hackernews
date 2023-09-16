<script setup lang="ts">
"use strict"
import { ref } from "vue"
import SettingItems from "@/components/SettingItems.vue"
import { useSettingsStore } from "@/stores/settings"
const settings = useSettingsStore().settings

function generateRandomInteger(max: number, min = 1): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

interface List {
  readonly name: string
  readonly description: string
}
type Lists = List[]
interface Item {
  readonly by: string
  readonly id: number
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
  // TODO Add function snippets to fetch following list
  { name: "updates", description: "Changed Items and Profiles" },
])
const items = ref<Items>([])
const selected = ref([{ name: "topstories", description: "Top stories" }])
function fetchSelectedLists() {
  promptForFetching.value = "Fetching selected lists..."
  const names: string[] = []
  selected.value.forEach((list) => {
    names.push(list.name)
  })
  fetchLists(names)
}
function fetchLists(names: string[]) {
  names.forEach((name: string) => {
    fetchList(name)
  })
}
function fetchList(name: string) {
  fetchItems(name)
}
const baseURL: URL = new URL("https://hacker-news.firebaseio.com/v0")
function fetchItems(listName: string = "topstories") {
  const listURL: URL = new URL(`${baseURL}/${listName}.json?print=pretty`)
  console.log("List URL is " + listURL)
  fetch(`${listURL}`)
    .then((response) => {
      if (response.ok) {
        return response.json()
      } else {
        throw new Error(`HTTP error: ${response.status}`)
      }
    })
    .then((liveData: number | number[] | object) => {
      console.log("Type of liveData is " + typeof liveData)
      if (typeof liveData === "number") {
        console.log("Live data is currently largest item id: " + liveData)
        const maxItemId: number = liveData
        const randomItemId = generateRandomInteger(maxItemId)
        fetchItem(randomItemId)
      } else if (Array.isArray(liveData)) {
        console.log("Live data is an array ")
        let itemIds: number[]
        if (settings.fetchingRandomly.enabled) {
          const idsGenerantedRandomly: number[] = []
          // liveData.length may be less than numberOfItemsFetchedEachTime
          const maxmiumFetchedItems = Math.min(
            liveData.length,
            settings.numberOfItemsFetchedEachTime.value
          )
          for (let i = 0; i < maxmiumFetchedItems; i++) {
            const randomArrayIndex = generateRandomInteger(liveData.length - 1)
            const idToPush = liveData[randomArrayIndex]
            // Prevent duplicate id
            if (idToPush === idsGenerantedRandomly[-1]) {
              i--
              continue
            }
            idsGenerantedRandomly.push(idToPush)
          }
          itemIds = [...idsGenerantedRandomly]
        } else {
          itemIds = [...liveData]
        }
        itemIds.forEach((itemId) => {
          fetchItem(itemId)
        })
        promptForFetching.value = ""
      } else {
        console.log("Unknwon live data type")
      }
    })
    .catch((error) => console.error(`Error fetching data: ${error.message}`))
}
let itemsInQueue: number = 0
function fetchItem(id: number) {
  itemsInQueue += 1
  if (itemsInQueue > settings.numberOfItemsFetchedEachTime.value) {
    return
  }
  const itemURL: URL = new URL(`${baseURL}/item/${id}.json?print=pretty`)
  fetch(itemURL)
    .then((response) => response.json())
    .then((item: Item) => {
      const readableTime = new Date(item.time * 1000)
      item.readableTime = `${readableTime.getFullYear()}-${readableTime.getMonth()}-${readableTime.getDate()} ${readableTime.getHours()}:${readableTime.getMinutes()}`
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
// TODO Multi-pages
fetchItems("maxitem")
</script>

<template>
  <main>
    <section class="controlPanel">
      <h2>Control Panel</h2>
      <div>Selected: {{ selected.map((option) => option.description) }}</div>
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
      <button @click="refresh" class="refresh">Refresh</button>
    </section>
    <SettingItems />
    <div>
      {{ promptForFetching }}
    </div>
    <article v-for="item in items" :key="item.id">
      <a :href="item.url">
        <h2 v-html="item.title" class="itemTitle"></h2>
      </a>
      <ul>
        <p v-html="item.text"></p>
        <!-- TODO convert to readable time-->
        <li>time: {{ item.readableTime }}</li>
        <li>type: {{ item.type }}</li>
        <li v-if="item.url && settings.maximumLinkLengthToDisplay.value > item.url.length">
          link: <a :href="item.url">{{ item.url }}</a>
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
  display: block;
  margin: 0 0 10% 20%;
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

.refresh {
  width: 5em;
  height: 4ex;
  background-image: linear-gradient(135deg, #00f059 40%, #62f0f5);
  border: none;
  border-radius: 5px;
  font-weight: bold;
  color: white;
  cursor: pointer;
  z-index: 2;
}
.refresh:active {
  box-shadow: 2px 2px 5px #00ff00;
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
