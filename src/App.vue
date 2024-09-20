<script setup lang="ts">
import { onMounted, ref } from "vue"
import SearchModal from "./components/Modals/SearchModal.vue"
import { getPokemons } from "./api/pokemons"
import { getBoard } from "./api/boards"
import { generateToken } from "./utils/token"
import { createUser } from "./api/users"
import { LocalStorage } from "./utils/localStorage"

const showSearchModal = ref(false)
const selectedRow = ref<number | null>(null)
const selectedCol = ref<number | null>(null)
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
  const apiCalls: Promise<any>[] = [getPokemons(), getBoard(1)]

  let userToken = LocalStorage.get("userToken")
  if (userToken === null) {
    userToken = generateToken()
    apiCalls.push(createUser(userToken))
    LocalStorage.set("userToken", userToken)
  }

  const res = await Promise.all(apiCalls)

  pokemons.value = res[0].pokemons
  board.value = res[1].board
  answers.value = res[1].answers
})

const openModal = (row: number, col: number) => () => {
  selectedRow.value = row
  selectedCol.value = col
  showSearchModal.value = !showSearchModal.value
}

const closeModal = () => {
  selectedRow.value = null
  selectedCol.value = null
  showSearchModal.value = false
}

const selectPokemon = (pokemon: string) => {
  if (
    selectedRow.value !== null &&
    selectedCol.value !== null &&
    answers.value[selectedRow.value][selectedCol.value].includes(pokemon)
  ) {
  } else {
  }

  closeModal()
}
</script>

<template>
  <h1 class="title">Board #1</h1>

  <div class="board-container">
    <div class="grid">
      <div></div>
      <div class="header-row">{{ board.cols[0] }}</div>
      <div class="header-row">{{ board.cols[1] }}</div>
      <div class="header-row">{{ board.cols[2] }}</div>

      <div class="header-col-container">
        <div class="header-col">{{ board.rows[0] }}</div>
      </div>
      <div class="cell" @click="openModal(0, 0)()"></div>
      <div class="cell" @click="openModal(0, 1)()"></div>
      <div class="cell" @click="openModal(0, 2)()"></div>

      <div class="header-col-container">
        <div class="header-col">{{ board.rows[1] }}</div>
      </div>
      <div class="cell" @click="openModal(1, 0)()"></div>
      <div class="cell" @click="openModal(1, 1)()"></div>
      <div class="cell" @click="openModal(1, 2)()"></div>

      <div class="header-col-container">
        <div class="header-col">{{ board.rows[2] }}</div>
      </div>
      <div class="cell" @click="openModal(2, 0)()"></div>
      <div class="cell" @click="openModal(2, 1)()"></div>
      <div class="cell" @click="openModal(2, 2)()"></div>
    </div>
  </div>
  <SearchModal
    v-if="showSearchModal"
    @modal-close="closeModal"
    @select-option="selectPokemon"
    :pokemons="pokemons"
  />
</template>

<style scoped>
* {
  --gap: 4px;
}

.title {
  text-align: center;
}

.header-row {
  text-align: center;
}

.header-col-container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.header-col {
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

  .header-col {
    font-size: small;
    position: initial;
    margin-right: 0;
    width: auto;
  }

  .header-row {
    font-size: small;
  }
}

.cell {
  background-color: #eee;
  cursor: pointer;
  aspect-ratio: 1 / 1;
}
</style>
