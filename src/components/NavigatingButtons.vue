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
  <section class="navigatingButtons">
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
  </section>
</template>
<style scoped>
button {
  position: fixed;
  right: 0%;
  width: 50px;
  height: 40px;
  border: none;
  border-radius: 5px;
  background-color: transparent;
  cursor: pointer;

  &.goToTop {
    top: 15%;
  }

  &.goToBottom {
    bottom: 25%;
  }
}
</style>
