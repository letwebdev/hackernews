import { useSettingsStore } from "@/stores/settings"
import { useCoreDataStore } from "@/stores/coreData"
import { storeToRefs } from "pinia"
import { generateRandomInteger, shuffleArray } from "@/libs/math"
import type { Item, LiveData } from "@/libs/types"
import type { Items, Lists, LiveDataSet } from "@/libs/types"
import { ref } from "vue"

import { defineStore } from "pinia"

const settings = useSettingsStore().settings
const items = storeToRefs(useCoreDataStore()).items
const lists = storeToRefs(useCoreDataStore()).lists
const liveDataSet = useCoreDataStore().liveDataSet
const emit = defineEmits(["showPrompt", "clearPrompt"])

export const useFetchDataStore = defineStore("fetchData", () => {
  function useFetchLists(listNames: string[]) {
    listNames.forEach((listName: string) => {
      useFetchList(listName)
    })
  }

  async function useFetchList(listName: string = "topstories") {
    /* console.log(listName) */
    let liveDataToFetch
    for (const element of liveDataSet) {
      /* console.log(element) */
      if (element.listName === listName) {
        liveDataToFetch = element.liveData
        break
      }
    }
    /* console.log(liveDataToFetch) */
    const itemIds = useGetItemIds(liveDataToFetch)
    itemIds.forEach((itemId: number) => {
      useFetchItem(itemId)
    })
  }

  function useGetItemIds(liveData: LiveData): number[] {
    console.log("liveData:")
    console.log(liveData)
    let itemIds: number[]
    if (typeof liveData === "number") {
      console.log("Live data is currently largest item id: " + liveData)
      itemIds = []
      const maxItemId: number = liveData
      for (let i = 0; i < settings.numberOfItemsFetchedEachTime.value; i++) {
        const randomItemId = generateRandomInteger(maxItemId)
        itemIds.push(randomItemId)
      }
      console.log("Fetch generated random ids: " + itemIds)
    } else if (typeof liveData === "object") {
      let itemIdsInLiveData: number[]
      if (Array.isArray(liveData)) {
        console.log("Live data is an array ")
        itemIdsInLiveData = liveData
      } else {
        console.log("Live data is a non-array object ")
        itemIdsInLiveData = liveData.items
      }
      if (settings.fetchingRandomly.value) {
        itemIds = shuffleArray(itemIdsInLiveData)
      } else {
        itemIds = [...itemIdsInLiveData]
      }
      // Remove the ids of fetched items to prevent duplication
      for (const element of liveDataSet) {
        /* console.log(element) */
        if (element.liveData === liveData) {
          const start = settings.numberOfItemsFetchedEachTime.value
          if (Array.isArray(element.liveData)) {
            const end = element.liveData.length - 1
            element.liveData = element.liveData.splice(start, end)
            console.log(element.liveData)
          } else {
            const end = element.liveData.items.length - 1
            element.liveData.items = element.liveData.items.splice(start, end)
            console.log(element.liveData.items)
          }
          break
        }
      }
    } else {
      console.log("Unknwon live data type:")
      console.log(liveData)
      return [1]
    }
    return itemIds
  }

  const baseURL: URL = new URL("https://hacker-news.firebaseio.com/v0")

  function useFetchItem(id: number) {
    itemsInQueue += 1
    if (itemsInQueue > settings.numberOfItemsFetchedEachTime.value) {
      return
    }
    const itemURL: URL = new URL(`${baseURL}/item/${id}.json?print=pretty`)
    const discussURL: URL = new URL(`https://news.ycombinator.com/item?id=${id}`)
    fetch(itemURL)
      .then((response) => response.json())
      .then((item: Item) => {
        // Convert Unix time to readable time
        const unixTime = new Date(item.time * 1000)
        item.readableTime = `
      ${unixTime.getFullYear()}-${unixTime.getMonth() + 1}-${unixTime.getDate()}
      ${unixTime.getHours()}:${unixTime.getMinutes()}
      `
        item.discuss = discussURL
        items.value.push(item)
      })
      .catch((error) => console.error(`Error fetching data: ${error.message}`))
  }

  async function useFetchLiveData(listName: string = "topstories"): Promise<LiveData> {
    try {
      const listURL: URL = new URL(`${baseURL}/${listName}.json?print=pretty`)
      const response = await fetch(listURL)
      const liveData: LiveData = await response.json()
      return liveData
    } catch (error: any) {
      console.log(`Error: ${error.message}`)
    }
  }

  // Init
  const promptOfFetching = ref<string>("")

  ;(async () => {
    // Prefetch live data
    // TODO refresh live data when refresh()
    promptOfFetching.value = "Fetching selected lists..."
    for await (const list of lists.value) {
      const liveData: LiveData = await useFetchLiveData(list.name)
      const elementOfLiveDataSet = {
        listName: list.name,
        liveData: liveData,
      }
      liveDataSet.push(elementOfLiveDataSet)
      if (list.name === "topstories") {
        useFetchList(list.name)
        promptOfFetching.value = ""
      }
    }
    useFetchList("maxitem")
    /* console.log(liveDataSet) */
    //----
  })()

  let itemsInQueue: number = 0
  return { useFetchList, useFetchLists }
})
