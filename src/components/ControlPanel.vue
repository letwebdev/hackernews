<script setup lang="ts">
import type { RemovableRef } from "@vueuse/core"
import { useSettingsStore } from "@/stores/settings"
import { useCoreDataStore } from "@/stores/coreData"
import { useFetchingDataStore } from "@/stores/fetchData"
import type { ListName } from "@/types/hackerNews"

const { settings } = useSettingsStore()
const coreData = useCoreDataStore()
const fetchingData = useFetchingDataStore()
const { fetchLists, resetItemsInQueue } = fetchingData
const liveDataCacheInitialized = useFetchingDataStore().getLiveDataCacheInitializationState

const selected: RemovableRef<ListName[]> = useLocalStorage("selectedLists", ["topstories"])

const initialized = computed(() => liveDataCacheInitialized.value)
function fetchMore() {
  console.log("fetchMore() triggered")
  if (initialized.value) {
    fetchingData.promptOfFetching = "Fetching selected lists..."
    resetItemsInQueue()
    fetchSelectedLists()
  }
}
async function fetchSelectedLists() {
  await fetchLists(selected.value)
  fetchingData.promptOfFetching = ""
}

function refresh() {
  clearDisplayedItems()
  fetchMore()
}
function clearDisplayedItems() {
  coreData.items = []
}

// TODO refresh live data when refresh()
watchEffect(() => {
  if (liveDataCacheInitialized.value) {
    fetchMore()
  }
})

function scrolledToBottom(): boolean {
  return window.innerHeight + Math.round(window.scrollY) + 1 >= document.body.offsetHeight
}
function automaticallyFetchingMoreWhenScrollingToTheBottom() {
  if (settings.automaticallyFetchingMoreWhenScrollingToTheBottom.value && scrolledToBottom()) {
    fetchMore()
  }
}
onMounted(() => {
  window.addEventListener("scroll", automaticallyFetchingMoreWhenScrollingToTheBottom)
})
onUnmounted(() => {
  window.removeEventListener("scroll", automaticallyFetchingMoreWhenScrollingToTheBottom)
})
const buttonForFetchingDisabled = computed(() => !liveDataCacheInitialized.value)
</script>
<template>
  <section>
    <h1>Control Panel</h1>
    <v-btn
      class="text-none"
      color="indigo"
      :disabled="buttonForFetchingDisabled"
      @click="refresh"
    >
      Refresh
    </v-btn>
    <v-btn
      variant="tonal"
      color="indigo"
      class="text-none"
      @click="clearDisplayedItems"
    >
      Clear
    </v-btn>

    <v-btn-toggle
      v-model="selected"
      color="deep-purple-accent-3"
      class="flex-column h-auto"
      multiple
      mandatory
    >
      <v-btn
        v-for="list in coreData.lists"
        :key="list.name"
        :value="list.name"
        class="text-none !h-35px"
      >
        {{ list.description }}
      </v-btn>
    </v-btn-toggle>

    <v-btn
      color="indigo"
      class="text-none"
      :disabled="buttonForFetchingDisabled"
      @click="fetchMore"
    >
      Fetch more
    </v-btn>

    <v-btn
      color="indigo"
      class="text-none buttonFixedMobile !lg:hidden"
      size="small"
      :disabled="buttonForFetchingDisabled"
      @click="fetchMore"
    >
      Fetch
    </v-btn>
  </section>
</template>
<style scoped>
section {
  display: flex;
  width: 200px;
  flex-flow: column nowrap;
  align-items: center;
  justify-content: center;
  row-gap: 10px;
}

.buttonFixedMobile {
  position: fixed;
  top: 30%;
  right: 0%;
  width: min-content;
}
</style>
