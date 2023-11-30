<script setup lang="ts">
import { storeToRefs } from "pinia"
import { useFetchingDataStore } from "@/stores/fetchData"

import { use } from "echarts/core"
import { CanvasRenderer } from "echarts/renderers"
import { PieChart } from "echarts/charts"
import { TitleComponent, TooltipComponent, LegendComponent } from "echarts/components"
import type { EChartsOption } from "echarts"
import VChart, { THEME_KEY } from "vue-echarts"

import { ref, provide } from "vue"
import type { Ref } from "vue"

const itemTypesAndCounts = storeToRefs(useFetchingDataStore()).itemTypesAndCounts

const legendData: string[] = []
const seriesData: object[] = []
for (const [index, itemTypeAndCount] of itemTypesAndCounts.value.entries()) {
  const type: string = itemTypeAndCount.type
  legendData.push(type)
  const count = itemTypesAndCounts.value[index].count
  seriesData.push({ value: count, name: type })
}

provide(THEME_KEY, "light")

use([CanvasRenderer, PieChart, TitleComponent, TooltipComponent, LegendComponent])

const option: Ref<EChartsOption> = ref({
  title: {
    text: "fetched item types",
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
  <v-chart class="chart" :option="option" />
</template>
<style scoped>
.chart {
  height: 400px;
}
</style>
