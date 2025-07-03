import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('../pages/LoginPage.vue'),
    },
    {
      path: '/',
      redirect: '/dashboard',
      component: () => import('../components/layout/AppLayout.vue'),
      children: [
        {
          path: '/dashboard',
          name: 'dashboard',
          component: () => import('../pages/DashboardPage.vue'),
        },
        {
          path: '/contacts',
          name: 'contacts',
          component: () => import('../pages/ContactsPage.vue'),
        },
        {
          path: '/deals',
          name: 'deals',
          component: () => import('../pages/DealsPage.vue'),
        },
        {
          path: '/activities',
          name: 'activities',
          component: () => import('../pages/ActivitiesPage.vue'),
        },
      ],
    },
  ],
})

export default router
