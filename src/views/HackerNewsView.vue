<script setup lang="ts">
'use strict'
import { reactive, ref } from 'vue'
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
}
const id = ref<number>()
const text = ref<string>()
const time = ref<number>()
const type = ref<string>()
const url = ref<string>()
const title = ref<string>()
const lists = reactive({
  // Current largest item id
  maxitem: 'test',
  topstories: 'Top stories',
  newstories: 'New stories',
  beststories: 'Best stories',
  asktories: 'Ask stories',
  showstories: 'Show stories',
  jobstories: 'Job stories',
  updates: 'Changed Items and Profiles'
})
const selected = ref('maxitem')

function generateRandomNumber(max: number, min = 1) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}
// TODO Set default argument
function fetchStories(list: string) {
  text.value = 'Fetching item(s) randomly...'
  const baseURL: string = 'https://hacker-news.firebaseio.com/v0'
  const listURL: string = `${baseURL}/${list}.json?print=pretty`
  let itemURL: string
  fetch(`${listURL}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`)
      }
      return response.json()
    })
    .then((liveData: number | number[] | object) => {
      console.log(`liveData is ${liveData}`)
      console.log(`type of liveData is ${typeof liveData}`)
      if (list === 'maxitem' && typeof liveData === 'number') {
        const maxItemId: number = liveData
        id.value = generateRandomNumber(maxItemId)
      }
      itemURL = `${baseURL}/item/${id.value}.json?print=pretty`
    })
    .then(() => {
      fetch(itemURL)
        .then((response) => response.json())
        .then((item: Item) => displayResults(item))
        .catch((error) => console.error(`Error fetching data: ${error.message}`))
    })
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
fetchStories('maxitem')
function fetchList() {}
</script>

<template>
  <main>
    <div>Selected: {{ selected }}</div>
    <select v-model="selected" multiple v-on:change="fetchList">
      <option v-for="(description, key) in lists" :key="key" :value="description">
        {{ description }}
      </option>
    </select>

    <button @click="fetchStories('maxitem')" class="refresh">refresh</button>
    <article>
      <h2 v-html="title"></h2>
      <p v-html="text" class="itemText"></p>
      <ul>
        <li>(Unix) time: {{ time }}</li>
        <li class="ofUrl">
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
