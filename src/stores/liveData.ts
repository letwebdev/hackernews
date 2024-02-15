import { defineStore } from "pinia"
import type { LiveData } from "@/libs/types"

export const useLiveDataStore = defineStore("liveData", () => {
  const liveData: LiveData = []
  return { liveData }
})
