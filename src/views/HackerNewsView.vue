<script setup lang="ts">
"use strict"
import { reactive, ref } from "vue"
// TODO Add histtory feature
const settings = {
  maximumDisplayedItemsPerPage: 10,
  hidingVeryVeryLongLinkOn: true,
  limitOfLinkLength: 200,
  isVeryVeryLongLink(link: string) {
    if (link.length > this.limitOfLinkLength) {
      return true
    } else {
      return false
    }
  },
}
let itemsInQueue: number = 0
interface List {
  readonly name: string
  readonly description: string
  /* readonly itemIds: number[] */
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
const itemId = ref<number>()
const itemText = ref<string>()
const itemTime = ref<number>()
const itemType = ref<string>()
const itemUrl = ref<string>()
const itemTitle = ref<string>()
const lists = ref<Lists>([
  // Current largest item id
  { name: "topstories", description: "Top stories" },
  { name: "newstories", description: "New stories" },
  { name: "beststories", description: "Best stories" },
  { name: "askstories", description: "Ask stories" },
  { name: "showstories", description: "Show stories" },
  { name: "jobstories", description: "Job stories" },
  { name: "maxitem", description: "any" },
  { name: "updates", description: "Changed Items and Profiles" },
])
const items = ref<Item[]>([])
const fetechedItems = ref<Item[]>([])
const selected = ref([{ name: "topstories", description: "Top stories" }])
function generateRandomInteger(max: number, min = 1): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
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
        console.log("live data is array(s) ")
        const itemIds = [...liveData]
        /* itemURL = new URL( */
        /* `${baseURL}/item/${itemIds[generateRandomInteger(itemIds.length)]}.json?print=pretty` */
        /* ) */
        /* return itemURL */
        itemIds.forEach((itemId) => {
          fetchItem(itemId)
        })
      } else {
        console.log("Unknwon live data type")
      }
    })
    .catch((error) => console.error(`Error fetching data: ${error.message}`))
  /* list.itemIds.forEach((itemId) => { */
  /*   fetchItem(itemId) */
  /* }) */
}
function fetchItem(id: number) {
  itemsInQueue += 1
  if (itemsInQueue > settings.maximumDisplayedItemsPerPage) {
    return
  }
  itemText.value = "Fetching item randomly..."
  const itemURL: URL = new URL(`${baseURL}/item/${id}.json?print=pretty`)
  fetch(itemURL)
    .then((response) => response.json())
    /* .then((item: Item) => displayResult(item)) */
    .then((item: Item) => {
      items.value.push(item)
    })
    .catch((error) => console.error(`Error fetching data: ${error.message}`))
}
function displayResult(item: Item) {
  // TODO Allow display multipe items
  console.log("item:  ", item)
  itemText.value = item.text
  itemTime.value = item.time
  itemType.value = item.type
  itemUrl.value = item.url
  itemTitle.value = item.title
  console.log("itemText.value is " + itemText.value)
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
fetchItems("maxitem")
function openTitleURL() {
  window.open(itemUrl.value)
}
function refresh() {
  itemsInQueue = 0
  fetechedItems.value = fetechedItems.value.concat(items.value)
  items.value = []
  fetchSelectedLists()
}
</script>

<template>
  <main>
    <div>Selected: {{ selected.map((option) => option.description) }}</div>
    <select v-model="selected" multiple>
      <!--<select v-model="selected" multiple v-on:change="fetchSelectedLists">
    -->
      <option
        v-for="list in lists"
        :key="list.name"
        :value="{ description: list.description, name: list.name }"
      >
        {{ list.description }}
      </option>
    </select>
    <button @click="refresh" class="refresh">refresh</button>
    <article v-for="item in items" :key="item.id">
      <a href="item.url">
        <h2 v-html="item.title"></h2>
      </a>
      <ul>
        <p>
          {{ item.text }}
        </p>
        <!-- TODO convert to readable time-->
        <li>(Unix) time: {{ item.time }}</li>
        <li>type: {{ item.type }}</li>
        <!-- TODO hide very very long link -->
        <li v-if="settings.hidingVeryVeryLongLinkOn && !settings.isVeryVeryLongLink(item.url)">
          link: <a href="item.url">{{ item.url }}</a>
        </li>
      </ul>
    </article>
  </main>
</template>
<style scoped>
h2 {
  text-decoration: none;
  color: hsla(160, 100%, 37%, 1);
  transition: 0.4s;
}
h2:hover {
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
  margin: 5% 40% 0 32%;
}
.refresh:active {
  box-shadow: 2px 2px 5px #00ff00;
}
@media (min-width: 1024px) {
  .refresh {
    position: absolute;
    top: 10%;
    left: 48%;
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
