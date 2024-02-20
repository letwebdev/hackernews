import type { Items, Lists, LiveDataSet } from "@/types/hackerNews"

export const useCoreDataStore = defineStore("coreData", () => {
  const baseUrl: URL = new URL("https://hacker-news.firebaseio.com/v0")

  const items = ref<Items>([])
  const lists = ref([
    { name: "topstories", description: "Top stories" },
    { name: "newstories", description: "New stories" },
    { name: "beststories", description: "Best stories" },
    { name: "askstories", description: "Ask stories" },
    { name: "showstories", description: "Show stories" },
    { name: "jobstories", description: "Job stories" },
    // Current largest item id
    { name: "maxitem", description: "any" },
    { name: "updates", description: "Changed items" },
  ] as const satisfies Lists)

  const liveDataSet: LiveDataSet = []
  return { baseUrl, items, lists, liveDataSet }
})
