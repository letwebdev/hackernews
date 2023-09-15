<script setup lang="ts">
"use strict"
import { ref, reactive } from "vue"
const defaultSettings = {
  maximumDisplayedItemsPerPage: {
    description: "Maximum displayed items per page",
    value: 10,
  },
  maximumLinkLengthToDisplay: {
    description: "Maximum lenth to display",
    value: 200,
  },
  fetchingListsAfterSelectionEnabled: {
    description: "Fetching lists after selection",
    value: false,
  },
  randomFetchingEnabled: {
    description: "Fetching randomly",
    value: false,
  },
  hidingVeryVeryLongLinkEnabled: {
    description: "Hiding extemely long link",
    value: true,
  },
  disPlayItemTextEnabled: {
    description: "Displaying text part of an item(if any)",
    value: true,
  },
  historyEnabled: {
    description: "Recording histtory",
    value: false,
  },
}
function isExtremelyLongLink(link: string) {
  if (link) {
    return link.length > settings.maximumLinkLengthToDisplay.value
  } else {
    return true
  }
}
const settings = reactive(Object.assign({}, defaultSettings))
</script>
<template>
  <main class="settings">
    <ul>
      <li v-for="(value, item) in settings" :key="item">
        {{ value.description }}: {{ value.value }}
      </li>
    </ul>
  </main>
</template>
