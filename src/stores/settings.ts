import { defineStore } from "pinia"
import { useLocalStorage } from "@vueuse/core"
export const useSettingsStore = defineStore("settings", () => {
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
      description: "Fetching lists immediately after selection",
      value: false,
    }
    fetchingRandomly = {
      description: "Fetching randomly",
      value: false,
    }
    // TODO Add options to zoom button
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
    /* TODO
     history = {
       description: "Recording history",
       value: false,
     }

        option to enlarge font size

         */
  }
  const settings = useLocalStorage("settings", new Settings())
  return { Settings, settings }
})
