export const useSettingsStore = defineStore("settings", () => {
  class Settings {
    numberOfItemsFetchedEachTime = {
      description: "Number of items to fetch each time" as const,
      value: 20,
    }
    maximumLinkLengthToDisplay = {
      description: "Maximum link length to display" as const,
      value: 200,
    }
    fetchingListsAfterSelection = {
      description: "Fetching lists immediately after selection" as const,
      value: false,
    }

    displayingItemTitle = {
      description: "Displaying item title" as const,
      value: true,
    }
    displayingItemText = {
      description: "Displaying text part of an item(if any)" as const,
      value: true,
    }
    displayingItemLink = {
      description: "Displaying item link" as const,
      value: true,
    }

    displayingItemType = {
      description: "Displaying item type" as const,
      value: true,
    }
    displayingItemId = {
      description: "Displaying item id" as const,
      value: true,
    }
    displayingItemTime = {
      description: "Displaying posted time" as const,
      value: true,
    }

    automaticallyFetchingMoreWhenScrollingToTheBottom = {
      description: "Automatically fetching more when scrolling to the bottom" as const,
      value: true,
    }
    /* TODO history
     history = {
       description: "Recording history",
       value: false,
     }
         */
  }
  const settings = useLocalStorage("settings", new Settings())
  const settingOperations = {
    reset() {
      settings.value = new Settings()
    },
  }
  return { settings, settingOperations }
})
