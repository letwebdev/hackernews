<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router"
// Init
import { storeToRefs } from "pinia"
import { useCoreDataStore } from "@/stores/coreData"
import { useFetchingDataStore } from "@/stores/fetchData"
import { useLiveDataStore } from "@/stores/liveData"

import type { LiveData } from "@/types/hackerNews"

const coreDataRef = storeToRefs(useCoreDataStore())
const lists = coreDataRef.lists
const liveDataStore = useLiveDataStore()
const liveDataCache = liveDataStore.liveDataCache
const fetchLiveData = useFetchingDataStore().fetchLiveData
const confirmLiveDataCacheFetched = useFetchingDataStore().confirmLiveDataCacheFetched
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
      const liveDataCacheItem = {
        listName: list.name,
        liveData,
      }
      liveDataCache.push(liveDataCacheItem)
    }
  }
})().then(() => {
  confirmLiveDataCacheFetched()
})
</script>
<template>
  <header>
    <nav>
      <RouterLink to="/">
        Hacker News
      </RouterLink>
      <!--
        Lack practicality
      <RouterLink to="/settings">
        Settings
      </RouterLink>
      -->
      <RouterLink to="/charts">
        Charts
      </RouterLink>
      <RouterLink to="/about">
        About
      </RouterLink>
    </nav>
  </header>

  <div class="view">
    <RouterView />
  </div>
</template>

<style lang="scss" scoped>
header {
  line-height: 1.5;
}

nav {
  display: flex;
  width: fit-content;
  flex-direction: column;
  justify-content: center;
  font-size: 12px;

  a {
    display: inline-block;
    padding: 0 1rem;
    border-left: 1px solid var(--color-border);
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }

    &.router-link-exact-active {
      background-color: rgb(44 62 80 / 4%);
    }
  }
}

.view {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

@media (width >= 1024px) {
  header {
    display: flex;
    height: 70vh;
    flex-direction: column;
    justify-content: center;

    nav {
      position: fixed;
    }
  }

  .view {
    align-items: normal;
    justify-content: normal;
    margin-left: 40px;
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
