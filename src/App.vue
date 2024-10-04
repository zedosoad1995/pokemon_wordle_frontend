<script setup lang="ts">
import { onMounted, ref } from "vue"
import SearchModal from "./components/Modals/SearchModal.vue"
import { getPokemons } from "./api/pokemons"
import { getAnswerFreqAndScore, getBoard, updateAnswer } from "./api/boards"
import { generateToken } from "./utils/token"
import { createUser } from "./api/users"
import { LocalStorage } from "./utils/localStorage"
import RowOfCells from "./components/Cells/RowOfCells.vue"
import ResultsModal from "./components/Modals/ResultsModal/ResultsModal.vue"
import { useGameState } from "./composables/useGameState"

const showSearchModal = ref(false)
const showStatsModal = ref(false)
const selectedRow = ref<number | null>(null)
const selectedCol = ref<number | null>(null)
const totalPlays = ref<number | null>(null)
const pokemons = ref<string[]>([])
const board = ref<{
  rows: string[]
  cols: string[]
}>({
  rows: ["", "", ""],
  cols: ["", "", ""]
})
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
const standing = ref<number>()

const { gameState, imagesBoard, initGameState, submitGame } = useGameState()

onMounted(async () => {
  let userToken = LocalStorage.get("userToken")
  if (userToken === null) {
    userToken = generateToken()
    await createUser(userToken)
    LocalStorage.set("userToken", userToken)
  }

  getPokemons().then((res) => {
    pokemons.value = res.pokemons
  })
  getBoard(1).then((res) => {
    board.value = res.board
    validAnswers.value = res.answers
  })

  try {
    await initGameState(userToken)
  } finally {
    getAnswerFreqAndScore(1, userToken).then((res) => {
      answerFreqs.value = res.freqs
      totalPlays.value = res.totalPlays
      standing.value = res.userPosition

      let score = 900

      res.freqs.forEach((row, i) =>
        row.forEach((cell, j) => {
          if (!gameState.value.board[i][j].pokemon) return

          const numPokeInCell = cell[gameState.value.board[i][j].pokemon]

          let rarityPerc = 0
          if (numPokeInCell > 1) {
            const total = Object.values(cell).reduce((acc, curr) => acc + curr, 0)
            rarityPerc = Number(((cell[gameState.value.board[i][j].pokemon] / total) * 100).toFixed(1))
          }
          gameState.value.board[i][j].rarityPerc = rarityPerc

          score = Number((score - (100 - rarityPerc)).toFixed(1))
        })
      )

      gameState.value.score = score
      LocalStorage.set("gameState", gameState.value)
    })
  }
})

const clickCell = (row: number) => (col: number) => {
  selectedRow.value = row
  selectedCol.value = col
  showSearchModal.value = !showSearchModal.value
}

const closeSearchModal = () => {
  selectedRow.value = null
  selectedCol.value = null
  showSearchModal.value = false
}

const clickStatsButton = () => {
  showStatsModal.value = !showStatsModal.value
}

const closeStatsModal = () => {
  showStatsModal.value = false
}

const selectPokemon = async (pokemon: string) => {
  const row = selectedRow.value
  const col = selectedCol.value

  if (row !== null && col !== null && validAnswers.value[row][col].includes(pokemon) && !gameState.value.board[row][col].pokemon) {
    const userToken = LocalStorage.get("userToken")
    if (userToken !== null) {
      updateAnswer(1, userToken, row + 1, col + 1, pokemon)

      answerFreqs.value[row][col][pokemon] = (answerFreqs.value[row][col][pokemon] ?? 0) + 1
      gameState.value.board[row][col].pokemon = pokemon
      imagesBoard.value[row][col] = import.meta.env.VITE_ASSETS_URL + "/poke_imgs/" + pokemon + ".png"

      if (answerFreqs.value[row][col][pokemon] > 1) {
        const total = Object.values(answerFreqs.value[row][col]).reduce((acc, curr) => acc + curr, 0)
        gameState.value.board[row][col].rarityPerc = Number(((answerFreqs.value[row][col][pokemon] / total) * 100).toFixed(1))
      } else {
        gameState.value.board[row][col].rarityPerc = 0
      }

      gameState.value.score = Number((gameState.value.score - 100 + gameState.value.board[row][col].rarityPerc).toFixed(1))
    }
  }

  gameState.value.numTries = Math.max(gameState.value.numTries - 1, 0)

  const userToken = LocalStorage.get("userToken")
  if ((gameState.value.numTries === 0 || gameState.value.board.every((row) => row.every((cell) => cell.pokemon?.length))) && userToken) {
    await submitGame(userToken)
    getAnswerFreqAndScore(1, userToken).then((res) => {
      answerFreqs.value = res.freqs
      totalPlays.value = res.totalPlays
      standing.value = res.userPosition
    })

    gameState.value.isGameOver = true
    totalPlays.value = (totalPlays.value ?? 0) + 1
  }

  LocalStorage.set("gameState", gameState.value)

  closeSearchModal()
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
        :openModal="clickCell(i - 1)"
        :answers="gameState.board[i - 1]"
        :is-game-over="gameState.isGameOver"
        :key="i"
      />
    </div>
  </div>
  <div class="scoring-container">
    <div>Tries: {{ gameState.numTries }}</div>
    <div>Score: {{ gameState.score }}</div>
  </div>
  <div class="stats-btn-container">
    <button v-if="gameState.isGameOver" @click="clickStatsButton">Show statistics</button>
  </div>
  <SearchModal v-if="showSearchModal" @modal-close="closeSearchModal" @select-option="selectPokemon" :pokemons="pokemons" />
  <ResultsModal
    v-if="showStatsModal"
    @modal-close="closeStatsModal"
    :top-headers="board.cols"
    :side-headers="board.rows"
    :answer-freqs="answerFreqs"
    :valid-answers="validAnswers"
    :num-plays="totalPlays"
    :standing="standing"
    :score="gameState.score"
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

.stats-btn-container {
  display: flex;
  justify-content: center;
  margin-top: 8px;
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
