<script setup lang="ts">
"use strict"
import { reactive, ref } from "vue"
// TODO Add histtory feature
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
const lists = ref([
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
const selected = ref([{ name: "topstories", description: "Top stories" }])
function generateRandomInteger(max: number, min = 1) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}
// TODO Set default argument
function fetchItems(list: string = "topstories") {
  itemText.value = "Fetching item(s) randomly..."
  const baseURL: URL = new URL("https://hacker-news.firebaseio.com/v0")
  const listURL: URL = new URL(`${baseURL}/${list}.json?print=pretty`)
  console.log("List URL is " + listURL)
  let itemURL: URL
  let itemIds: number[] = []
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
        console.log("liveData is " + liveData)
        const maxItemId: number = liveData
        itemId.value = generateRandomInteger(maxItemId)
        itemURL = new URL(`${baseURL}/item/${itemId.value}.json?print=pretty`)
        return itemURL
      } else if (Array.isArray(liveData)) {
        itemIds = [...liveData]
        itemURL = new URL(
          `${baseURL}/item/${itemIds[generateRandomInteger(itemIds.length)]}.json?print=pretty`
        )
        return itemURL
        // TODO Extend to show multiple items
        /* itemIds.forEach((itemId) => { */
        /*   itemURL = new URL(`${baseURL}/item/${itemId}.json?print=pretty`) */
        /*   fetchSingleItem(itemURL) */
        /* }) */
      }
    })
    .then((itemURL) => {
      if (itemURL) {
        // TODO Show itemURL in comment div
        console.log(`Item URL is ${itemURL}`)
        return fetchSingleItem(itemURL)
      }
    })
    .catch((error) => console.error(`Error fetching data: ${error.message}`))
}

async function fetchSingleItem(itemURL: URL) {
  await fetch(itemURL)
    .then((response) => response.json())
    .then((item: Item) => displayResults(item))
    .catch((error) => console.error(`Error fetching data: ${error.message}`))
}
function displayResults(item: Item) {
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
  const listToFetch = generateRandomInteger(selected.value.length) - 1
  fetchItems(selected.value[listToFetch].name)
  /* selected.value.forEach((list) => { */
  /*   fetchItems(list.name) */
  /* }) */
  // TODO Add a toggle to refresh automatically after selecting
}
fetchItems()
function openTitleURL() {
  window.open(itemUrl.value)
}
</script>

<template>
  <main>
    <div>Selected: {{ selected.map((option) => option.description) }}</div>
    <select v-model="selected" multiple v-on:change="fetchSelectedLists">
      <option
        v-for="list in lists"
        :key="list.name"
        :value="{ description: list.description, name: list.name }"
      >
        {{ list.description }}
      </option>
    </select>
    <button @click="fetchSelectedLists" class="refresh">refresh</button>
    <article>
      <h2 v-html="itemTitle" @click="openTitleURL"></h2>
      <p v-html="itemText" class="itemText"></p>
      <ul>
        <li>(Unix) time: {{ itemTime }}</li>
        <li class="ofUrl">
          <a :href="itemUrl" class="itemUrl">{{ itemUrl }}</a>
        </li>
        <li>type: {{ itemType }}</li>
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
