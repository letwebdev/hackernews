<script setup lang="ts">
import { useSettingsStore } from "@/stores/settings"
import type { Item } from "@/types/hackerNews"

const settings = useSettingsStore().settings
defineProps<{
  item: Item
}>()
function titleUrl(item: Item) {
  return item.url ? item.url : item.discuss.href
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
      <a
        :href="titleUrl(item)"
        class="flex items-center"
      >
        <div class="i-mdi-web mr-2px" />
        {{ item.title }}</a>
    </h2>
    <p
      v-if="settings.displayingItemText.value"
      v-html="item.text"
    />
    <ul class="list-none">
      <li v-if="displayingLink(item)">
        link: <a :href="item.url">{{ item.url }}</a>
      </li>
      <div class="grid grid-cols-3">
        <li v-if="settings.displayingItemType.value">
          type: {{ item.type }}
        </li>
        <li v-if="settings.displayingItemId.value">
          id:
          <a :href="item.discuss.href">
            {{ item.id }}
            <v-tooltip
              activator="parent"
              location="top"
            >Go to discuss</v-tooltip></a>
        </li>
        <li v-if="settings.displayingItemTime.value">
          time: {{ item.readableTime }}
        </li>
      </div>
    </ul>
  </article>
  <v-divider
    thickness="2px"
    class="mb-3px mt-2px"
  />
</template>
<style scoped>
* {
  overflow-wrap: break-word;
}

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

li {
  /* Wrap "_", etc. in long link */
  /* break-all so that link won't in new line */
  word-break: break-all;
}
</style>
