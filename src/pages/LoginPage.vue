<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to CRM Pro
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Welcome back! Please sign in to your account.
        </p>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <div class="space-y-4">
          <BaseInput
            id="email"
            v-model="form.email"
            label="Email address"
            type="email"
            required
            placeholder="Enter your email"
            :error="errors.email"
          />
          <BaseInput
            id="password"
            v-model="form.password"
            label="Password"
            type="password"
            required
            placeholder="Enter your password"
            :error="errors.password"
          />
        </div>

        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            >
            <label for="remember-me" class="ml-2 block text-sm text-gray-900">
              Remember me
            </label>
          </div>
        </div>

        <div>
          <BaseButton
            type="submit"
            class="w-full"
            :disabled="loading"
          >
            <span v-if="loading">Signing in...</span>
            <span v-else>Sign in</span>
          </BaseButton>
        </div>

        <div v-if="loginError" class="text-center text-sm text-red-600">
          {{ loginError }}
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import BaseInput from '../components/base/BaseInput.vue'
import BaseButton from '../components/base/BaseButton.vue'

const router = useRouter()

const form = reactive({
  email: '',
  password: ''
})

const errors = reactive({
  email: '',
  password: ''
})

const loading = ref(false)
const loginError = ref('')

const validateForm = () => {
  let isValid = true
  
  // Reset errors
  errors.email = ''
  errors.password = ''
  loginError.value = ''

  if (!form.email) {
    errors.email = 'Email is required'
    isValid = false
  } else if (!/\S+@\S+\.\S+/.test(form.email)) {
    errors.email = 'Please enter a valid email'
    isValid = false
  }

  if (!form.password) {
    errors.password = 'Password is required'
    isValid = false
  } else if (form.password.length < 6) {
    errors.password = 'Password must be at least 6 characters'
    isValid = false
  }

  return isValid
}

const handleLogin = async () => {
  if (!validateForm()) return

  loading.value = true

  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // For demo purposes, accept any valid email/password
    if (form.email && form.password.length >= 6) {
      // Store auth token (mock)
      localStorage.setItem('authToken', 'mock-jwt-token')
      router.push('/dashboard')
    } else {
      loginError.value = 'Invalid credentials'
    }
  } catch (error) {
    loginError.value = 'An error occurred. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>