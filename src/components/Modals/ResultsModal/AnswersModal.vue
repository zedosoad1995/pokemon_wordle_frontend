<script setup lang="ts">
const { answers } = defineProps<{
  answers: string[]
}>()
const emit = defineEmits<{
  "modal-close": []
}>()
</script>

<template>
  <div class="overlay" @click="emit('modal-close')">
    <div class="modal" @click.stop>
      <h3>Answers</h3>
      <p v-for="answer in answers" :key="answer">{{ answer }}</p>
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
  margin: 0 8px;
  background-color: white;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px 36px 24px;
  max-height: 80%;
}

p {
  margin: 0;
}
</style>
