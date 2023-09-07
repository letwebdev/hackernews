<script lang="ts">
// TODO Add histtory feature
const defaultSettings = {
  maximumDisplayedItemsPerPage: 10,
  hidingVeryVeryLongLinkOn: true,
  limitOfLinkLength: 200,
  fetchingListsAfterSelectionOn: false,
  randomFetchingOn: false,
  isVeryVeryLongLink(link: string) {
    if (link) {
      return link.length > this.limitOfLinkLength
    } else {
      return true
    }
  },
}
const settings = defaultSettings
export default settings
</script>
<template>
  <div class="settings">
    <h2>Settings</h2>
  </div>
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
