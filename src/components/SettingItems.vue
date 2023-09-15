<script setup lang="ts">
"use strict"
import { ref } from "vue"
// TODO Add histtory feature
// TODO Add a toggle to hide item text
const settingItems = ref<Map<string, number | boolean>>(new Map())
settingItems.value.set("Maximum displayed Items Per Page", 10)
settingItems.value.set("Maximum link length to display", 200)
settingItems.value.set("Fetching lists after selection", false)
settingItems.value.set("Fetching randomly ", false)
settingItems.value.set("Hiding extremely long link", true)
/* settingItems.value.set("isVeryVeryLongLink(link", string) { */
/*    if (link) { */
/*      return link.length > this.maximumLinkLengthToDisplay */
/*    } else { */
/*      return true */
/*    } */
/* }, */
</script>
<template>
  <main class="settingItems">
    <li v-for="[item, value] in settingItems" :key="item">{{ item }}: {{ value }}</li>
  </main>
</template>
