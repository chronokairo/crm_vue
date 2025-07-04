<template>
  <div class="deals-board">
    <div class="board-header">
      <h2>Funil de Vendas</h2>
      <button @click="openNewDealModal">+ Novo Deal</button>
    </div>
    <DealSearch @search="onSearch" />
    <!-- Adicionar Cliente -->
    <div class="clientes-form">
      <form @submit.prevent="addClient">
        <input v-model="newClientName" placeholder="Nome do cliente" required />
        <button type="submit">Adicionar Cliente</button>
      </form>
      <div class="clientes-list">
        <span v-for="c in clients" :key="c.id" class="cliente-pill">{{ c.name }}</span>
      </div>
    </div>
    <div class="kanban">
      <draggable
        v-for="stage in stages"
        :key="stage"
        :list="dealsByStage[stage]"
        group="deals"
        class="kanban-column"
        item-key="id"
        @end="onDragEnd(stage)"
      >
        <template #header>
          <div class="kanban-column-header">
            <span>{{ stage }}</span>
            <span class="deal-count">({{ countByStage(stage) }})</span>
            <span v-if="stage === 'Lead'">🟡</span>
            <span v-else-if="stage === 'Qualificado'">🟠</span>
            <span v-else>🟢</span>
          </div>
        </template>
        <template #item="{ element: deal }">
          <DealCard :deal="deal" @edit="openEditDealModal" />
        </template>
      </draggable>
    </div>

    <!-- Modal Novo/Editar Deal -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal">
        <h3>{{ editingDeal ? 'Editar Negócio' : 'Novo Negócio' }}</h3>
        <form @submit.prevent="saveDeal">
          <label>
            Título:
            <input v-model="form.title" required />
          </label>
          <label>
            Cliente:
            <select v-model="form.clientId" required>
              <option value="" disabled>Selecione</option>
              <option v-for="c in clients" :key="c.id" :value="c.id">{{ c.name }}</option>
            </select>
          </label>
          <label>
            Valor:
            <input v-model.number="form.value" type="number" min="0" required />
          </label>
          <label>
            Estágio:
            <select v-model="form.stage" required>
              <option v-for="s in stages" :key="s" :value="s">{{ s }}</option>
            </select>
          </label>
          <label>
            Data prevista de fechamento:
            <input v-model="form.expectedCloseDate" type="date" required />
          </label>
          <div class="modal-actions">
            <button type="submit">{{ editingDeal ? 'Salvar' : 'Adicionar' }}</button>
            <button type="button" @click="closeModal">Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed, inject } from 'vue'
import { VueDraggableNext } from 'vuedraggable'
import { useDealStore } from '@/stores/deal'
import { useLocalStorageStore } from '@/stores/localStorage'
import DealCard from './DealCard.vue'
import DealSearch from './DealSearch.vue'

export default {
  name: 'DealsBoard',
  components: { draggable: VueDraggableNext, DealCard },
  setup() {
    const store = useDealStore()
    useLocalStorageStore(store)
    const toast = inject('toast')
    const stages = ref(['Lead', 'Qualificado', 'Fechado'])
    const showModal = ref(false)
    const editingDeal = ref(null)
    const form = reactive({
      id: null,
      title: '',
      clientId: '',
      value: 0,
      stage: stages.value[0],
      expectedCloseDate: ''
    })
    const newClientName = ref('')
    const searchTerm = ref('')
    function onSearch(term) {
      searchTerm.value = term.toLowerCase()
    }

    // Organiza os deals por estágio para uso no draggable
    const dealsByStage = reactive({})
    stages.value.forEach(stage => {
      dealsByStage[stage] = computed({
        get: () => store.deals.filter(d => d.stage === stage &&
          (!searchTerm.value ||
            d.title.toLowerCase().includes(searchTerm.value) ||
            d.clientName.toLowerCase().includes(searchTerm.value) ||
            (d.value + '').includes(searchTerm.value)
          )
        ),
        set: (newList) => {
          newList.forEach(deal => {
            store.moveDeal(deal.id, stage)
          })
        }
      })
    })
    // Contadores de deals por coluna
    const countByStage = (stage) => store.deals.filter(d => d.stage === stage &&
      (!searchTerm.value ||
        d.title.toLowerCase().includes(searchTerm.value) ||
        d.clientName.toLowerCase().includes(searchTerm.value) ||
        (d.value + '').includes(searchTerm.value)
      )
    ).length

    function onDragEnd(stage) {
      return (evt) => {
        // O setter do computed já atualiza o estágio
      }
    }

    function openNewDealModal() {
      editingDeal.value = null
      Object.assign(form, {
        id: null,
        title: '',
        clientId: '',
        value: 0,
        stage: stages.value[0],
        expectedCloseDate: ''
      })
      showModal.value = true
    }
    function openEditDealModal(deal) {
      editingDeal.value = deal
      Object.assign(form, { ...deal })
      showModal.value = true
    }
    function closeModal() {
      showModal.value = false
    }
    function saveDeal() {
      // Garante que clientId e value são numéricos
      form.clientId = Number(form.clientId)
      form.value = Number(form.value)
      const client = store.clients.find(c => c.id === form.clientId)
      if (!client) {
        toast.show('Selecione um cliente válido', 'error')
        return
      }
      if (editingDeal.value) {
        store.updateDeal({ ...form, clientName: client.name })
        toast.show('Negócio atualizado com sucesso!', 'success')
      } else {
        store.addDeal({ ...form, clientName: client.name })
        toast.show('Negócio criado com sucesso!', 'success')
      }
      showModal.value = false
    }
    function addClient() {
      if (!newClientName.value.trim()) {
        toast.show('Digite o nome do cliente', 'error')
        return
      }
      if (store.clients.some(c => c.name.toLowerCase() === newClientName.value.trim().toLowerCase())) {
        toast.show('Cliente já existe', 'error')
        return
      }
      store.addClient(newClientName.value)
      toast.show('Cliente adicionado!', 'success')
      newClientName.value = ''
    }

    return {
      stages,
      deals: store.deals,
      clients: store.clients,
      newClientName,
      addClient,
      showModal,
      editingDeal,
      form,
      dealsByStage,
      openNewDealModal,
      openEditDealModal,
      closeModal,
      saveDeal,
      onDragEnd,
      onSearch
    }
  }
}
</script>

<style scoped>
.deals-board {
  max-width: 1100px;
  margin: 40px auto;
  padding: 32px 28px;
  background: #f8fafc;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(34,48,74,0.10);
  border: 1px solid #d1e0ee;
}
.board-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 28px;
}
.board-header h2 {
  color: #22304a;
  font-size: 2.2rem;
  font-weight: 800;
  letter-spacing: 1px;
  text-shadow: 0 2px 8px rgba(34,48,74,0.06);
}
.board-header button {
  background: linear-gradient(90deg, #2563eb 60%, #4fa3ff 100%);
  color: #fff;
  border: none;
  padding: 12px 28px;
  border-radius: 6px;
  font-weight: 700;
  font-size: 1.08rem;
  cursor: pointer;
  transition: background 0.2s, box-shadow 0.2s;
  box-shadow: 0 2px 8px rgba(37,99,235,0.10);
}
.board-header button:hover {
  background: #22304a;
}
.clientes-form {
  margin-bottom: 18px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.clientes-form form {
  display: flex;
  gap: 8px;
}
.clientes-form input {
  flex: 1;
  padding: 8px 12px;
  border-radius: 6px;
  border: 1.5px solid #d1e0ee;
  font-size: 1rem;
}
.clientes-form button {
  background: #2563eb;
  color: #fff;
  border: none;
  padding: 8px 18px;
  border-radius: 6px;
  font-weight: 700;
  cursor: pointer;
}
.clientes-list {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.cliente-pill {
  background: #e0e7ef;
  color: #22304a;
  border-radius: 12px;
  padding: 4px 14px;
  font-size: 0.98rem;
  font-weight: 700;
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
  display: flex;
  align-items: center;
  justify-content: space-between;
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
.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(34,48,74,0.15);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}
.modal {
  background: #fff;
  border-radius: 14px;
  padding: 32px 28px 22px 28px;
  min-width: 320px;
  max-width: 95vw;
  box-shadow: 0 8px 32px rgba(34,48,74,0.18);
  border: 2px solid #2563eb;
}
.modal h3 {
  color: #2563eb;
  font-size: 1.25rem;
  font-weight: 800;
  margin-bottom: 22px;
  letter-spacing: 0.5px;
}
.modal label {
  display: block;
  margin-bottom: 14px;
  color: #22304a;
  font-weight: 700;
  font-size: 1.01rem;
}
.modal input, .modal select {
  width: 100%;
  padding: 10px 12px;
  border: 1.5px solid #d1e0ee;
  border-radius: 6px;
  margin-top: 4px;
  font-size: 1.01rem;
  background: #f9fbfd;
  color: #22304a;
  margin-bottom: 10px;
  transition: border 0.2s;
}
.modal input:focus, .modal select:focus {
  border: 2px solid #2563eb;
  outline: none;
  background: #f7fbff;
}
.modal-actions {
  display: flex;
  gap: 14px;
  margin-top: 16px;
}
.modal-actions button {
  flex: 1;
  padding: 12px 0;
  font-size: 1.01rem;
  border-radius: 6px;
  font-weight: 800;
  border: none;
  background: #2563eb;
  color: #fff;
  cursor: pointer;
  transition: background 0.2s;
}
.modal-actions button:last-child {
  background: #e53e3e;
}
.modal-actions button:last-child:hover {
  background: #b91c1c;
}
@media (max-width: 900px) {
  .deals-board {
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
.deal-stage {
  font-size: 1.04rem;
  color: #2563eb;
  font-weight: 700;
  margin-bottom: 2px;
}
</style>
