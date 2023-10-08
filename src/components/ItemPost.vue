<script setup lang="ts">
"use strict"
import { useSettingsStore } from "@/stores/settings"
import type { Item } from "@/libs/types"
const settings = useSettingsStore().settings
defineProps(["item"])
function setUrl(item: Item) {
  return item.url ? item.url.toString() : item.discuss.toString()
}
function displayingLink(item: Item): boolean {
  return (
    settings.displayingItemLink.value &&
    item.url !== undefined &&
    settings.maximumLinkLengthToDisplay.value > item.url.length
  )
}
</script>
<template>
  <article>
    <h2 v-show="settings.displayingItemTitle.value" class="itemTitle">
      <a :href="setUrl(item)"> {{ item.title }}</a>
    </h2>
    <ul>
      <p v-show="settings.displayingItemText.value" v-html="item.text"></p>
      <li v-show="settings.displayingItemTime.value">time: {{ item.readableTime }}</li>
      <li v-show="settings.displayingItemType.value">type: {{ item.type }}</li>
      <li v-show="displayingLink(item)">
        link: <a :href="item.url">{{ item.url }}</a>
      </li>
      <li v-show="settings.displayingItemId.value">id: {{ item.id }}</li>
      <li v-show="settings.displayingItemDiscuss.value">
        discuss: <a :href="item.discuss.toString()">{{ item.discuss }}</a>
      </li>
    </ul>
  </article>
</template>
<style scoped>
h2 {
  text-decoration: none;
  color: hsla(160, 100%, 37%, 1);
  transition: 0.4s;
}
.itemTitle:hover {
  background-color: hsla(160, 100%, 37%, 0.2);
  cursor: pointer;
}
* {
  /* So that _ in long link on mobile phone wrapped */
  word-break: break-all;
}
@media (max-width: 624px) {
  /* width <= 624 */
  h2 {
    font-size: 120%;
  }
}
.itemText {
  position: relative;
  margin-top: 10%;
}
article {
  margin-left: 22%;
  margin-bottom: 1%;
}
</style>
