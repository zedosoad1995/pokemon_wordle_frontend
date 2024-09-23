<script setup lang="ts">
const emit = defineEmits<{
  "modal-close": []
}>()
</script>

<template>
  <div class="overlay" @click="emit('modal-close')">
    <div class="modal" @click.stop></div>
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
  align-items: center;
}
.modal {
  max-width: 400px;
  width: 100%;
  margin: 0 8px;
  background-color: white;
  height: 70%;
}
</style>
