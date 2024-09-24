<script setup lang="ts">
import RowOfCellsBase from './RowOfCellsBase.vue';

const { header, images, answers } = defineProps<{
  header: string
  images: string[]
  answers: { pokemon?: string; rarityPerc?: number }[]
}>()
</script>

<template>
  <RowOfCellsBase :header="header" :items="images">
    <template #default="{index: i, item: image}">
      <div v-if="image.length" class="pokemon">{{ answers[i].pokemon }}</div>
      <div v-if="image.length" class="img-container">
        <img class="img" :src="image" :alt="answers[i].pokemon" />
      </div>
      <div v-if="image.length" class="rarity">{{ answers[i].rarityPerc + "%" }}</div>
    </template>
  </RowOfCellsBase>
</template>

<style scoped>
.pokemon,
.rarity {
  background-color: rgba(0, 0, 0, 0.2);
  width: 100%;
  text-align: center;
}

.img-container {
  position: relative;
  height: 100%;
  width: 100%;
  flex: 1;
}

.img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  position: absolute;
  top: 0;
  left: 0;
  margin: 0;
  padding: 0;
}

@media screen and (max-width: 500px) {
  .pokemon,
  .rarity {
    font-size: small;
  }
}
</style>
