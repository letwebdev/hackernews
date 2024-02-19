import { useSettingsStore } from "@/stores/settings"
import { useCoreDataStore } from "@/stores/coreData"
import { generateRandomInteger, shuffleArray } from "@/libs/math"
import { convertUnixTimeStampToReadableTime } from "@/libs/formatter"
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

  function fetchLists(listNames: string[]) {
    listNames.forEach((listName) => {
      fetchList(listName)
    })
  }
  async function fetchList(listName: string = "topstories") {
    let liveDataToFetch: LiveData
    for (const element of liveDataSet) {
      if (element.listName === listName) {
        liveDataToFetch = element.liveData
        break
      }
    }
    /* console.log(liveDataToFetch) */
    const itemIds = getItemIds(liveDataToFetch)
    itemIds.forEach((itemId) => {
      fetchItem(itemId)
    })
  }

  function getItemIds(liveData: LiveData): number[] {
    console.log("liveData:", liveData)
    let itemIds: number[]

    if (typeof liveData === "number") {
      console.log(`Live data is currently largest item id: ${liveData}, will fetch item ids generated randomly`)
      itemIds = generatedRandomItemIds(liveData)
    } else if (typeof liveData === "object") {
      itemIds = extractItemIdsFromLiveData(liveData)
      removeduplicateItemIds(liveData)
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
  function removeduplicateItemIds(liveData: Extract<LiveData, number[] | object>) {
    const start = settings.numberOfItemsFetchedEachTime.value
    for (const element of liveDataSet) {
      if (element.liveData === liveData) {
        let itemIds: number[]
        if (Array.isArray(element.liveData)) {
          itemIds = element.liveData
        } else {
          itemIds = element.liveData.items
        }
        const end = itemIds.length - 1
        itemIds = itemIds.splice(start, end)
        break
      }
    }
  }

  function fetchItem(id: number) {
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

  const liveDataSetInitialied = ref(false)
  const getLiveDataSetInitializationState = computed(() => liveDataSetInitialied)
  function confirmLiveDataSetFetched() {
    liveDataSetInitialied.value = true
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
    liveDataSetInitialied,
    getLiveDataSetInitializationState,
    confirmLiveDataSetFetched,
    itemTypesAndCounts,
  }
})
