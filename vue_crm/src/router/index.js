import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../features/dashboard/dashboard.vue'
import Contatos from '../features/contatos/contatos.vue'
import Negocios from '../features/deals/deals.vue'
import Atividades from '../features/activities/activities.vue'
import Relatorios from '../features/reports/reports.vue'

const routes = [
  { path: '/', redirect: '/dashboard' },
  { path: '/dashboard', component: Dashboard },
  { path: '/contatos', component: Contatos },
  { path: '/negocios', component: Negocios },
  { path: '/atividades', component: Atividades },
  { path: '/relatorios', component: Relatorios },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router


