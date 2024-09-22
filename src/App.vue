<script setup lang="ts">
import { onMounted, ref } from "vue"
import SearchModal from "./components/Modals/SearchModal.vue"
import { getPokemons } from "./api/pokemons"
import { getAnswerFreq, getBoard, submitAnswers, updateAnswer } from "./api/boards"
import { generateToken } from "./utils/token"
import { createUser } from "./api/users"
import { gameStateFallback, LocalStorage, type StorageKeyMap } from "./utils/localStorage"
import RowOfCells from "./components/Cells/RowOfCells.vue"

const showSearchModal = ref(false)
const selectedRow = ref<number | null>(null)
const selectedCol = ref<number | null>(null)
const pokemons = ref<string[]>([])
const board = ref<{
  rows: string[]
  cols: string[]
}>({
  rows: ["", "", ""],
  cols: ["", "", ""]
})
const imagesBoard = ref<string[][]>([
  ["", "", ""],
  ["", "", ""],
  ["", "", ""]
])
const validAnswers = ref<string[][][]>([
  [[], [], []],
  [[], [], []],
  [[], [], []]
])
const answerFreqs = ref<Record<string, number>[][]>([
  [{}, {}, {}],
  [{}, {}, {}],
  [{}, {}, {}]
])
const gameState = ref<StorageKeyMap["gameState"]>(gameStateFallback)

onMounted(() => {
  let userToken = LocalStorage.get("userToken")
  if (userToken === null) {
    userToken = generateToken()
    createUser(userToken)
    LocalStorage.set("userToken", userToken)
  }

  getPokemons().then((res) => {
    pokemons.value = res.pokemons
  })
  getBoard(1).then((res) => {
    board.value = res.board
    validAnswers.value = res.answers
  })
  getAnswerFreq(1).then((res) => {
    answerFreqs.value = res.freqs
  })

  const gameStateStorage = LocalStorage.get("gameState")
  if (gameStateStorage !== null) {
    gameState.value = gameStateStorage

    for (let i = 0; i < gameStateStorage.board.length; i++) {
      for (let j = 0; j < gameStateStorage.board[i].length; j++) {
        if (!gameStateStorage.board[i][j].pokemon) continue

        imagesBoard.value[i][j] =
          import.meta.env.VITE_ASSETS_URL +
          "/poke_imgs/" +
          gameStateStorage.board[i][j].pokemon +
          ".png"
      }
    }

    if (gameStateStorage.isGameOver && !gameStateStorage.hasSubmitted) {
      const answers = gameState.value.board.map((row) => row.map(({ pokemon }) => pokemon ?? ""))
      submitAnswers(1, userToken, answers).then(() => {
        const gameStateStorage = LocalStorage.get("gameState")
        if (gameStateStorage === null) return

        gameStateStorage.hasSubmitted = true
        LocalStorage.set("gameState", gameStateStorage)
        gameState.value = gameStateStorage
      })
    }
  } else {
    LocalStorage.set("gameState", gameStateFallback)
  }
})

const openModal = (row: number) => (col: number) => {
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
  const gameStateStorage = LocalStorage.get("gameState")
  const row = selectedRow.value
  const col = selectedCol.value

  if (
    row !== null &&
    col !== null &&
    validAnswers.value[row][col].includes(pokemon) &&
    gameStateStorage !== null &&
    !gameStateStorage.board[row][col].pokemon
  ) {
    const userToken = LocalStorage.get("userToken")
    if (userToken !== null) {
      updateAnswer(1, userToken, row + 1, col + 1, pokemon)

      answerFreqs.value[row][col][pokemon] = (answerFreqs.value[row][col][pokemon] ?? 0) + 1
      const total = Object.values(answerFreqs.value[row][col]).reduce((acc, curr) => acc + curr, 0)
      gameStateStorage.board[row][col].rarityPerc = Number(
        ((answerFreqs.value[row][col][pokemon] / total) * 100).toFixed(1)
      )
      gameStateStorage.board[row][col].pokemon = pokemon
      gameStateStorage.score = Number(
        (gameStateStorage.score - 100 + gameStateStorage.board[row][col].rarityPerc).toFixed(1)
      )

      imagesBoard.value[row][col] =
        import.meta.env.VITE_ASSETS_URL + "/poke_imgs/" + pokemon + ".png"
    }
  } else {
  }

  if (gameStateStorage !== null) {
    gameStateStorage.numTries = Math.max(gameStateStorage.numTries - 1, 0)

    const userToken = LocalStorage.get("userToken")
    if (
      (gameStateStorage.numTries === 0 ||
        gameStateStorage.board.every((row) => row.every((cell) => cell.pokemon?.length))) &&
      userToken
    ) {
      const answers = gameState.value.board.map((row) => row.map(({ pokemon }) => pokemon ?? ""))

      submitAnswers(1, userToken, answers).then(() => {
        const gameStateStorage = LocalStorage.get("gameState")
        if (gameStateStorage === null) return

        gameStateStorage.hasSubmitted = true
        LocalStorage.set("gameState", gameStateStorage)
        gameState.value = gameStateStorage
      })
      gameStateStorage.isGameOver = true
    }

    LocalStorage.set("gameState", gameStateStorage)
    gameState.value = gameStateStorage
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

      <RowOfCells
        v-for="i in 3"
        :header="board.rows[i - 1]"
        :images="imagesBoard[i - 1]"
        :openModal="openModal(i - 1)"
        :answers="gameState.board[i - 1]"
        :is-game-over="gameState.isGameOver"
      />
    </div>
  </div>
  <div class="scoring-container">
    <div>Tries: {{ gameState.numTries }}</div>
    <div>Score: {{ gameState.score }}</div>
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

.scoring-container {
  display: flex;
  justify-content: center;
  gap: 24px;
  margin-top: 16px;
}

@media screen and (max-width: 840px) {
  .grid {
    grid-template-columns: 0.8fr repeat(3, 1fr);
    margin-right: 0;
    max-width: 600px;
  }
}

@media screen and (max-width: 600px) {
  .header-row {
    font-size: small;
  }
}
</style>
