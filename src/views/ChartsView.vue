<script setup lang="ts">
"use strict"
import DataCharts from "@/components/DataCharts.vue"
</script>
<template>
  <div class="charts">
    <h1>Charts</h1>
    <br />
    <DataCharts />
    <br />
  </div>
</template>

<style>
@media (min-width: 1024px) {
  .about {
    margin-top: 10%;
    display: block;
    align-items: center;
  }
}
</style>
