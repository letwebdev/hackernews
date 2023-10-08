import { defineStore } from "pinia"
import { ref } from "vue"
import type { Items } from "@/libs/types"
export const useItemsStore = defineStore("items", () => {
  const items = ref<Items>([])
  const itemsInQueue = ref<number>(0)
  return { items, itemsInQueue }
})
