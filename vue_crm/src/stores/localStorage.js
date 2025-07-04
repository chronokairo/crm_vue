import { ref, watch } from 'vue'

const DEALS_KEY = 'crm_vue_deals'
const CLIENTS_KEY = 'crm_vue_clients'

export function useLocalStorageStore(store) {
  // Carregar do localStorage ao iniciar
  const deals = JSON.parse(localStorage.getItem(DEALS_KEY) || '[]')
  const clients = JSON.parse(localStorage.getItem(CLIENTS_KEY) || '[]')
  if (deals.length) store.deals = deals
  if (clients.length) store.clients = clients

  // Salvar sempre que mudar
  watch(() => store.deals, (val) => {
    localStorage.setItem(DEALS_KEY, JSON.stringify(val))
  }, { deep: true })
  watch(() => store.clients, (val) => {
    localStorage.setItem(CLIENTS_KEY, JSON.stringify(val))
  }, { deep: true })
}
