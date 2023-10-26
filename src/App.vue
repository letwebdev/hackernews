<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router"
</script>
<template>
  <header>
    <div class="wrapper">
      <nav>
        <RouterLink to="/">Hacker News</RouterLink>
        <RouterLink to="/settings">Settings</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
    </div>
  </header>

  <RouterView />
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 1rem;
  display: flex;
  flex-direction: column;

  :is(a) {
    display: inline-block;
    padding: 0 1rem;
    border-left: 1px solid var(--color-border);
    &.router-link-exact-active {
      color: var(--color-text);
      &:hover {
        background-color: transparent;
      }
    }
    &:first-of-type {
      border: 0;
    }
  }
}

@media (min-width: 624px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 8);
    .wrapper {
      display: flex;
      place-items: flex-start;
      flex-wrap: wrap;
    }
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
