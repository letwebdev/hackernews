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
const news = ref('Fetching Hacker News')
const itemUrl = ref('')
// Grab references to all the DOM elements you'll need to manipulate
// Hide the "Previous"/"Next" navigation to begin with, as we don't need it immediately
// Event listeners to control the functionality
function fetchResults() {
  // To stop the form submitting
  // Assemble the full URL
  let url: string
  fetch('https://hacker-news.firebaseio.com/v0/maxitem.json?print=pretty')
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`)
      }
      return response.json()
    })
    .then((data: number) => {
      const maxitem: number = data
      const id: number = maxitem - 5
      url = `${baseURL}${id}.json?print=pretty`
    })
    .then(() => {
      fetch(url)
        .then((response) => response.json())
        .then((item: Item) => displayResults(item))
        .catch((error) => console.error(`Error fetching data: ${error.message}`))
    })
    .catch((error) => console.error(`Error fetching data: ${error.message}`))
}

function displayResults(item: Item) {
  console.log(item)
  itemUrl.value = item.url
  news.value = item.text
}
fetchResults()
</script>

<template>
  <main>
  <h1>Hacker News</h1>
  <a :href="itemUrl">{{ news }}</a>
  </main>
</template>
<style scoped></style>
