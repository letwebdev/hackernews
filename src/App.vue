<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router"

import { useCoreDataStore } from "@/stores/coreData"
import { useFetchingDataStore } from "@/stores/fetchData"
import { useLiveDataStore } from "@/stores/liveData"

import type { LiveData, LiveDataCache } from "@/types/hackerNews"

import SettingItems from "@/components/SettingItems.vue"

const coreData = useCoreDataStore()
const lists = coreData.lists
const liveDataStore = useLiveDataStore()
const fetchLiveData = useFetchingDataStore().fetchLiveData
const confirmLiveDataCacheInitialized = useFetchingDataStore().confirmLiveDataCacheInitialized
// TODO Also cache items
;(async function initialize() {
  // TODO refresh live data when refresh()
  async function fetchLiveDataGroup() {
    const liveDataPromises: Promise<LiveData>[] = []
    for (const list of lists) {
      const liveDataPromise: Promise<LiveData> = fetchLiveData(list.name)
      liveDataPromises.push(liveDataPromise)
    }
    return await Promise.all(liveDataPromises)
  }

  function generateLiveDataCache(liveDataGroup: LiveData[]) {
    const cache: LiveDataCache = []
    for (const [index, list] of lists.entries()) {
      const liveDataCacheItem = {
        listName: list.name,
        liveData: liveDataGroup[index],
      }
      cache.push(liveDataCacheItem)
      console.log(liveDataCacheItem)
    }
    return cache
  }

  await (async function storeLiveDataCache() {
    const liveDataGroup = await fetchLiveDataGroup()
    const tempLiveDataCache = generateLiveDataCache(liveDataGroup)
    liveDataStore.liveDataCache.push(...tempLiveDataCache)
  })()

  confirmLiveDataCacheInitialized()
  console.log("live data cached")
})()

const menuDisplayed = ref(false)
</script>
<template>
  <header>
    <nav>
      <v-menu
        v-model="menuDisplayed"
        open-on-hover
        open-on-click
        open-delay="50"
        close-delay="50"
        :close-on-content-click="false"
        content-class="bg-light-100 p-30px"
      >
        <template #activator="{ props }">
          <v-btn
            color="primary"
            class="i-mdi-cog-outline top-10% !fixed <sm:(left-0% top-2%)"
            v-bind="props"
          />
        </template>
        <v-btn
          variant="outlined"
          class="m-x-auto w-fit -mt-30px !h-40px"
          density="comfortable"
          @click="menuDisplayed = false"
        >
          close
        </v-btn>
        <SettingItems class="<sm:(overflow-x-hidden overflow-y-scroll)" />
      </v-menu>
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
    <RouterView v-slot="{ Component }">
      <KeepAlive include="HackerNewsView">
        <component :is="Component" />
      </KeepAlive>
    </RouterView>
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
    margin-left: 120px;
  }

  div.view {
    margin-left: 5%;
  }
}
</style>
