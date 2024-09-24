<script setup lang="ts">
import RowOfCellsBase from './RowOfCellsBase.vue';

const { header, validAnswers } = defineProps<{
  header: string
  validAnswers: string[][]
}>()

console.log(validAnswers)
</script>

<template>
  <RowOfCellsBase :header="header" :items="validAnswers">
    <template #default="{item: answers}">
      <div>Show Answers</div>
      <div>({{ answers.length }})</div>
    </template>
  </RowOfCellsBase>
</template>

<style scoped>

</style>
