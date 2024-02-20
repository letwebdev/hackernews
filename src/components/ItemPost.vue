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
        variant="plain"
        class="text-none"
      >
        <div class="i-mdi-web mr-8px mt-4px" />
        {{ item.title }}
      </a>
    </h2>
    <p
      v-if="settings.displayingItemText.value"
      v-html="item.text"
    />
    <ul class="list-none">
      <li v-if="displayingLink(item)">
        <label class="mr-10px min-w-fit"> link: </label>
        <a
          class="text-none whitespace-normal break-all"
          variant="plain"
          :href="item.url"
        >
          {{ item.url }}
        </a>
      </li>
      <div class="grid grid-cols-3 max-w-700px">
        <li v-if="settings.displayingItemType.value">
          <label>type:</label> {{ item.type }}
        </li>
        <li v-if="settings.displayingItemId.value">
          <label>id:</label>
          <v-btn
            class="text-none whitespace-normal !items-center"
            variant="plain"
            :href="item.discuss.href"
          >
            {{ item.id }}
            <v-tooltip
              activator="parent"
              location="top"
            >
              Go to discuss
            </v-tooltip>
          </v-btn>
        </li>
        <li v-if="settings.displayingItemTime.value">
          <label>time:</label> {{ item.readableTime }}
        </li>
      </div>
    </ul>
  </article>
  <v-divider
    thickness="2px"
    class="mb-3px mt-2px"
  />
</template>
<style scoped lang="scss">
* {
  overflow-wrap: break-word;
}

h2 {
  font-size: 110%;
  text-decoration: none;
  transition: 0.4s;
}

a,
li {
  /* Wrap "_", etc. in long link */
  /* break-all so that link won't in new line */
  display: flex;
  text-decoration: none;
  word-break: break-all;
}

li {
  align-items: center;
}

a {
  align-items: start;

  &:hover {
    text-decoration: underline;
  }
}

label {
  min-width: fit-content;
}
</style>
