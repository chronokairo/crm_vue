<template>
  <div class="funil-board">
    <div class="kanban">
      <draggable
        v-for="stage in stages"
        :key="stage"
        :list="dealsByStage[stage]"
        group="deals"
        class="kanban-column"
        item-key="id"
        @change="onDrag(stage)"
      >
        <template #header>
          <div class="kanban-column-header">{{ stage }}</div>
        </template>
        <template #item="{ element: deal }">
          <div class="deal-card">
            <div class="deal-title">{{ deal.title }}</div>
            <div class="deal-client">Cliente: {{ deal.clientName }}</div>
            <div class="deal-value">Valor: <span>R$ {{ deal.value.toLocaleString('pt-BR') }}</span></div>
            <div class="deal-date">Fechamento: <span>{{ deal.expectedCloseDate }}</span></div>
            <button class="edit-btn" @click="editDeal(deal)">Editar</button>
          </div>
        </template>
      </draggable>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { VueDraggableNext as draggable } from 'vuedraggable'

const stages = ['Lead', 'Qualificado', 'Fechado']

const dealsByStage = reactive({
  Lead: [
    {
      id: 1,
      title: 'Proposta para João',
      clientName: 'João Silva',
      value: 5000,
      expectedCloseDate: '2025-07-15'
    }
  ],
  Qualificado: [
    {
      id: 2,
      title: 'Negociação com Maria',
      clientName: 'Maria Souza',
      value: 8000,
      expectedCloseDate: '2025-07-20'
    }
  ],
  Fechado: []
})

// Atualiza o estágio do negócio ao arrastar
function onDrag(targetStage) {
  // Garante que cada negócio está no array correto
  stages.forEach(stage => {
    dealsByStage[stage].forEach(deal => {
      deal.stage = stage
    })
  })
}

// Placeholder para edição
function editDeal(deal) {
  alert(`Editar: ${deal.title}`)
}
</script>

<style scoped>
.funil-board {
  max-width: 1100px;
  margin: 40px auto;
  padding: 32px 28px;
  background: #f8fafc;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(34,48,74,0.10);
  border: 1px solid #d1e0ee;
}
.kanban {
  display: flex;
  gap: 32px;
  min-height: 340px;
}
.kanban-column {
  background: #fff;
  border-radius: 12px;
  flex: 1;
  padding: 18px 12px 12px 12px;
  min-width: 260px;
  border: 1.5px solid #d1e0ee;
  box-shadow: 0 2px 8px rgba(34,48,74,0.06);
  display: flex;
  flex-direction: column;
  gap: 14px;
  transition: box-shadow 0.2s, border 0.2s;
}
.kanban-column-header {
  font-weight: 800;
  color: #2563eb;
  font-size: 1.18rem;
  margin-bottom: 12px;
  letter-spacing: 0.5px;
  text-shadow: 0 2px 8px rgba(37,99,235,0.06);
}
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
.deal-card:active {
  cursor: grabbing;
  box-shadow: 0 4px 24px rgba(37,99,235,0.13);
  border-color: #2563eb;
}
.deal-title {
  font-size: 1.13rem;
  font-weight: 800;
  color: #22304a;
  margin-bottom: 2px;
  text-shadow: 0 1px 4px rgba(34,48,74,0.04);
}
.deal-client, .deal-value, .deal-date {
  font-size: 1.04rem;
  color: #22304a;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 4px;
  text-shadow: 0 1px 4px rgba(34,48,74,0.03);
}
.deal-value span, .deal-date span {
  font-weight: 700;
  color: #2563eb;
}
.edit-btn {
  align-self: flex-end;
  margin-top: 8px;
  background: #2563eb;
  color: #fff;
  border: none;
  padding: 7px 20px;
  border-radius: 5px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s;
  box-shadow: 0 1px 4px rgba(37,99,235,0.08);
}
.edit-btn:hover {
  background: #4fa3ff;
}
@media (max-width: 900px) {
  .funil-board {
    padding: 16px 2vw;
  }
  .kanban {
    flex-direction: column;
    gap: 18px;
  }
  .kanban-column {
    min-width: 0;
  }
}
</style>
