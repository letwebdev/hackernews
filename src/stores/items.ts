import { defineStore } from "pinia"
import { ref } from "vue"
import type { Items } from "@/libs/types"
export const useItemsStore = defineStore("items", () => {
  const items = ref<Items>([])
  return { items }
})
