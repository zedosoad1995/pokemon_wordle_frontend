<script setup lang="ts">
import RowOfCellsBase from './RowOfCellsBase.vue';

const { header, freqs } = defineProps<{
  header: string
  freqs: number[]
}>()
</script>

<template>
  <RowOfCellsBase :header="header" :items="freqs">
    <template #default="{item: freq}">
      <div class="freq">{{ freq + "%" }}</div>
    </template>
  </RowOfCellsBase>
</template>

<style scoped>
.freq {
  font-size: large;
}
</style>
