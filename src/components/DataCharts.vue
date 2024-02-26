<script setup lang="ts">
import { use } from "echarts/core"
import { CanvasRenderer } from "echarts/renderers"
import { PieChart } from "echarts/charts"
import { TitleComponent, TooltipComponent, LegendComponent } from "echarts/components"
import type { EChartsOption } from "echarts"
import VChart from "vue-echarts"

import { useFetchingDataStore } from "@/stores/fetchData"

const statisticsOfFetchedLiveData = storeToRefs(useFetchingDataStore()).statisticsOfFetchedLiveData

const legendData: string[] = []
const seriesData: object[] = []
for (const [index, data] of statisticsOfFetchedLiveData.value.entries()) {
  const type = data.type
  legendData.push(type)
  const count = computed(() => statisticsOfFetchedLiveData.value[index].count)
  seriesData.push({ value: count, name: type })
}

use([CanvasRenderer, PieChart, TitleComponent, TooltipComponent, LegendComponent])

const option: Ref<EChartsOption> = ref({
  title: {
    text: "types of fetched item",
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
      name: "item type",
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
  <v-chart
    class="h-360px w-360px lg:(h-500px w-600px)"
    :option="option"
  />
</template>
