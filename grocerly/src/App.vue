<script setup>
import { RouterView } from 'vue-router'
import HeaderComponent from './components/HeaderComponent.vue'
</script>

<template>
  <HeaderComponent />
  <main class="main-content">
    <RouterView />
  </main>
</template>

<style scoped>
.main-content {
  padding-top: 70px;
}
</style>