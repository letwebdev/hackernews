<script setup lang="ts">
import { useSettingsStore } from "@/stores/settings"
import type { Item } from "@/types/hackerNews"
import { convertUnixTimeStampToReadableTime } from "@/libs/formatter"

const settings = useSettingsStore().settings
const props = defineProps<{
  item: Item
}>()
const item = props.item
const discussUrl = computed(() => {
  return `https://news.ycombinator.com/item?id=${item.id}`
})
const titleUrl = computed(() => {
  return item.url ? item.url : discussUrl.value
})

const displayingLink = computed(() => {
  return (
    settings.displayingItemLink.value &&
    item.url !== undefined &&
    settings.maximumLinkLengthToDisplay.value > item.url.length
  )
})
</script>
<template>
  <article>
    <h2 v-show="settings.displayingItemTitle.value">
      <a
        :href="titleUrl"
        variant="plain"
        class="text-none"
      >
        <div class="i-mdi-web mr-8px mt-4px min-w-17.6px w-17.6px" />
        {{ item.title }}
      </a>
    </h2>
    <p
      v-if="settings.displayingItemText.value"
      class="overflow-x-auto"
      v-html="item.text"
    />
    <ul class="list-none">
      <li
        v-if="displayingLink"
        class="!items-start"
      >
        <label class="mr-10px min-w-fit"> link: </label>
        <a
          class="text-none whitespace-normal break-all"
          variant="plain"
          :href="item.url"
        >
          {{ item.url }}
        </a>
      </li>
      <div class="grid grid-cols-2 max-w-700px lg:grid-cols-3">
        <li v-if="settings.displayingItemType.value">
          <label>type:&nbsp;</label> {{ item.type }}
        </li>
        <li v-if="settings.displayingItemId.value">
          <label>id:</label>
          <v-btn
            class="text-none whitespace-normal !items-center"
            variant="plain"
            :href="discussUrl"
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
          <label>time:&nbsp;</label> {{ convertUnixTimeStampToReadableTime(item.time) }}
        </li>
      </div>
    </ul>
  </article>
  <v-divider
    thickness="1px"
    class="mb-3px mt-2px"
  />
</template>
<style scoped lang="scss">
h2 {
  font-size: 120%;
  text-decoration: none;
  transition: 0.4s;
  @media (width >=2048px) {
    font-size: 130%;
  }
}

a,
li {
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
