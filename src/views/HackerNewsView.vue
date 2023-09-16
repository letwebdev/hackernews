<script setup lang="ts">
"use strict"
import { ref } from "vue"
import { useSettingsStore } from "@/stores/settings"
const settings = useSettingsStore().settings
let itemsInQueue: number = 0
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
  readonly type: string
  readonly url: string
  readonly title: string
  // TODO Solve dead item
}
type Items = Item[]
const promptForFetching = ref<string>()
const lists = ref<Lists>([
  // Current largest item id
  { name: "topstories", description: "Top stories" },
  { name: "newstories", description: "New stories" },
  { name: "beststories", description: "Best stories" },
  { name: "askstories", description: "Ask stories" },
  { name: "showstories", description: "Show stories" },
  { name: "jobstories", description: "Job stories" },
  { name: "maxitem", description: "any" },
  // TODO Add function snippets to fetch following list
  { name: "updates", description: "Changed Items and Profiles" },
])
const items = ref<Items>([])
const fetechedItems = ref<Items>([])
const selected = ref([{ name: "topstories", description: "Top stories" }])
function generateRandomInteger(max: number, min = 1): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function fetchSelectedLists() {
  /* const listToFetch = generateRandomInteger(selected.value.length) - 1 */
  /* fetchLists(selected.value[listToFetch].name) */
  const names: string[] = []
  selected.value.forEach((list) => {
    names.push(list.name)
  })
  fetchLists(names)
  // TODO Add a toggle to refresh automatically after selecting
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
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`)
      }
      return response.json()
    })
    .then((liveData: number | number[] | object) => {
      console.log("type of liveData is " + typeof liveData)
      if (typeof liveData === "number") {
        console.log("live data is current largest item id: " + liveData)
        const maxItemId: number = liveData
        const randomItemId = generateRandomInteger(maxItemId)
        fetchItem(randomItemId)
      } else if (Array.isArray(liveData)) {
        console.log("live data is an array ")
        let itemIds: number[]
        if (settings.fetchingRandomly.enabled) {
          const idsGenerantedRandomly: number[] = []
          // TODO array.length may be less than maximumDisplayedItemsPerPage
          for (let i = 0; i < settings.maximumDisplayedItemsPerPage.value; i++) {
            const idToPush = liveData[generateRandomInteger(liveData.length - 1)]
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
      } else {
        console.log("Unknwon live data type")
      }
    })
    .catch((error) => console.error(`Error fetching data: ${error.message}`))
}
function fetchItem(id: number) {
  itemsInQueue += 1
  if (itemsInQueue > settings.maximumDisplayedItemsPerPage.value) {
    return
  }
  promptForFetching.value = "Fetching item..."
  const itemURL: URL = new URL(`${baseURL}/item/${id}.json?print=pretty`)
  fetch(itemURL)
    .then((response) => response.json())
    .then((item: Item) => {
      console.log(item)
      items.value.push(item)
      promptForFetching.value = ""
    })
    .catch((error) => console.error(`Error fetching data: ${error.message}`))
}
function refresh() {
  itemsInQueue = 0
  fetechedItems.value = fetechedItems.value.concat(items.value)
  items.value = []
  fetchSelectedLists()
}
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
        v-on:change="settings.fetchingListsAfterSelection && fetchSelectedLists"
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
      <button @click="refresh" class="refresh">refresh</button>
    </section>
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
        <li>(Unix) time: {{ item.time }}</li>
        <li>type: {{ item.type }}</li>
        <li
          v-if="
            settings.hidingExtremelyLongLink.enabled &&
            settings.hidingExtremelyLongLink.limit > item.url.length
          "
        >
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
