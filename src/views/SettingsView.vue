<script setup lang="ts">
"use strict"
import { reactive, ref } from "vue"
// TODO Add histtory feature
// TODO Add a toggle to hide item text
const defaultSettings = {
  maximumDisplayedItemsPerPage: 10,
  limitOfLinkLength: 200,
  fetchingListsAfterSelectionEnabled: false,
  randomFetchingEnabled: false,
  hidingVeryVeryLongLinkEnabled: true,
  isVeryVeryLongLink(link: string) {
    if (link) {
      return link.length > this.limitOfLinkLength
    } else {
      return true
    }
  },
}
const settings = reactive(Object.assign({}, defaultSettings))
// TODO Use Pinia
/* export default settings */
</script>
<template>
  <main class="settings">
    <h2>Settings</h2>
    <!--
    <li v-for="settingItem in settings" :key="settingItem.key">
      */ /* {{ settingItem }} */ /* {{ settings }} */ /*
    </li>
-->
  </main>
</template>

<style>
@media (min-width: 1024px) {
  .settings {
    margin-top: 30%;
    min-height: 100vh;
    display: block;
    align-items: center;
  }
}
</style>
