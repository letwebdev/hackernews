<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router"
import DataCharts from "@/components/DataCharts.vue"
// Init
import { useCoreDataStore } from "@/stores/coreData"
import { useFetchingDataStore } from "@/stores/fetchData"

import { storeToRefs } from "pinia"
import type { LiveData } from "@/libs/types"
import { computed } from "vue"
const coreData = useCoreDataStore()
const coreDataRef = storeToRefs(useCoreDataStore())
const lists = coreDataRef.lists
const liveDataSet = coreData.liveDataSet
const fetchLiveData = useFetchingDataStore().useFetchingLiveData
const confirmLiveDataSetFetched = useFetchingDataStore().confirmLiveDataSetFetched
;(async () => {
  // Prefetch live data
  // TODO refresh live data when refresh()
  for (const list of lists.value) {
    const liveData: LiveData = await fetchLiveData(list.name)
    const elementOfLiveDataSet = {
      listName: list.name,
      liveData: liveData,
    }
    liveDataSet.push(elementOfLiveDataSet)
  }
})().then(() => {
  confirmLiveDataSetFetched()
})
const largeScreen = computed(() => window.matchMedia("(max-width: 2560px)"))
</script>
<template>
  <header>
    <div class="wrapper">
      <nav>
        <RouterLink to="/">Hacker News</RouterLink>
        <RouterLink to="/settings">Settings</RouterLink>
        <RouterLink to="/charts">Charts</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
    </div>
  </header>

  <main>
    <RouterView />
    <DataCharts v-if="largeScreen" />
  </main>
</template>

<style lang="scss" scoped>
header {
  width: 170px;
  line-height: 1.5;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 1rem;
  display: flex;
  flex-direction: column;

  a {
    display: inline-block;
    padding: 0 1rem;
    border-left: 1px solid var(--color-border);
    &.router-link-exact-active {
      color: var(--color-text);
      &:hover {
        background-color: transparent;
      }
    }
    &:first-of-type {
      border: 0;
    }
  }
}
@media (min-width: 1024px) {
  header {
    height: 70vh;
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 8);
    .wrapper {
      position: fixed;
      display: flex;
      place-items: flex-start;
      flex-wrap: wrap;
    }
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
@media (min-width: 2560px) {
  main {
    display: flex;
  }
}
</style>
