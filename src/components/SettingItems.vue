<script setup lang="ts">
"use strict"
import { ref, reactive } from "vue"
// TODO Add histtory feature
// TODO Add a toggle to hide item text
const settingItems = ref<Map<string, number> & Map<string, boolean>>(
  new Map()
    .set("Maximum displayed Items Per Page", 10)
    .set("Maximum link length to display", 200)
    .set("Fetching lists after selection", false)
    .set("Fetching randomly ", false)
    .set("Hiding extremely long link", true)
    .set("testString", true)
)

function isExtremelyLongLink(link: string) {
  if (link) {
    // https://stackoverflow.com/questions/70723319/object-is-possibly-undefined-using-es6-map-get-right-after-map-set
    // https://github.com/microsoft/TypeScript/issues/9619
    const linkLenthToCompare: number = settingItems.value.get("Maximum link length to display")!
    return link.length > linkLenthToCompare
  } else {
    return false
  }
}
const defaultSettings = {
  maximumDisplayedItemsPerPage: {
    description: "Maximum displayed items per page",
    value: 10,
  },
  maximumLinkLengthToDisplay: {
    description: "Maximum lenth to display",
    value: 200,
  },
  fetchingListsAfterSelectionEnabled: false,
  randomFetchingEnabled: false,
  hidingVeryVeryLongLinkEnabled: true,
  isVeryVeryLongLink(link: string) {
    if (link) {
      return link.length > this.maximumLinkLengthToDisplay
    } else {
      return true
    }
  },
}
const settings = reactive(Object.assign({}, defaultSettings))
</script>
<template>
  <main class="settingItems">
    <li v-for="[item, value] in settingItems" :key="item">{{ item }}: {{ value }}</li>
    <br />
    <li v-for="(value, item) in settings" :key="item">
      {{ value.description }}: {{ value.value }}
    </li>
  </main>
</template>
