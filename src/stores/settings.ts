import { defineStore } from "pinia"
import { useLocalStorage } from "@vueuse/core"
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
    }
    fetchingRandomly = {
      description: "Fetching randomly",
      value: false,
    }
    // TODO add options to zoom button
    // TODO also options to hide other properties
    displayingItemTitle = {
      description: "Displaying item title",
      value: true,
    }
    displayingItemText = {
      description: "Displaying text part of an item(if any)",
      value: true,
    }
    displayingItemTime = {
      description: "Displaying posted time",
      value: true,
    }
    displayingItemType = {
      description: "Displaying item type",
      value: true,
    }
    displayingItemLink = {
      description: "Displaying item link",
      value: true,
    }
    displayingItemId = {
      description: "Displaying item id",
      value: true,
    }
    displayingItemDiscuss = {
      description: "Displaying discuss link",
      value: true,
    }
    // TODO
    // history = {
    //   description: "Recording history",
    //   value: false,
    // }
  }
  const settings = useLocalStorage("settings", new Settings())
  return { Settings, settings }
})
