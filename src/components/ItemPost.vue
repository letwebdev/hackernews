<script setup lang="ts">
import { useSettingsStore } from "@/stores/settings"
import type { Item } from "@/types/hackerNews"

const settings = useSettingsStore().settings
defineProps<{
  item: Item
}>()
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
    <h2 v-show="settings.displayingItemTitle.value">
      <a :href="setUrl(item)"> {{ item.title }}</a>
    </h2>
    <ul>
      <p
        v-show="settings.displayingItemText.value"
        v-html="item.text"
      />
      <li v-show="settings.displayingItemTime.value">
        time: {{ item.readableTime }}
      </li>
      <li v-show="settings.displayingItemType.value">
        type: {{ item.type }}
      </li>
      <li v-show="displayingLink(item)">
        link: <a :href="item.url">{{ item.url }}</a>
      </li>
      <li v-show="settings.displayingItemId.value">
        id: {{ item.id }}
      </li>
      <li v-show="settings.displayingItemDiscuss.value">
        discuss: <a :href="item.discuss.toString()">{{ item.discuss }}</a>
      </li>
    </ul>
  </article>
</template>
<style scoped>
h2 {
  color: hsl(160 100% 37% / 1);
  font-size: 110%;
  text-decoration: none;
  transition: 0.4s;

  &:hover {
    background-color: hsl(160 100% 37% / 0.2);
    cursor: pointer;
  }
}

* {
  overflow-wrap: break-word;
}

li {
  /* Wrap "_", etc. in long link */
  /* break-all so that link won't in new line */
  word-break: break-all;
  /* TODO
  /* code { */
  /*   word-break: break-all; */
  /* } */
}

@media (width <= 1024px) {
  h2 {
    font-size: 110%;
  }
}
</style>
