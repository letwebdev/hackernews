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
}
const baseURL = 'https://hacker-news.firebaseio.com/v0/item/'
const text = ref<string>()
const time = ref<number>()
const type = ref<string>()
const url = ref<string>()
function randomNumber(max,min=1) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
            }
function fetchResults() {
  text.value="fetching news randomly..."
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
      const id: number = randomNumber(maxitem)
      fullUrl = `${baseURL}${id}.json?print=pretty`
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
  time.value=item.time
  type.value=item.type
  url.value = item.url
}
fetchResults()
</script>

<template>
  <main>
    <button @click="fetchResults">refresh</button>
    <article v-html="text">
    </article>
    <a :href="url"></a>
    <div>(Unix) time: {{time}}</div>
    <div>type: {{type}}</div>
  </main>
</template>
<style scoped></style>
