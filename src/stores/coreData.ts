import { defineStore } from "pinia"
import { ref } from "vue"
import type { Items, Lists, LiveDataSet } from "@/libs/types"

export const useCoreDataStore = defineStore("coreData", () => {
  const baseURL: URL = new URL("https://hacker-news.firebaseio.com/v0")

  const items = ref<Items>([])
  const lists = ref<Lists>([
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
  return { baseURL, items, lists, liveDataSet }
})
