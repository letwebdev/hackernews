import { useSettingsStore } from "@/stores/settings"
import { useCoreDataStore } from "@/stores/coreData"
import { generateRandomInteger, shuffleArray } from "@/libs/math"
import type { Item, LiveData } from "@/types/hackerNews"

export const useFetchingDataStore = defineStore("fetchData", () => {
  const settings = useSettingsStore().settings

  const coreData = useCoreDataStore()
  const coreDataRef = storeToRefs(useCoreDataStore())
  const items = coreDataRef.items
  const baseURL: URL = coreData.baseURL
  const itemsInQueue = ref<number>(0)

  const liveDataSet = coreData.liveDataSet

  const itemTypesAndCounts = ref([
    { type: "story", count: 0 },
    { type: "job", count: 0 },
    { type: "comment", count: 0 },
    { type: "poll", count: 0 },
    { type: "pollopt", count: 0 },
  ])

  function useFetchingLists(listNames: string[]) {
    listNames.forEach((listName) => {
      useFetchingList(listName)
    })
  }

  async function useFetchingList(listName: string = "topstories") {
    /* console.log(listName) */
    let liveDataToFetch: LiveData
    for (const element of liveDataSet) {
      /* console.log(element) */
      if (element.listName === listName) {
        liveDataToFetch = element.liveData
        break
      }
    }
    /* console.log(liveDataToFetch) */
    const itemIds = useGettingItemIds(liveDataToFetch)
    itemIds.forEach((itemId) => {
      useFetchingItem(itemId)
    })
  }

  // TODO refactor
  function useGettingItemIds(liveData: LiveData): number[] {
    console.log("liveData:")
    console.log(liveData)
    let itemIds: number[]
    if (typeof liveData === "number") {
      console.log(`Live data is currently largest item id: ${liveData}`)
      itemIds = []
      const maximumItemId: number = liveData
      for (let i = 0; i < settings.numberOfItemsFetchedEachTime.value; i++) {
        const randomItemId = generateRandomInteger(maximumItemId)
        itemIds.push(randomItemId)
      }
      console.log(`Fetch generated random ids: ${itemIds}`)
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
      console.log("Unknown live data type:")
      console.log(liveData)
      return [1]
    }
    return itemIds
  }

  function useFetchingItem(id: number) {
    itemsInQueue.value += 1
    if (itemsInQueue.value > settings.numberOfItemsFetchedEachTime.value) {
      return
    }
    const itemURL: URL = new URL(`${baseURL.href}/item/${id}.json?print=pretty`)
    const discussURL: URL = new URL(`https://news.ycombinator.com/item?id=${id}`)
    fetch(itemURL)
      .then((response): Promise<Item> => response.json())
      .then((item) => {
        item.readableTime = convertUnixTimeStampToReadableTime(item.time)
        item.discuss = discussURL
        items.value.push(item)
        updateCount(item)
      })
      .catch((error) => console.error(`Error fetching data: ${error.message}`))
  }
  function convertUnixTimeStampToReadableTime(unixTimeStampInSecond: number) {
    const readableTime = new Date(unixTimeStampInSecond * 1000)
    const readableTimeFormatted = `
           ${readableTime.getFullYear()}-${readableTime.getMonth() + 1}-${readableTime.getDate()}
           ${readableTime.getHours()}:${readableTime.getMinutes()}
           `
    return readableTimeFormatted
  }
  function updateCount(item: Item) {
    for (const itemTypeAndCount of itemTypesAndCounts.value)
      if (item.type === itemTypeAndCount.type) {
        itemTypeAndCount.count++
      }
  }

  async function useFetchingLiveData(listName: string = "topstories"): Promise<LiveData> {
    try {
      const listURL: URL = new URL(`${baseURL.href}/${listName}.json?print=pretty`)
      const response = await fetch(listURL)
      const liveData: LiveData = await response.json()
      return liveData
    } catch (error: any) {
      console.error(`Error: ${error.message}`)
    }
  }

  const promptOfFetching = ref<string>("")
  const getPromptOfFetching = computed(() => promptOfFetching)
  function changePrompt(string: string) {
    promptOfFetching.value = string
  }

  function changeItemsInQueue(number: number) {
    itemsInQueue.value = number
  }

  const liveDataSetInitialied = ref(false)
  const getLiveDataSetInitializationState = computed(() => liveDataSetInitialied)
  function confirmLiveDataSetFetched() {
    liveDataSetInitialied.value = true
  }

  return {
    useFetchingList,
    useFetchingLists,
    useFetchingItem,
    useFetchingLiveData,
    itemsInQueue,
    getPromptOfFetching,
    changePrompt,
    changeItemsInQueue,
    liveDataSetInitialied,
    getLiveDataSetInitializationState,
    confirmLiveDataSetFetched,
    itemTypesAndCounts,
  }
})
