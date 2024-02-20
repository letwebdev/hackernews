import type { LiveData, LiveDataSet } from "@/types/hackerNews"

export const useLiveDataStore = defineStore("liveData", () => {
  const liveData: LiveData = []
  const liveDataSet: LiveDataSet = []
  return { liveData, liveDataSet }
})
