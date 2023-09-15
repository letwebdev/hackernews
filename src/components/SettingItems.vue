<script setup lang="ts">
"use strict"
import { ref, reactive } from "vue"
const defaultSettings = {
  maximumDisplayedItemsPerPage: {
    description: "Maximum displayed items per page",
    value: 10,
  },
  maximumLinkLengthToDisplay: {
    description: "Maximum link length to display",
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
    description: "Displaying the text part of an item(if any)",
    value: true,
  },
  historyEnabled: {
    description: "Recording history",
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
/* settings.maximumDisplayedItemsPerPage.value = 5 */
const inputNumber = ref<number>()
</script>
<template>
  <main class="settings">
    <ul>
      <template v-for="(properties, item) in settings" :key="item">
        <li>
          {{ properties.description }}:
          <button
            v-if="typeof properties.value === 'boolean'"
            @click="properties.value = !properties.value"
          >
            {{ properties.value }}
          </button>
          <input v-model="properties.value" type="number" v-else />
          {{ inputNumber }}
        </li>
      </template>
    </ul>
  </main>
</template>
