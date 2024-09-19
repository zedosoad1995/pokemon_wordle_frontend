<script setup lang="ts">
import { onMounted, ref } from "vue"
import SearchModal from "./components/Modals/SearchModal.vue"
import { getPokemons } from "./api/pokemons"

const show = ref(false)
const pokemons = ref<string[]>([])

onMounted(async () => {
  const { pokemons: resPoke } = await getPokemons()
  pokemons.value = resPoke
})

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
    <div class="cell" @click="openModal"></div>
    <div class="cell" @click="openModal"></div>
    <div class="cell" @click="openModal"></div>
    <div class="cell" @click="openModal"></div>
    <div class="cell" @click="openModal"></div>
    <div class="cell" @click="openModal"></div>
    <div class="cell" @click="openModal"></div>
    <div class="cell" @click="openModal"></div>
  </div>
  <SearchModal v-if="show" @modal-close="closeModal" :pokemons="pokemons" />
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
