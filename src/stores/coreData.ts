import type { Items, Lists } from "@/types/hackerNews"

export const useCoreDataStore = defineStore("coreData", () => {
  const items = ref<Items>([])
  const lists = [
    { name: "topstories", description: "Top stories" },
    { name: "newstories", description: "New stories" },
    { name: "beststories", description: "Best stories" },
    { name: "askstories", description: "Ask stories" },
    { name: "showstories", description: "Show stories" },
    { name: "jobstories", description: "Job stories" },
    { name: "maxitem", description: "any" }, // Currently largest item id
    { name: "updates", description: "Changed items" },
  ] as const satisfies Lists

  return { items, lists }
})
