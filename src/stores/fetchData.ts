import { useSettingsStore } from "@/stores/settings"
import { useCoreDataStore } from "@/stores/coreData"
import { generateRandomInteger, shuffleArray } from "@/libs/math"
import type { Item, LiveData } from "@/types/hackerNews"

export const useFetchingDataStore = defineStore("fetchData", () => {
  const settings = useSettingsStore().settings

  const coreData = useCoreDataStore()
  const coreDataRef = storeToRefs(useCoreDataStore())
  const items = coreDataRef.items
  const baseUrl: URL = coreData.baseUrl
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
    let liveDataToFetch: LiveData
    for (const element of liveDataSet) {
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
  function generatedRandomItemIds(maximumItemId: number) {
    const itemIds: number[] = []
    for (let i = 0; i < settings.numberOfItemsFetchedEachTime.value; i++) {
      const randomItemId = generateRandomInteger(maximumItemId)
      itemIds.push(randomItemId)
    }
    console.log(`Generated random ids: ${itemIds}`)
    return itemIds
  }
  function useGettingItemIds(liveData: LiveData): number[] {
    console.log("liveData:")
    console.log(liveData)
    let itemIds: number[]
    if (typeof liveData === "number") {
      console.log(`Live data is currently largest item id: ${liveData}, will fetch item ids generated randomly`)
      const maximumItemId = liveData
      itemIds = generatedRandomItemIds(maximumItemId)
    } else if (typeof liveData === "object") {
      let itemIdsInLiveData: number[]

      if (Array.isArray(liveData)) {
        console.log("Live data is an array ")
        itemIdsInLiveData = liveData
      } else {
        console.log("Live data is changed items ")
        itemIdsInLiveData = liveData.items
      }

      if (settings.fetchingRandomly.value) {
        itemIds = shuffleArray(itemIdsInLiveData)
      } else {
        itemIds = [...itemIdsInLiveData]
      }
      removeduplicateItemIds(liveData)
    } else {
      console.error(`Unknown live data type:${JSON.stringify(liveData)}`)
      return [1]
    }
    return itemIds
  }

  function removeduplicateItemIds(liveData: Extract<LiveData, number[] | object>) {
    for (const element of liveDataSet) {
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
  }

  function useFetchingItem(id: number) {
    itemsInQueue.value += 1
    if (itemsInQueue.value > settings.numberOfItemsFetchedEachTime.value) {
      return
    }
    const itemUrl: URL = new URL(`${baseUrl.href}/item/${id}.json?print=pretty`)
    const discussUrl: URL = new URL(`https://news.ycombinator.com/item?id=${id}`)
    fetch(itemUrl)
      .then((response): Promise<Item> => response.json())
      .then((item) => {
        item.readableTime = convertUnixTimeStampToReadableTime(item.time)
        item.discuss = discussUrl
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
      const listUrl: URL = new URL(`${baseUrl.href}/${listName}.json?print=pretty`)
      const response = await fetch(listUrl)
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
