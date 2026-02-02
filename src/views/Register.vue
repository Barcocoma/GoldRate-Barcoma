<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const error = ref('')
const isLoading = ref(false)

async function handleRegister() {
  error.value = ''

  if (password.value !== confirmPassword.value) {
    error.value = 'Passwords do not match'
    return
  }

  if (password.value.length < 6) {
    error.value = 'Password must be at least 6 characters'
    return
  }

  isLoading.value = true

  try {
    await authStore.register({
      name: name.value,
      email: email.value,
      password: password.value
    })
    router.push('/calculator')
  } catch (err) {
    error.value = err.message
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="register-page">
    <div class="register-container">
      <div class="register-header">
        <div class="register-icon">
          <img src="/gold-icon.svg" alt="Gold" />
        </div>
        <h1>Create Demo Account</h1>
        <p>Start calculating gold prices for free</p>
        <div class="demo-badge">
          <span>FREE DEMO</span>
          No credit card required
        </div>
      </div>

      <form @submit.prevent="handleRegister" class="register-form">
        <div class="form-group">
          <label for="name">Full Name</label>
          <input
            id="name"
            type="text"
            v-model="name"
            placeholder="Enter your full name"
            required
          />
        </div>

        <div class="form-group">
          <label for="email">Email Address</label>
          <input
            id="email"
            type="email"
            v-model="email"
            placeholder="Enter your email"
            required
          />
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input
            id="password"
            type="password"
            v-model="password"
            placeholder="Create a password (min 6 characters)"
            required
          />
        </div>

        <div class="form-group">
          <label for="confirmPassword">Confirm Password</label>
          <input
            id="confirmPassword"
            type="password"
            v-model="confirmPassword"
            placeholder="Confirm your password"
            required
          />
        </div>

        <div v-if="error" class="error-message">
          {{ error }}
        </div>

        <button type="submit" class="btn-register" :disabled="isLoading">
          {{ isLoading ? 'Creating Account...' : 'Create Free Account' }}
        </button>
      </form>

      <div class="register-footer">
        <p>Already have an account? <router-link to="/login">Login</router-link></p>
      </div>

      <div class="features-list">
        <h3>What you get:</h3>
        <ul>
          <li>Live Philippine gold rates</li>
          <li>All gold purity calculators (24K - 9K)</li>
          <li>Making charge & 12% VAT calculation</li>
          <li>Save your calculations</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
.register-page {
  min-height: calc(100vh - 200px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.register-container {
  width: 100%;
  max-width: 480px;
  background: white;
  border-radius: 24px;
  padding: 3rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
}

.register-header {
  text-align: center;
  margin-bottom: 2rem;
}

.register-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 1.5rem;
}

.register-icon img {
  width: 100%;
  height: 100%;
}

.register-header h1 {
  font-size: 1.75rem;
  color: #1a1a2e;
  margin-bottom: 0.5rem;
}

.register-header p {
  color: #666;
}

.demo-badge {
  background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
  color: #2e7d32;
  padding: 1rem;
  border-radius: 12px;
  margin-top: 1rem;
  font-size: 0.9rem;
}

.demo-badge span {
  display: block;
  font-weight: 700;
  font-size: 1rem;
  margin-bottom: 0.25rem;
}

.register-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 500;
  color: #333;
  font-size: 0.9rem;
}

.form-group input {
  padding: 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  font-size: 1rem;
  transition: border-color 0.3s, box-shadow 0.3s;
}

.form-group input:focus {
  outline: none;
  border-color: #ffd700;
  box-shadow: 0 0 0 4px rgba(255, 215, 0, 0.1);
}

.error-message {
  background: #fee2e2;
  color: #dc2626;
  padding: 1rem;
  border-radius: 12px;
  font-size: 0.9rem;
  text-align: center;
}

.btn-register {
  background: linear-gradient(135deg, #ffd700 0%, #ffb700 100%);
  color: #1a1a2e;
  padding: 1rem;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
}

.btn-register:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 215, 0, 0.4);
}

.btn-register:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.register-footer {
  text-align: center;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e0e0e0;
  color: #666;
}

.register-footer a {
  color: #b8860b;
  font-weight: 600;
  text-decoration: none;
}

.register-footer a:hover {
  text-decoration: underline;
}

.features-list {
  margin-top: 2rem;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 12px;
}

.features-list h3 {
  color: #1a1a2e;
  font-size: 1rem;
  margin-bottom: 1rem;
}

.features-list ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.features-list li {
  color: #666;
  padding: 0.5rem 0;
  padding-left: 1.5rem;
  position: relative;
  font-size: 0.9rem;
}

.features-list li::before {
  content: "✓";
  position: absolute;
  left: 0;
  color: #27ae60;
  font-weight: 700;
}
</style>
