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
// TODO Add "Go back to previous position" button
</script>
<template>
  <section class="navigatingButtons">
    <button
      class="top-15% i-mdi-arrow-collapse-up"
      @click="goToTop"
    />
    <button
      class="bottom-25% i-mdi-arrow-collapse-down"
      @click="goToBottom"
    />
  </section>
</template>
<style scoped>
button {
  position: fixed;
  right: 0;
  width: 50px;
  cursor: pointer;
}
</style>
