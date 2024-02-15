<script setup lang="ts">

import DataCharts from "@/components/DataCharts.vue"
</script>
<template>
  <div class="charts">
    <h1>Charts</h1>
    <br>
    <DataCharts />
    <br>
  </div>
</template>

<style>
@media (min-width: 1024px) {
  .charts {
    margin: 2% 0 0 2%;
    display: block;
    align-items: center;
  }
}
@media (min-width: 2560px) {
  .charts {
    margin-top: 4%;
  }
}
</style>
