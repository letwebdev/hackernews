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
// TODO Add "Go back to current position" button
</script>
<template>
  <button
    class="goToTop"
    @click="goToTop"
  >
    🔝
  </button>
  <button
    class="goToBottom"
    @click="goToBottom"
  >
    ↓
  </button>
</template>
<style scoped>
button {
  position: fixed;
  right: 0%;
  width: 50px;
  height: 40px;
  background-color: transparent;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &.goToTop {
    top: 15%;
  }

  &.goToBottom {
    bottom: 25%;
  }
}
</style>
