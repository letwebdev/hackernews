<script setup lang="ts">
'use strict'
import { reactive, ref } from 'vue'
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
const id = ref<number>()
const text = ref<string>()
const time = ref<number>()
const type = ref<string>()
const url = ref<string>()
const title = ref<string>()
const lists = ref([
  // Current largest item id
  { name: 'maxitem', description: 'test' },
  { name: 'topstories', description: '"Top" stories' },
  { name: 'newstories', description: 'New stories' },
  { name: 'beststories', description: 'Best stories' },
  { name: 'askstories', description: 'Ask stories' },
  { name: 'showstories', description: 'Show stories' },
  { name: 'jobstories', description: 'Job stories' },
  { name: 'updates', description: 'Changed Items and Profiles' }
])
const selected = ref([{ name: 'topstories', description: 'Top stories' }])
function generateRandomNumber(max: number, min = 1) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}
// TODO Set default argument
function fetchItems(list: string) {
  text.value = 'Fetching item(s) randomly...'
  const baseURL: URL = new URL('https://hacker-news.firebaseio.com/v0')
  const listURL: URL = new URL(`${baseURL}/${list}.json?print=pretty`)
  console.log('List URL is ' + listURL)
  let itemURL: URL
  let ids: number[] = []
  fetch(`${listURL}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`)
      }
      return response.json()
    })
    .then((liveData: number | number[] | object) => {
      console.log('type of liveData is ' + typeof liveData)
      if (typeof liveData === 'number') {
        console.log('liveData is ' + liveData)
        const maxItemId: number = liveData
        id.value = generateRandomNumber(maxItemId)
        itemURL = new URL(`${baseURL}/item/${id.value}.json?print=pretty`)
        return itemURL
      } else if (Array.isArray(liveData)) {
        ids = [...liveData]
        itemURL = new URL(
          `${baseURL}/item/${ids[generateRandomNumber(ids.length - 1)]}.json?print=pretty`
        )
        return itemURL
        // TODO Extend to show multiple items
        /* ids.forEach((id) => { */
        /*   itemURL = new URL(`${baseURL}/item/${id}.json?print=pretty`) */
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
  console.log('item:  ', item)
  text.value = item.text
  time.value = item.time
  type.value = item.type
  url.value = item.url
  title.value = item.title
}
fetchItems(selected.value[0].name)
function fetchList() {}
</script>

<template>
  <main>
    <div>Selected: {{ selected[0].description }}</div>
    <!-- FIXME selection invalid-->
    <select v-model="selected" multiple v-on:change="fetchList">
      <option v-for="list in lists" :key="list.name" :value="list.description">
        {{ list.description }}
      </option>
    </select>
    <button @click="fetchItems(selected[0].name)" class="refresh">refresh</button>
    <article>
      <h2 v-html="title"></h2>
      <p v-html="text" class="itemText"></p>
      <ul>
        <li>(Unix) time: {{ time }}</li>
        <li class="ofUrl">
          <!-- TODO Integrate href and title-->
          <a :href="url" class="itemUrl">{{ url }}</a>
        </li>
        <li>type: {{ type }}</li>
      </ul>
    </article>
  </main>
</template>
<style scoped>
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
