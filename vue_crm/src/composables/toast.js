import { ref } from 'vue'

export const useToast = () => {
  const message = ref('')
  const type = ref('success')
  const visible = ref(false)
  let timeout = null

  function show(msg, t = 'success', duration = 2500) {
    message.value = msg
    type.value = t
    visible.value = true
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      visible.value = false
    }, duration)
  }

  return { message, type, visible, show }
}
