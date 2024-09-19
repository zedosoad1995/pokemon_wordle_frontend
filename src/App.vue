<script setup lang="ts">
import { ref } from "vue"
import SearchModal from "./components/Modals/SearchModal.vue"

const show = ref(false)

const openModal = () => {
  show.value = !show.value
}

const closeModal = () => {
  show.value = false
}
</script>

<template>
  <h1 class="title">Board #1</h1>
  <div class="grid">
    <div class="cell" @click="openModal"></div>
    <div class="cell"></div>
    <div class="cell"></div>
    <div class="cell"></div>
    <div class="cell"></div>
    <div class="cell"></div>
    <div class="cell"></div>
    <div class="cell"></div>
    <div class="cell"></div>
  </div>
  <SearchModal v-if="show" @modal-close="closeModal" />
</template>

<style scoped>
.title {
  text-align: center;
}
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  gap: 4px;
  height: 100%;
  width: 100%;
  max-width: 500px;
  aspect-ratio: 1 / 1;
  margin-left: auto;
  margin-right: auto;
}
.cell {
  background-color: #eee;
  cursor: pointer;
}
</style>
