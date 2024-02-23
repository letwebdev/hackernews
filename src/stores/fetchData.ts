import { useSettingsStore } from "@/stores/settings"
import { useCoreDataStore } from "@/stores/coreData"
import { generateRandomInteger } from "@/libs/math"
import type { Item, LiveData, ListName } from "@/types/hackerNews"
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

  const statisticsOfFetchedLiveData = ref([
    { type: "story", count: 0 },
    { type: "job", count: 0 },
    { type: "comment", count: 0 },
    { type: "poll", count: 0 },
    { type: "pollopt", count: 0 },
  ])

  async function fetchLists(listNames: ListName[]) {
    for (const listName of listNames) {
      // console.log(listName, liveDataCache)
      fetchList(listName)
    }
  }
  async function fetchList(listName: ListName = "topstories") {
    const itemIdsToFetch = getItemIds(listName, settings.numberOfItemsFetchedEachTime.value)

    if (itemIdsToFetch === undefined) {
      console.error("live data is undefined")
      return
    } else if (itemIdsToFetch.length === 0) {
      console.log("Current list is empty")
    }

    for (let count = 1; count <= settings.numberOfItemsFetchedEachTime.value; count++) {
      const itemId = itemIdsToFetch.shift()
      if (itemId) {
        fetchItem(itemId)
      }
    }
  }
  function getItemIds(listName: ListName, quantity: number) {
    return getItemIdsFromLiveData(listName, quantity)
  }
  function getItemIdsFromLiveData(listName: ListName, quantity: number) {
    return getItemIdsFromLiveDataInCache(listName, quantity)
  }
  function getItemIdsFromLiveDataInCache(listName: ListName, quantity: number): number[] | undefined {
    const liveData = getLiveDataFromCache(listName)
    // console.log(listName, liveDataCache)
    // console.log("liveData:", liveData)

    if (typeof liveData === "number") {
      console.log(`Live data is currently largest item id: ${liveData}, will fetch item ids generated randomly`)
      return generateRandomItemIds(liveData, quantity)
    } else if (typeof liveData === "object") {
      return [...extractItemIdsFromLiveDataInCache(liveData, quantity)]
    } else if (typeof liveData === "undefined") {
      console.error("live data is undefined")
    } else {
      console.error("Unknown live data type:", liveData)
    }
  }
  function getLiveDataFromCache(listName: ListName) {
    if (!liveDataCacheInitialized.value) {
      console.log("live data cache hasn't Initialized yet")
      
    } else {
      for (const liveDataCacheItem of liveDataCache) {
        if (liveDataCacheItem.listName === listName) {
          return liveDataCacheItem.liveData
        }
      }
    }
  }

  function generateRandomItemIds(maximumItemId: number, quantity: number) {
    const itemIds: number[] = []
    for (let i = 0; i < quantity; i++) {
      const randomItemId = generateRandomInteger(maximumItemId)
      itemIds.push(randomItemId)
    }
    console.log("Generated random ids: ", itemIds)
    return itemIds
  }

  function extractItemIdsFromLiveDataInCache(
    liveData: Extract<LiveData, number[] | object>,
    quantity: number
  ): number[] {
    const itemIds: number[] = []
    for (const liveDataCacheItem of liveDataCache) {
      if (liveDataCacheItem.liveData === liveData) {
        if (Array.isArray(liveDataCacheItem.liveData)) {
          // console.log("length of item ids just before extracting is:", liveDataCacheItem.liveData.length)
          itemIds.push(...liveDataCacheItem.liveData.splice(0, quantity))
        } else {
          itemIds.push(...liveDataCacheItem.liveData.items.splice(0, quantity))
        }
        break
      }
    }
    return itemIds
  }

  async function fetchItem(id: number) {
    const itemUrl: URL = new URL(`${baseUrl.href}/item/${id}.json?print=pretty`)
    fetch(itemUrl)
      .then((response): Promise<Item> => response.json())
      .then((item) => {
        coreDataStore.items.push(item)
        updateCount(item)
      })
      .catch((error) => {
        console.error(`Error fetching data: ${error.message}`)
      })
  }
  function updateCount(item: Item) {
    for (const statisticsItem of statisticsOfFetchedLiveData.value)
      if (item.type === statisticsItem.type) {
        statisticsItem.count++
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

  const promptOfFetching = ref<string>("Caching live data")

  function resetItemsInQueue() {
    itemsInQueue.value = 0
  }

  return {
    fetchList,
    fetchLists,
    fetchItem,
    fetchLiveData,
    itemsInQueue,
    promptOfFetching,
    resetItemsInQueue,
    liveDataCacheInitialized,
    getLiveDataCacheInitializationState,
    confirmLiveDataCacheInitialized,
    statisticsOfFetchedLiveData,
  }
})
