import { defineStore } from "pinia"
import { ref } from "vue"
export const useSettingsStore = defineStore("settings", () => {
  // TODO Local storage
  class Settings {
    numberOfItemsFetchedEachTime = {
      description: "Number of items fetched each time",
      value: 20,
    }
    // TODO
    maximumDisplayedItemsPerPage = {
      description: "Maximum displayed items per page",
      value: 20,
    }
    maximumLinkLengthToDisplay = {
      description: "Maximum link length to display",
      value: 200,
    }
    fetchingListsAfterSelection = {
      description: "Fetching lists after selection",
      value: false,
      get enabled() {
        return this.value
      },
      toggle() {
        this.value = !this.value
      },
    }
    fetchingRandomly = {
      description: "Fetching randomly",
      value: false,
      get enabled() {
        return this.value
      },
      toggle() {
        this.value = !this.value
      },
    }
    displayingItemText = {
      description: "Displaying the text part of an item(if any)",
      value: true,
      get enabled() {
        return this.value
      },
      toggle() {
        this.value = !this.value
      },
    }
    // TODO
    history = {
      description: "Recording history",
      value: false,
      get enabled() {
        return this.value
      },
      toggle() {
        this.value = !this.value
      },
    }
  }

  const settings = ref(new Settings())
  function reset() {
    Object.assign(settings.value, new Settings())
  }
  return { Settings, settings, reset }
})
