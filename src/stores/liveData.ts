import type { LiveData, LiveDataCache } from "@/types/hackerNews"

export const useLiveDataStore = defineStore("liveData", () => {
  const liveData: LiveData = []
  const liveDataCache: LiveDataCache = []
  return { liveData, liveDataCache }
})
