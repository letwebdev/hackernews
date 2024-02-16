<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router"
// Init
import { storeToRefs } from "pinia"
import { useCoreDataStore } from "@/stores/coreData"
import { useFetchingDataStore } from "@/stores/fetchData"

import type { LiveData } from "@/libs/types"

const coreData = useCoreDataStore()
const coreDataRef = storeToRefs(useCoreDataStore())
const lists = coreDataRef.lists
const liveDataSet = coreData.liveDataSet
const fetchLiveData = useFetchingDataStore().useFetchingLiveData
const confirmLiveDataSetFetched = useFetchingDataStore().confirmLiveDataSetFetched
;(async () => {
  // Prefetch live data
  // TODO refresh live data when refresh()
  const liveDataPromises = []
  for (const list of lists.value) {
    const liveDataPromise: Promise<LiveData> = fetchLiveData(list.name)
    liveDataPromises.push(liveDataPromise)
  }
  const liveDataGroup = await Promise.all(liveDataPromises)
  for (const liveData of liveDataGroup) {
    for (const list of lists.value) {
      const elementOfLiveDataSet = {
        listName: list.name,
        liveData,
      }
      liveDataSet.push(elementOfLiveDataSet)
    }
  }
})().then(() => {
  confirmLiveDataSetFetched()
})
</script>
<template>
  <header>
    <div class="wrapper">
      <nav>
        <RouterLink to="/">
          Hacker News
        </RouterLink>
        <RouterLink to="/settings">
          Settings
        </RouterLink>
        <RouterLink to="/charts">
          Charts
        </RouterLink>
        <RouterLink to="/about">
          About
        </RouterLink>
      </nav>
    </div>
  </header>

  <div class="view">
    <RouterView />
  </div>
</template>

<style lang="scss" scoped>
header {
  width: 170px;
  line-height: 1.5;
}

nav {
  display: flex;
  width: 100%;
  flex-direction: column;
  margin-top: 1rem;
  font-size: 12px;
  text-align: center;

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

@media (width >= 1024px) {
  header {
    display: flex;
    height: 70vh;
    padding-right: calc(var(--section-gap) / 8);
    place-items: center;

    .wrapper {
      position: fixed;
      display: flex;
      flex-wrap: wrap;
      place-items: flex-start;
    }
  }

  nav {
    padding: 1rem 0;
    margin-top: 1rem;
    font-size: 1rem;
    text-align: left;
  }
}

@media (width >= 2560px) {
  nav {
    margin-left: 200px;
  }

  div.view {
    margin-left: 10%;
  }
}
</style>
