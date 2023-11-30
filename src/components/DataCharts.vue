<script setup lang="ts">
import { storeToRefs } from "pinia"
import { useCoreDataStore } from "@/stores/coreData"
import { useFetchingDataStore } from "@/stores/fetchData"

import { use } from "echarts/core"
import { CanvasRenderer } from "echarts/renderers"
import { PieChart } from "echarts/charts"
import { TitleComponent, TooltipComponent, LegendComponent } from "echarts/components"
import type { EChartsOption } from "echarts"
import VChart, { THEME_KEY } from "vue-echarts"

import { ref, provide } from "vue"
import type { Ref } from "vue"

// Load data
// TODO
const liveDataSetInitialied = useFetchingDataStore().getLiveDataSetInitializationState
/* const coreData = useCoreDataStore() */
const coreDataRef = storeToRefs(useCoreDataStore())
const lists = coreDataRef.lists

let interValId: number | null = window.setInterval(() => {
  if (liveDataSetInitialied.value) {
    if (interValId) {
      clearInterval(interValId)
      interValId = null
    }
  }
}, 200)

provide(THEME_KEY, "light")

use([CanvasRenderer, PieChart, TitleComponent, TooltipComponent, LegendComponent])

const legendData: string[] = []
const seriesData: object[] = []
let testValue = ref(100)
for (const list of lists.value) {
  if (list.name === "maxitem" || list.name === "updates") {
    continue
  }
  const storyType: string = list.description
  legendData.push(storyType)
  seriesData.push({ value: testValue, name: storyType })
}
const option: Ref<EChartsOption> = ref({
  title: {
    text: "Story types(Top Stories)",
    left: "center",
  },
  tooltip: {
    trigger: "item",
    formatter: "{a} <br/>{b} : {c} ({d}%)",
  },
  legend: {
    orient: "vertical",
    left: "left",
    data: legendData,
  },
  series: [
    {
      name: "Story types",
      type: "pie",
      radius: "55%",
      center: ["50%", "60%"],
      data: seriesData,
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: "rgba(0, 0, 0, 0.5)",
        },
      },
    },
  ],
})
</script>
<template>
  <v-chart class="chart" :option="option" />
</template>
<style scoped>
.chart {
  height: 400px;
}
</style>
