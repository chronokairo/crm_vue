import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// Lazy load components for better performance
const Login = () => import('@/pages/Login.vue')
const Dashboard = () => import('@/pages/Dashboard.vue')
const Contacts = () => import('@/pages/Contacts.vue')
const Deals = () => import('@/pages/Deals.vue')
const Activities = () => import('@/pages/Activities.vue')
const AppLayout = () => import('@/components/layout/AppLayout.vue')

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: {
      requiresAuth: false,
      title: 'Login'
    }
  },
  {
    path: '/',
    component: AppLayout,
    meta: {
      requiresAuth: true
    },
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: Dashboard,
        meta: {
          title: 'Dashboard'
        }
      },
      {
        path: '/contacts',
        name: 'Contacts',
        component: Contacts,
        meta: {
          title: 'Contacts'
        }
      },
      {
        path: '/deals',
        name: 'Deals',
        component: Deals,
        meta: {
          title: 'Deals'
        }
      },
      {
        path: '/activities',
        name: 'Activities',
        component: Activities,
        meta: {
          title: 'Activities'
        }
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

// Navigation guards
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  
  // Initialize auth if not already done
  if (!authStore.user && !authStore.token) {
    authStore.initializeAuth()
  }
  
  // Check if route requires authentication
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  
  if (requiresAuth && !authStore.isAuthenticated) {
    // Redirect to login if not authenticated
    next({
      name: 'Login',
      query: { redirect: to.fullPath }
    })
  } else if (to.name === 'Login' && authStore.isAuthenticated) {
    // Redirect to dashboard if already authenticated
    next({ name: 'Dashboard' })
  } else {
    // Set page title
    if (to.meta.title) {
      document.title = `${to.meta.title} - CRM Vue`
    }
    
    next()
  }
})

// Handle authentication errors
router.onError((error) => {
  console.error('Router error:', error)
  
  // If it's an authentication error, redirect to login
  if (error.message.includes('401') || error.message.includes('Unauthorized')) {
    const authStore = useAuthStore()
    authStore.logout()
    router.push('/login')
  }
})

export default router