<script setup lang="ts">
import { useSettingsStore } from "@/stores/settings"
import { useCoreDataStore } from "@/stores/coreData"
import { useFetchingDataStore } from "@/stores/fetchData"

const settings = useSettingsStore().settings
const coreDataRef = storeToRefs(useCoreDataStore())
const items = coreDataRef.items
const lists = coreDataRef.lists
const fetchLists = useFetchingDataStore().fetchLists
const fetchList = useFetchingDataStore().fetchList
const changePrompt = useFetchingDataStore().changePrompt
const changeItemsInQueue = useFetchingDataStore().changeItemsInQueue
const liveDataSetInitialied = useFetchingDataStore().getLiveDataSetInitializationState

const selected = ref([{ name: "topstories", description: "Top stories" }])
function fetchSelectedLists() {
  const listNames: string[] = []
  selected.value.forEach((list) => {
    listNames.push(list.name)
  })
  fetchLists(listNames)
}

function fetchMore() {
  // Clear count
  changeItemsInQueue(0)
  fetchSelectedLists()
}

function refresh() {
  clear()
  fetchMore()
}
function clear() {
  // Clear displayed items
  items.value = []
}

const descriptions = computed<string[]>(() => selected.value.map((option) => option.description))

function fetchListsAfterSelection() {
  if (settings.fetchingListsAfterSelection.value) {
    fetchMore()
  }
}

// Init: Fetch stories
changePrompt("Fetching selected lists...")
// TODO refresh live data when refresh()
let interValId: number | null = window.setInterval(() => {
  if (liveDataSetInitialied.value) {
    fetchList(selected.value[0].name).then(() => {
      changePrompt("")
    })
    fetchList("maxitem")
    if (interValId) {
      clearInterval(interValId)
      interValId = null
    }
  }
}, 200)

function scrolledToBottom(): boolean {
  return window.innerHeight + Math.round(window.scrollY) + 1 >= document.body.offsetHeight
}
window.addEventListener("scroll", () => {
  if (settings.automaticallyFetchingMoreWhenScrollingToTheBottom.value) {
    if (scrolledToBottom()) {
      fetchMore()
    }
  }
})
</script>
<template>
  <section>
    <h1>Control Panel</h1>
    <v-btn
      class="text-none"
      color="indigo"
      @click="refresh"
    >
      Refresh
    </v-btn>
    <v-btn
      variant="tonal"
      color="indigo"
      class="text-none"
      @click="clear"
    >
      Clear
    </v-btn>

    <section class="promptForSmallScreen">
      <h2>Selected:</h2>
      <ul>
        <li
          v-for="description in descriptions"
          :key="description"
        >
          {{ description }}
        </li>
      </ul>
    </section>

    <select
      v-model="selected"
      multiple
      class="selectedLists"
      @change="fetchListsAfterSelection"
    >
      <option
        v-for="list in lists"
        :key="list.name"
        :value="{ description: list.description, name: list.name }"
      >
        {{ list.description }}
      </option>
    </select>
    <v-btn
      color="indigo"
      class="text-none"
      @click="fetchMore"
    >
      Fetch more
    </v-btn>

    <v-btn
      color="indigo"
      class="text-none buttonFixedMobile !lg:hidden"
      size="small"
      @click="fetchMore"
    >
      Fetch more
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

select {
  max-width: 55%;
}

.buttonFixedMobile {
  position: fixed;
  top: 30%;
  right: 0%;
  width: min-content;
}

@media (width >= 1024px) {
  select {
    min-width: 175px;
    min-height: 240px;
    margin: 5% 0;
  }

  .promptForSmallScreen {
    display: none;
  }
}
</style>
