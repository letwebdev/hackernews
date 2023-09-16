import { defineStore } from "pinia"
import { reactive, ref } from "vue"
export const useSettingsStore = defineStore("settings", () => {
  class Settings {
    maximumDisplayedItemsPerPage = {
      description: "Maximum displayed items per page",
      value: 20,
    }
    maximumLinkLengthToDisplay = {
      description: "Maximum link length to display",
      value: 200,
    }
    fetchingListsAfterSelectionEnabled = {
      description: "Fetching lists after selection",
      value: false,
    }
    randomFetchingEnabled = {
      description: "Fetching randomly",
      value: false,
    }
    hidingVeryVeryLongLinkEnabled = {
      description: "Hiding extemely long link",
      value: true,
    }
    disPlayItemTextEnabled = {
      description: "Displaying the text part of an item(if any)",
      value: true,
    }
    historyEnabled = {
      description: "Recording history",
      value: false,
    }
    private isExtremelyLongLink(link: string) {
      if (link) {
        return link.length > this.maximumLinkLengthToDisplay.value
      } else {
        return true
      }
    }
  }

  const settings = ref(new Settings())
  function reset() {
    Object.assign(settings.value, new Settings())
  }
  return { Settings, settings, reset }
})
