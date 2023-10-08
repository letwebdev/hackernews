"use strict"
import { generateRandomInteger, shuffleArray } from "@/libs/math"
import type { Item, Lists, LiveData, LiveDataSet } from "@/libs/types"
import { ref } from "vue"

import { useSettingsStore } from "@/stores/settings"
import { useItemsStore } from "@/stores/items"
import { storeToRefs } from "pinia"
const itemsInQueue = storeToRefs(useItemsStore()).itemsInQueue

const items = storeToRefs(useItemsStore()).items
const settings = useSettingsStore().settings

const emit = defineEmits(["showPrompt", "clearPrompt"])

export const lists = ref<Lists>([
  { name: "topstories", description: "Top stories" },
  { name: "newstories", description: "New stories" },
  { name: "beststories", description: "Best stories" },
  { name: "askstories", description: "Ask stories" },
  { name: "showstories", description: "Show stories" },
  { name: "jobstories", description: "Job stories" },
  // Current largest item id
  { name: "maxitem", description: "any" },
  { name: "updates", description: "Changed items" },
])

const liveDataSet: LiveDataSet = []

export function fetchLists(listNames: string[]) {
  listNames.forEach((listName: string) => {
    fetchList(listName)
  })
}

async function fetchList(listName: string = "topstories") {
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
  const itemIds = getItemIds(liveDataToFetch)
  itemIds.forEach((itemId: number) => {
    fetchItem(itemId)
  })
}

function getItemIds(liveData: LiveData): number[] {
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

function fetchItem(id: number) {
  itemsInQueue.value += 1
  if (itemsInQueue.value > settings.numberOfItemsFetchedEachTime.value) {
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

async function fetchLiveData(listName: string = "topstories"): Promise<LiveData> {
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
;(async () => {
  // Prefetch live data
  // TODO refresh live data when refresh()
  emit("showPrompt")
  for await (const list of lists.value) {
    const liveData = await fetchLiveData(list.name)
    const elementOfLiveDataSet = {
      listName: list.name,
      liveData: liveData,
    }
    liveDataSet.push(elementOfLiveDataSet)
    if (list.name === "topstories") {
      fetchList(list.name)
      emit("clearPrompt")
    }
  }
  fetchList("maxitem")
  /* console.log(liveDataSet) */
  //----
})()
