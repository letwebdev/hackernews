<script setup lang="ts">
function goToTop() {
  document.documentElement.scrollTo({
    top: 0,
    behavior: "smooth",
  })
}
function goToBottom() {
  document.documentElement.scrollTo({
    top: document.body.scrollHeight,
    behavior: "smooth",
  })
}
</script>
<template>
  <button @click="goToTop" class="goToTop">🔝</button>
  <button @click="goToBottom" class="goToBottom">↓</button>
</template>
<style scoped>
button {
  width: 50px;
  height: 40px;
  border: none;
  border-radius: 5px;
  background-color: transparent;
  cursor: pointer;
  position: fixed;
  right: 0%;
  &.goToTop {
    top: 15%;
  }
  &.goToBottom {
    bottom: 25%;
  }
}
</style>
