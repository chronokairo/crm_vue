<template>
  <input
    v-model="search"
    class="search-input"
    placeholder="Buscar negócios, clientes, valores..."
    @input="$emit('search', search)"
  />
</template>

<script setup>
import { ref } from 'vue'
const search = ref('')
</script>

<style scoped>
.search-input {
  width: 100%;
  padding: 10px 16px;
  border-radius: 8px;
  border: 1.5px solid #d1e0ee;
  font-size: 1.08rem;
  margin-bottom: 18px;
  background: #f9fbfd;
  color: #22304a;
}
</style>
