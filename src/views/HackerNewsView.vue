<script setup lang="ts">
'use strict'
import { ref } from 'vue'
interface Item {
  by: string
  id: number
  poll: number
  score: number
  text: string
  time: number
  type: string
  url: string
  title: string
}
const id = ref<number>()
const text = ref<string>()
const time = ref<number>()
const type = ref<string>()
const url = ref<string>()
const title = ref<string>()

function randomNumber(max:number, min = 1) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}
function fetchResults() {
  text.value = 'fetching news randomly...'
  let fullUrl: string
  fetch('https://hacker-news.firebaseio.com/v0/maxitem.json?print=pretty')
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`)
      }
      return response.json()
    })
    .then((data: number) => {
      const maxitem: number = data
      id.value = randomNumber(maxitem)
      const baseURL = 'https://hacker-news.firebaseio.com/v0/item/'
      fullUrl = `${baseURL}${id.value}.json?print=pretty`
    })
    .then(() => {
      fetch(fullUrl)
        .then((response) => response.json())
        .then((item: Item) => displayResults(item))
        .catch((error) => console.error(`Error fetching data: ${error.message}`))
    })
    .catch((error) => console.error(`Error fetching data: ${error.message}`))
}

function displayResults(item: Item) {
  console.log(item)
  text.value = item.text
  time.value = item.time
  type.value = item.type
  url.value = item.url
  title.value = item.title
}
fetchResults()
</script>

<template>
  <main>
    <button @click="fetchResults" class="refresh">refresh</button>
    <article>
      <h2 v-html="title"></h2>
      <p v-html="text"></p>
      <ul>
      <li>(Unix) time: {{ time }}</li>
      <li>      <a :href="url" class="itemUrl">{{ url }}</a> </li>
      <li>type: {{ type }}</li>
      </ul>
    </article>
  </main>
</template>
<style scoped>
.refresh{
  position: absolute;
}
li:has( .itemUrl:empty){
  display: none;
}
/* .itemUrl:empty{ */
/*   display: none; */
/* } */
</style>

