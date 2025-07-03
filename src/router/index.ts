import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// Lazy load components
const Login = () => import('@/views/auth/Login.vue')
const Dashboard = () => import('@/views/Dashboard.vue')
const Contacts = () => import('@/views/contacts/Contacts.vue')
const ContactDetail = () => import('@/views/contacts/ContactDetail.vue')
const Deals = () => import('@/views/deals/Deals.vue')
const DealDetail = () => import('@/views/deals/DealDetail.vue')
const Activities = () => import('@/views/activities/Activities.vue')
const ActivityDetail = () => import('@/views/activities/ActivityDetail.vue')
const Settings = () => import('@/views/Settings.vue')

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: {
      requiresAuth: false,
      layout: 'auth'
    }
  },
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard,
    meta: {
      requiresAuth: true,
      title: 'Dashboard'
    }
  },
  {
    path: '/contacts',
    name: 'Contacts',
    component: Contacts,
    meta: {
      requiresAuth: true,
      title: 'Contacts'
    }
  },
  {
    path: '/contacts/:id',
    name: 'ContactDetail',
    component: ContactDetail,
    meta: {
      requiresAuth: true,
      title: 'Contact Details'
    }
  },
  {
    path: '/deals',
    name: 'Deals',
    component: Deals,
    meta: {
      requiresAuth: true,
      title: 'Deals'
    }
  },
  {
    path: '/deals/:id',
    name: 'DealDetail',
    component: DealDetail,
    meta: {
      requiresAuth: true,
      title: 'Deal Details'
    }
  },
  {
    path: '/activities',
    name: 'Activities',
    component: Activities,
    meta: {
      requiresAuth: true,
      title: 'Activities'
    }
  },
  {
    path: '/activities/:id',
    name: 'ActivityDetail',
    component: ActivityDetail,
    meta: {
      requiresAuth: true,
      title: 'Activity Details'
    }
  },
  {
    path: '/settings',
    name: 'Settings',
    component: Settings,
    meta: {
      requiresAuth: true,
      title: 'Settings'
    }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// Navigation guards
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  
  // Check if route requires authentication
  if (to.meta.requiresAuth) {
    if (!authStore.isAuthenticated) {
      // Try to initialize auth from stored token
      try {
        await authStore.initialize()
        if (!authStore.isAuthenticated) {
          return next('/login')
        }
      } catch {
        return next('/login')
      }
    }
  }
  
  // Redirect to dashboard if already logged in and trying to access login
  if (to.name === 'Login' && authStore.isAuthenticated) {
    return next('/')
  }
  
  // Set page title
  if (to.meta.title) {
    document.title = `${to.meta.title} - CRM`
  } else {
    document.title = 'CRM'
  }
  
  next()
})

export default router
