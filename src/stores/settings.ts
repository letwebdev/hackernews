import { defineStore } from "pinia"
import { ref } from "vue"
import { useLocalStorage, useStorage } from "@vueuse/core"
export const useSettingsStore = defineStore("settings", () => {
  // TODO Local storage
  class Settings {
    numberOfItemsFetchedEachTime = {
      description: "Number of items fetched each time",
      value: 20,
    }
    // // TODO multi-pages
    // maximumDisplayedItemsPerPage = {
    //   description: "Maximum displayed items per page",
    //   value: 20,
    // }
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
    }
    fetchingRandomly = {
      description: "Fetching randomly",
      value: false,
      get enabled() {
        return this.value
      },
    }
    // TODO add options to zoom button
    // TODO also options to hide other properties
    displayingItemTitle = {
      description: "Displaying item title",
      value: true,
      get enabled() {
        return this.value
      },
    }
    displayingItemText = {
      description: "Displaying text part of an item(if any)",
      value: true,
      get enabled() {
        return this.value
      },
    }
    displayingItemTime = {
      description: "Displaying posted time",
      value: true,
      get enabled() {
        return this.value
      },
    }
    displayingItemType = {
      description: "Displaying item type",
      value: true,
      get enabled() {
        return this.value
      },
    }
    displayingItemLink = {
      description: "Displaying item link",
      value: true,
      get enabled() {
        return this.value
      },
    }
    displayingItemId = {
      description: "Displaying item id",
      value: true,
      get enabled() {
        return this.value
      },
    }
    displayingItemDiscuss = {
      description: "Displaying discuss link",
      value: true,
      get enabled() {
        return this.value
      },
    }
    // TODO
    // history = {
    //   description: "Recording history",
    //   value: false,
    //   get enabled() {
    //     return this.value
    //   },
    //   toggle() {
    //     this.value = !this.value
    //   },
    // }
  }
  const settings = useLocalStorage("settings", new Settings())
  console.log(settings.value)
  function reset() {
    const settingsReset = useLocalStorage("settings", new Settings())
    Object.assign(settings, settingsReset)
  }
  return { Settings, settings, reset }
})
