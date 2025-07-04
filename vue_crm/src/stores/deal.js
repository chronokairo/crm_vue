import { defineStore } from 'pinia'

function generateId() {
  return Date.now() + Math.floor(Math.random() * 10000)
}

export const useDealStore = defineStore('deal', {
  state: () => ({
    deals: [
      {
        id: 1,
        title: 'Proposta para João',
        clientId: 1,
        clientName: 'João Silva',
        value: 5000,
        stage: 'Lead',
        expectedCloseDate: '2025-07-15',
        createdAt: '2025-07-01',
        updatedAt: '2025-07-01'
      },
      {
        id: 2,
        title: 'Negociação com Maria',
        clientId: 2,
        clientName: 'Maria Souza',
        value: 8000,
        stage: 'Qualificado',
        expectedCloseDate: '2025-07-20',
        createdAt: '2025-07-02',
        updatedAt: '2025-07-02'
      }
    ],
    clients: [
      { id: 1, name: 'João Silva' },
      { id: 2, name: 'Maria Souza' },
      { id: 3, name: 'Empresa X' }
    ]
  }),
  actions: {
    addDeal(deal) {
      const now = new Date().toISOString().slice(0, 10)
      this.deals.push({
        ...deal,
        id: generateId(),
        createdAt: now,
        updatedAt: now
      })
    },
    updateDeal(deal) {
      const idx = this.deals.findIndex(d => d.id === deal.id)
      if (idx !== -1) {
        this.deals[idx] = {
          ...deal,
          updatedAt: new Date().toISOString().slice(0, 10)
        }
      }
    },
    moveDeal(dealId, newStage) {
      const deal = this.deals.find(d => d.id === dealId)
      if (deal) {
        deal.stage = newStage
        deal.updatedAt = new Date().toISOString().slice(0, 10)
      }
    },
    addClient(name) {
      if (!name.trim()) return
      if (this.clients.some(c => c.name.toLowerCase() === name.trim().toLowerCase())) return
      this.clients.push({ id: generateId(), name: name.trim() })
    }
  }
})
