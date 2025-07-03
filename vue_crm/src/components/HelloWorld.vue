<template>
  <div class="hello">
    <h2>{{ msg }}</h2>
    <p>Este é um projeto CRM feito em Vue 3.</p>
  </div>
</template>

<script setup>
defineProps({
  msg: String
})
</script>

<style scoped>
.hello {
  text-align: center;
  margin-bottom: 1.5rem;
}
.hello h2 {
  color: #1976d2;
  margin-bottom: 0.5rem;
}
</style>
