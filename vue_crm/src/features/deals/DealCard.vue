<template>
  <div class="deal-card" :style="cardStyle">
    <div class="deal-avatar">{{ avatar }}</div>
    <div class="deal-title">{{ deal.title }}</div>
    <div class="deal-stage">Estágio: <span>{{ deal.stage }}</span></div>
    <div class="deal-client">Cliente: {{ deal.clientName }}</div>
    <div class="deal-value">Valor: <span>R$ {{ deal.value.toLocaleString('pt-BR') }}</span></div>
    <div class="deal-date">Criado: <span>{{ deal.createdAt }}</span></div>
    <div class="deal-date">Atualizado: <span>{{ deal.updatedAt }}</span></div>
    <button class="edit-btn" @click="$emit('edit', deal)">Editar</button>
  </div>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({
  deal: { type: Object, required: true }
})
const avatar = computed(() => props.deal.clientName ? props.deal.clientName[0].toUpperCase() : '?')
const statusColors = {
  Lead: '#e0e7ef',
  Qualificado: '#fef08a',
  Fechado: '#bbf7d0'
}
const cardStyle = computed(() => ({
  borderLeft: `8px solid ${statusColors[props.deal.stage] || '#e0e7ef'}`
}))
</script>

<style scoped>
.deal-card {
  background: #fff;
  border-radius: 8px;
  border: 1.5px solid #b6c6db;
  box-shadow: 0 2px 12px rgba(34,48,74,0.10);
  padding: 16px 14px 12px 14px;
  margin-bottom: 4px;
  cursor: grab;
  transition: box-shadow 0.15s, border 0.15s;
  display: flex;
  flex-direction: column;
  gap: 6px;
  position: relative;
}
.deal-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #2563eb;
  color: #fff;
  font-weight: 800;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 6px;
}
</style>
