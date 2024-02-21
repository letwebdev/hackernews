import { useSettingsStore } from "@/stores/settings"
import { useCoreDataStore } from "@/stores/coreData"
import { generateRandomInteger, shuffleArray } from "@/libs/math"
import type { Item, LiveData, ListName, LiveDataCache } from "@/types/hackerNews"
import { useLiveDataStore } from "@/stores/liveData"

export const useFetchingDataStore = defineStore("fetchData", () => {
  const baseUrl: URL = new URL("https://hacker-news.firebaseio.com/v0")
  const { settings } = useSettingsStore()
  const { liveDataCache } = useLiveDataStore()
  const coreDataStore = useCoreDataStore()
  const itemsInQueue = ref<number>(0)

  const liveDataCacheInitialized = ref(false)
  const getLiveDataCacheInitializationState = computed(() => liveDataCacheInitialized)
  function confirmLiveDataCacheInitialized() {
    liveDataCacheInitialized.value = true
  }

  const itemTypesAndCounts = ref([
    { type: "story", count: 0 },
    { type: "job", count: 0 },
    { type: "comment", count: 0 },
    { type: "poll", count: 0 },
    { type: "pollopt", count: 0 },
  ])

  function fetchLists(listNames: ListName[]) {
    listNames.forEach((listName) => {
      fetchList(listName)
    })
  }
  async function fetchList(listName: ListName = "topstories") {
    const liveDataToFetch = getLiveData(listName)
    if (liveDataToFetch === undefined) {
      console.error("live data to fetch is undefined")
      return
    }
    /* console.log(liveDataToFetch) */
    const itemIdsToFetch = getItemIds(liveDataToFetch)
    for (let count = 1; count <= settings.numberOfItemsFetchedEachTime.value; count++) {
      // TODO
      // if (itemIdsToFetch.length > 0) {
      // const itemId = itemIdsToFetch.shift()

      // }
      const itemId = itemIdsToFetch.shift()
      if (itemId) {
        fetchItem(itemId)
      } else {
        console.log("Current list is empty")
        break
      }
    }
  }
  function getLiveData(listName: ListName) {
    if (!liveDataCacheInitialized.value) {
      console.error("live data cache hasn't Initialized yet")
    }
    return extractLiveDataFromCache(listName, liveDataCache)
  }
  function extractLiveDataFromCache(nameOfListToExtractBy: ListName, cacheOfLiveData: LiveDataCache) {
    for (const itemInCacheOfLiveData of cacheOfLiveData) {
      if (itemInCacheOfLiveData.listName === nameOfListToExtractBy) {
        return itemInCacheOfLiveData.liveData
      }
    }
  }
  function getItemIds(liveData: LiveData): number[] {
    console.log("liveData:", liveData)
    let itemIds: number[]

    if (typeof liveData === "number") {
      console.log(`Live data is currently largest item id: ${liveData}, will fetch item ids generated randomly`)
      itemIds = generatedRandomItemIds(liveData)
    } else if (typeof liveData === "object") {
      itemIds = extractItemIdsFromLiveData(liveData)
      removeAlreadyFetchedItemIds(liveData, settings.numberOfItemsFetchedEachTime.value)
    } else if (typeof liveData === "undefined") {
      console.error("live data is undefined")
      itemIds = [1]
    } else {
      console.error("Unknown live data type:", liveData)
      itemIds = [1]
    }

    return itemIds
  }

  function generatedRandomItemIds(maximumItemId: number) {
    const itemIds: number[] = []
    for (let i = 0; i < settings.numberOfItemsFetchedEachTime.value; i++) {
      const randomItemId = generateRandomInteger(maximumItemId)
      itemIds.push(randomItemId)
    }
    console.log(`Generated random ids: ${itemIds}`)
    return itemIds
  }

  function extractItemIdsFromLiveData(liveData: Extract<LiveData, number[] | object>): number[] {
    let itemIds: number[]
    if (Array.isArray(liveData)) {
      itemIds = liveData
    } else {
      itemIds = liveData.items
    }

    if (settings.fetchingRandomly.value) {
      return shuffleArray(itemIds)
    } else {
      return itemIds
    }
  }
  function removeAlreadyFetchedItemIds(liveData: Extract<LiveData, number[] | object>, quantity: number) {
    for (const livedataCacheItem of liveDataCache) {
      if (livedataCacheItem.liveData === liveData) {
        let itemIds: number[]
        if (Array.isArray(livedataCacheItem.liveData)) {
          itemIds = livedataCacheItem.liveData
        } else {
          itemIds = livedataCacheItem.liveData.items
        }
        itemIds.splice(0, quantity)
        break
      }
    }
  }

  function fetchItem(id: number) {
    const itemUrl: URL = new URL(`${baseUrl.href}/item/${id}.json?print=pretty`)
    fetch(itemUrl)
      .then((response): Promise<Item> => response.json())
      .then((item) => {
        coreDataStore.items.push(item)
        updateCount(item)
      })
      .catch((error) => console.error(`Error fetching data: ${error.message}`))
  }
  function updateCount(item: Item) {
    for (const itemTypeAndCount of itemTypesAndCounts.value)
      if (item.type === itemTypeAndCount.type) {
        itemTypeAndCount.count++
      }
  }

  async function fetchLiveData(listName: string = "topstories"): Promise<LiveData> {
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

  return {
    fetchList,
    fetchLists,
    fetchItem,
    fetchLiveData,
    itemsInQueue,
    getPromptOfFetching,
    changePrompt,
    changeItemsInQueue,
    liveDataCacheInitialized,
    getLiveDataCacheInitializationState,
    confirmLiveDataCacheInitialized,
    itemTypesAndCounts,
  }
})
