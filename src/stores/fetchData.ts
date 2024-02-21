import { useSettingsStore } from "@/stores/settings"
import { useCoreDataStore } from "@/stores/coreData"
import { generateRandomInteger, shuffleArray } from "@/libs/math"
import type { Item, LiveData, ListName } from "@/types/hackerNews"
import { useLiveDataStore } from "@/stores/liveData"

const baseUrl: URL = new URL("https://hacker-news.firebaseio.com/v0")
export const useFetchingDataStore = defineStore("fetchData", () => {
  const { settings } = useSettingsStore()
  const { liveDataCache } = useLiveDataStore()
  const coreDataRef = storeToRefs(useCoreDataStore())
  const items = coreDataRef.items
  const itemsInQueue = ref<number>(0)

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
    let liveDataToFetch: LiveData
    for (const element of liveDataCache) {
      if (element.listName === listName) {
        liveDataToFetch = element.liveData
        break
      }
    }
    /* console.log(liveDataToFetch) */
    const itemIds = getItemIds(liveDataToFetch)
    for (const itemId of itemIds) {
      fetchItem(itemId)

      itemsInQueue.value += 1
      if (itemsInQueue.value > settings.numberOfItemsFetchedEachTime.value) {
        break
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
      removedAlreadyFetchedItemIds(liveData)
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
      itemIds = shuffleArray(itemIds)
    }

    return itemIds
  }
  function removedAlreadyFetchedItemIds(liveData: Extract<LiveData, number[] | object>) {
    let deleteCount = settings.numberOfItemsFetchedEachTime.value
    let itemIds: number[] = []

    for (const element of liveDataCache) {
      if (element.liveData === liveData) {
        if (Array.isArray(element.liveData)) {
          itemIds = element.liveData
        } else {
          itemIds = element.liveData.items
        }
        if (deleteCount > itemIds.length) {
          deleteCount = itemIds.length
        }
        itemIds = itemIds.splice(0, deleteCount)
        break
      }
    }
  }

  function fetchItem(id: number) {
    const itemUrl: URL = new URL(`${baseUrl.href}/item/${id}.json?print=pretty`)
    fetch(itemUrl)
      .then((response): Promise<Item> => response.json())
      .then((item) => {
        items.value.push(item)
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

  const liveDataCacheInitialied = ref(false)
  const getLiveDataCacheInitializationState = computed(() => liveDataCacheInitialied)
  function confirmLiveDataCacheInitialized() {
    liveDataCacheInitialied.value = true
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
    liveDataCacheInitialied,
    getLiveDataCacheInitializationState,
    confirmLiveDataCacheInitialized,
    itemTypesAndCounts,
  }
})
