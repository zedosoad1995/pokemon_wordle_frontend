<script setup lang="ts">
import { ref } from "vue"
import AnswersModal from "./AnswersModal.vue"
import RowOfCellsBase from "./RowOfCellsBase.vue"

const { header, validAnswers } = defineProps<{
  header: string
  validAnswers: string[][]
}>()

const handleCellClicked = (col: number) => {
  selectedCol.value = col
}

const handleModalClose = () => {
  selectedCol.value = null
}

const selectedCol = ref<number | null>(null)
</script>

<template>
  <RowOfCellsBase
    :header="header"
    :items="validAnswers"
    :cell-class="'RowOfCellsAnswers-container'"
    @cell-clicked="handleCellClicked"
  >
    <template #default="{ item: answers }">
      <div>Show Answers</div>
      <div>({{ answers.length }})</div>
    </template>
  </RowOfCellsBase>
  <AnswersModal
    v-if="selectedCol !== null"
    :answers="validAnswers[selectedCol]"
    @modal-close="handleModalClose"
  ></AnswersModal>
</template>

<style>
.RowOfCellsAnswers-container {
  cursor: pointer;
}
</style>
