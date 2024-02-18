import type { LiveData } from "@/types/hackerNews"

export const useLiveDataStore = defineStore("liveData", () => {
  const liveData: LiveData = []
  return { liveData }
})
