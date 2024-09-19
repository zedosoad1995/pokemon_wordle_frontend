<script setup lang="ts">
import { onMounted, ref } from "vue"
import SearchModal from "./components/Modals/SearchModal.vue"
import { getPokemons } from "./api/pokemons"
import { getBoard } from "./api/boards"

const show = ref(false)
const pokemons = ref<string[]>([])
const board = ref<{
  rows: string[]
  cols: string[]
}>({
  rows: [],
  cols: []
})
const answers = ref<string[][][]>([
  [[], [], []],
  [[], [], []],
  [[], [], []]
])

onMounted(async () => {
  const res = await Promise.all([getPokemons(), getBoard(1)])

  pokemons.value = res[0].pokemons
  board.value = res[1].board
  answers.value = res[1].answers
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

  <div class="board-container">
    <div class="grid">
      <div></div>
      <div class="row">{{ board.rows[0] }}</div>
      <div class="row">{{ board.rows[1] }}</div>
      <div class="row">{{ board.rows[2] }}</div>

      <div class="col-container">
        <div class="col">{{ board.cols[0] }}</div>
      </div>
      <div class="cell" @click="openModal"></div>
      <div class="cell" @click="openModal"></div>
      <div class="cell" @click="openModal"></div>

      <div class="col-container">
        <div class="col">{{ board.cols[1] }}</div>
      </div>
      <div class="cell" @click="openModal"></div>
      <div class="cell" @click="openModal"></div>
      <div class="cell" @click="openModal"></div>

      <div class="col-container">
        <div class="col">{{ board.cols[2] }}</div>
      </div>
      <div class="cell" @click="openModal"></div>
      <div class="cell" @click="openModal"></div>
      <div class="cell" @click="openModal"></div>
    </div>
  </div>
  <SearchModal v-if="show" @modal-close="closeModal" :pokemons="pokemons" />
</template>

<style scoped>
* {
  --gap: 4px;
}

.title {
  text-align: center;
}

.row {
  text-align: center;
}

.col-container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.col {
  text-align: center;
  position: absolute;
  max-width: 100px;
  width: max-content;
  right: 0;
  margin-right: 8px;
}

.board-container {
  display: flex;
  justify-content: center;
}

.grid {
  display: grid;
  grid-template-columns: auto repeat(3, 1fr);
  grid-template-rows: auto repeat(3, 1fr);
  gap: var(--gap);
  margin-right: var(--gap);
  height: 100%;
  width: 100%;
  max-width: 500px;
}

@media screen and (max-width: 840px) {
  .grid {
    margin-right: 0;
    max-width: 600px;
  }

  .col {
    font-size: small;
    position: initial;
    margin-right: 0;
    width: auto;
  }

  .row {
    font-size: small;
  }
}

.cell {
  background-color: #eee;
  cursor: pointer;
  aspect-ratio: 1 / 1;
}
</style>
