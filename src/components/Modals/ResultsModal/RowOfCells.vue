<script setup lang="ts">
const { header, images, answers } = defineProps<{
  header: string
  images: string[]
  answers: { pokemon?: string; rarityPerc?: number }[]
}>()
</script>

<template>
  <div class="header-col-container">
    <div class="header-col">{{ header }}</div>
  </div>
  <div v-for="(image, i) in images" :key="i" class="cell">
    <div v-if="image.length" class="pokemon">{{ answers[i].pokemon }}</div>
    <div v-if="image.length" class="img-container">
      <img class="img" :src="image" :alt="answers[i].pokemon" />
    </div>
    <div v-if="image.length" class="rarity">{{ answers[i].rarityPerc + "%" }}</div>
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
}

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

@media screen and (max-width: 600px) {
  .header-col {
    font-size: small;
  }
}

@media screen and (max-width: 500px) {
  .pokemon,
  .rarity {
    font-size: small;
  }
}
</style>
