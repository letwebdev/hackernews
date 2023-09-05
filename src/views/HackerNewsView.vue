<script setup lang="ts">
'use strict'
import { ref } from 'vue'
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
const options = ref<String[]>([
  // Current largest item id
  'maxitem',
  'topstories',
  'newstories',
  'beststories',
  'asktories',
  'showstories',
  'jobstories',
  // Changed Items and Profiles
  'updates'
])
const selected = ref('maxitem')

function randomNumber(max: number, min = 1) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}
// TODO Set default argument
function fetchStories(option: string) {
  text.value = 'Fetching item(s) randomly...'
  const baseURL = 'https://hacker-news.firebaseio.com/v0/'
  let fullURL: string
  fetch(`https://hacker-news.firebaseio.com/v0/${option}.json?print=pretty`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`)
      }
      return response.json()
    })
    .then((data: number) => {
      /* console.log(`data is ${data}`) */
      if (option === 'maxitem') {
        const maxItemId: number = data
        id.value = randomNumber(maxItemId)
      }
      fullURL = `${baseURL}item/${id.value}.json?print=pretty`
    })
    .then(() => {
      fetch(fullURL)
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
      <option v-for="option in options" :key="options.indexOf(option)" :value="option">
        {{ option }}
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
