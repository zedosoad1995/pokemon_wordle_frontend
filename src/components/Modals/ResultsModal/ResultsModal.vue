<script setup lang="ts">
import { computed } from "vue"
import RowOfCells from "./RowOfCellsImages.vue"
import RowOfCellsFreq from "./RowOfCellsFreq.vue";
import RowOfCellsAnswers from "./RowOfCellsAnswers.vue";

const { sideHeaders, topHeaders, answerFreqs, validAnswers, numPlays } = defineProps<{
  topHeaders: string[]
  sideHeaders: string[]
  answerFreqs: Record<string, number>[][]
  validAnswers: string[][][]
  numPlays: number | null
}>()
const emit = defineEmits<{
  "modal-close": []
}>()

const mostFrequentAnswers = computed(() => {
  return answerFreqs.map((row) =>
    row.map((cell) => {
      const total = Object.values(cell).reduce((acc, val) => acc + val, 0)

      const res = Object.entries(cell).reduce(
        (mostCommon, [key, val]) => {
          if (val > mostCommon.occurences) {
            return { occurences: val, name: key }
          }

          return mostCommon
        },
        { occurences: -1, name: "" }
      )

      return { pokemon: res.name, rarityPerc: Number(((res.occurences / total) * 100).toFixed(1)) }
    })
  )
})

const mostFrequentImages = computed(() => {
  return mostFrequentAnswers.value.map((row) =>
    row.map(({ pokemon }) => import.meta.env.VITE_ASSETS_URL + "/poke_imgs/" + pokemon + ".png")
  )
})

const rarestAnswers = computed(() => {
  return answerFreqs.map((row, i) =>
    row.map((cell, j) => {
      const total = Object.values(cell).reduce((acc, val) => acc + val, 0)

      const res = Object.entries(cell).reduce(
        (rarest, [key, val]) => {
          if (val < rarest.occurences) {
            return { occurences: val, name: key }
          }

          return rarest
        },
        { occurences: Infinity, name: "" }
      )

      const answersInCell = Object.keys(cell)
      const pokemonNeverAnswered = validAnswers[i][j].find((v) => !answersInCell.includes(v))

      const pokeName = pokemonNeverAnswered ?? res.name
      const rarity = pokemonNeverAnswered ? 0 : Number(((res.occurences / total) * 100).toFixed(1))

      return { pokemon: pokeName, rarityPerc: rarity }
    })
  )
})

const rarestImages = computed(() => {
  return rarestAnswers.value.map((row) =>
    row.map(({ pokemon }) => import.meta.env.VITE_ASSETS_URL + "/poke_imgs/" + pokemon + ".png")
  )
})

const percPlayed = computed(() => {
  return answerFreqs.map((row) =>
    row.map((cell) => {
      if(numPlays === null) return 0

      const numPlaysCell = Object.values(cell).reduce((acc, val) => acc + val, 0)

      return Number((numPlaysCell/numPlays * 100).toFixed(1))
    })
  )
})
</script>

<template>
  <div class="overlay" @click="emit('modal-close')">
    <div class="modal" @click.stop>
      <h1>Game Summary</h1>
      <h2>Most popular answers</h2>
      <div class="grid">
        <div></div>
        <div class="header-row">{{ topHeaders[0] }}</div>
        <div class="header-row">{{ topHeaders[1] }}</div>
        <div class="header-row">{{ topHeaders[2] }}</div>

        <RowOfCells
          v-for="i in 3"
          :header="sideHeaders[i - 1]"
          :images="mostFrequentImages[i - 1]"
          :answers="mostFrequentAnswers[i - 1]"
          :key="i"
        />
      </div>
      <h2>Least popular answers</h2>
      <div class="grid">
        <div></div>
        <div class="header-row">{{ topHeaders[0] }}</div>
        <div class="header-row">{{ topHeaders[1] }}</div>
        <div class="header-row">{{ topHeaders[2] }}</div>

        <RowOfCells
          v-for="i in 3"
          :header="sideHeaders[i - 1]"
          :images="rarestImages[i - 1]"
          :answers="rarestAnswers[i - 1]"
          :key="i"
        />
      </div>
      <h2>Answer Frequency</h2>
      <div class="grid">
        <div></div>
        <div class="header-row">{{ topHeaders[0] }}</div>
        <div class="header-row">{{ topHeaders[1] }}</div>
        <div class="header-row">{{ topHeaders[2] }}</div>

        <RowOfCellsFreq
          v-for="i in 3"
          :key="i"
          :header="sideHeaders[i - 1]"
          :freqs="percPlayed[i - 1]"
        />
      </div>
      <h2>Answers</h2>
      <div class="grid">
        <div></div>
        <div class="header-row">{{ topHeaders[0] }}</div>
        <div class="header-row">{{ topHeaders[1] }}</div>
        <div class="header-row">{{ topHeaders[2] }}</div>

        <RowOfCellsAnswers
          v-for="i in 3"
          :key="i"
          :header="sideHeaders[i - 1]"
          :valid-answers="validAnswers[i - 1]"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
* {
  --gap: 4px;
}

.overlay {
  background-color: rgba(0, 0, 0, 0.5);
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal {
  max-width: 600px;
  width: 100%;
  margin: 0 8px;
  background-color: white;
  height: 80%;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px 8px;
}

.grid {
  display: grid;
  grid-template-columns: 0.8fr repeat(3, 1fr);
  grid-template-rows: auto repeat(3, 1fr);
  gap: 4px;
  width: 100%;
}

.header-row {
  text-align: center;
}

@media screen and (max-width: 600px) {
  .header-row {
    font-size: small;
  }
}
</style>
