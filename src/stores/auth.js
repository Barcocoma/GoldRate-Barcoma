import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(JSON.parse(localStorage.getItem('goldCalcUser') || 'null'))
  const users = ref(JSON.parse(localStorage.getItem('goldCalcUsers') || '[]'))

  const isAuthenticated = computed(() => !!user.value)

  function register(userData) {
    const existingUser = users.value.find(u => u.email === userData.email)
    if (existingUser) {
      throw new Error('Email already registered')
    }

    const newUser = {
      id: Date.now(),
      name: userData.name,
      email: userData.email,
      password: userData.password,
      accountType: 'demo',
      createdAt: new Date().toISOString()
    }

    users.value.push(newUser)
    localStorage.setItem('goldCalcUsers', JSON.stringify(users.value))
    
    // Auto login after registration
    const { password, ...userWithoutPassword } = newUser
    user.value = userWithoutPassword
    localStorage.setItem('goldCalcUser', JSON.stringify(user.value))

    return userWithoutPassword
  }

  function login(email, password) {
    const foundUser = users.value.find(
      u => u.email === email && u.password === password
    )
    
    if (!foundUser) {
      throw new Error('Invalid email or password')
    }

    const { password: pwd, ...userWithoutPassword } = foundUser
    user.value = userWithoutPassword
    localStorage.setItem('goldCalcUser', JSON.stringify(user.value))

    return userWithoutPassword
  }

  function logout() {
    user.value = null
    localStorage.removeItem('goldCalcUser')
  }

  return {
    user,
    isAuthenticated,
    register,
    login,
    logout
  }
})
