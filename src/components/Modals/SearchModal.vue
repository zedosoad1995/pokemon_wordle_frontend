<script setup lang="ts">
import { computed, ref } from "vue"

const { pokemons } = defineProps<{ pokemons: string[] }>()
const emit = defineEmits(["modal-close"])

const search = ref("")

const filteredPokemons = computed(() => {
  const trimmedSearch = search.value.trim()

  if (trimmedSearch.length < 3) return []

  const res = []
  for (let i = 0; i < pokemons.length; i++) {
    const p = pokemons[i]
    if (p.toLowerCase().includes(trimmedSearch.toLowerCase())) {
      res.push(p)
    }

    if (res.length === 4) {
      break
    }
  }

  return res
})
</script>

<template>
  <div class="overlay" @click="emit('modal-close')">
    <div class="modal" @click.stop>
      <input class="search-poke-input" v-model="search" />
      <div class="results-container" v-if="filteredPokemons.length > 0">
        <div class="result" v-for="p in filteredPokemons" :key="p">{{ p }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.overlay {
  background-color: rgba(0, 0, 0, 0.5);
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
}
.modal {
  max-width: 400px;
  width: 100%;
  margin: 100px 20px 0;
  height: 0;
}
.search-poke-input {
  border-width: 0;
  width: calc(100% - 40px);
  height: 50px;
  padding-left: 20px;
  padding-right: 20px;
  font-size: large;
}
.results-container {
  background-color: white;
  margin-top: 4px;
}
.result {
  padding: 10px 20px;
  cursor: pointer;
}
.result:hover {
  background-color: #ddd;
}
</style>
