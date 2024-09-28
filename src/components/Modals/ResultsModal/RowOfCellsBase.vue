<script setup lang="ts">
const { header, items, cellClass } = defineProps<{
  header: string
  items: any[]
  cellClass?: string
}>()
const emit = defineEmits<{
  "cell-clicked": [i: number]
}>()
</script>

<template>
  <div class="header-col-container">
    <div class="header-col">{{ header }}</div>
  </div>
  <div
    v-for="(item, i) in items"
    :key="i"
    :class="['cell', cellClass]"
    @click="emit('cell-clicked', i)"
  >
    <slot :item="item" :index="i"></slot>
  </div>
</template>

<style scoped>
.header-col-container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.header-col {
  text-align: center;
}

.cell {
  background-color: #eee;
  aspect-ratio: 1 / 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

@media screen and (max-width: 600px) {
  .header-col {
    font-size: small;
  }
}
</style>
