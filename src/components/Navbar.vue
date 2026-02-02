<script setup>
import { useAuthStore } from '../stores/auth'
import { useGoldRateStore } from '../stores/goldRate'
import { useRouter, useRoute } from 'vue-router'
import { computed } from 'vue'

const authStore = useAuthStore()
const goldRateStore = useGoldRateStore()
const router = useRouter()
const route = useRoute()

// Get current purity from route, default to 24K
const currentPurity = computed(() => {
  return route.params.purity || '24K'
})

// Get rate for current purity
const currentRate = computed(() => {
  return goldRateStore.getRateByPurity(currentPurity.value)
})

const formattedRate = computed(() => {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 0
  }).format(currentRate.value)
})

function handleLogout() {
  authStore.logout()
  router.push('/')
}
</script>

<template>
  <nav class="navbar">
    <div class="navbar-container">
      <router-link to="/" class="logo">
        <img src="/gold-icon.svg" alt="Gold" class="logo-icon" />
        <span class="logo-text">GoldCalc<span class="logo-ph">PH</span></span>
      </router-link>

      <div class="live-rate" v-if="goldRateStore.baseRate24K">
        <span class="rate-label">{{ currentPurity }} Rate:</span>
        <span class="rate-value">{{ formattedRate }}/g</span>
        <span 
          class="rate-badge" 
          :class="{ 
            loading: goldRateStore.isLoading,
            estimated: goldRateStore.error
          }"
          :title="goldRateStore.error || 'Live market rate'"
        >
          {{ goldRateStore.isLoading ? 'Updating...' : (goldRateStore.error ? 'ESTIMATED' : 'LIVE') }}
        </span>
      </div>

      <div class="nav-links">
        <template v-if="authStore.isAuthenticated">
          <router-link to="/calculator" class="nav-link">Calculator</router-link>
          <div class="user-menu">
            <span class="user-name">{{ authStore.user?.name }}</span>
            <span class="account-badge">DEMO</span>
            <button @click="handleLogout" class="btn-logout">Logout</button>
          </div>
        </template>
        <template v-else>
          <router-link to="/login" class="nav-link">Login</router-link>
          <router-link to="/register" class="btn-register">Register Free</router-link>
        </template>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  padding: 1rem 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  position: sticky;
  top: 0;
  z-index: 100;
}

.navbar-container {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
}

.logo-icon {
  width: 40px;
  height: 40px;
}

.logo-text {
  font-size: 1.5rem;
  font-weight: 700;
  color: #ffd700;
}

.logo-ph {
  color: #fff;
  font-weight: 400;
}

.live-rate {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: rgba(255, 215, 0, 0.1);
  padding: 0.5rem 1rem;
  border-radius: 50px;
  border: 1px solid rgba(255, 215, 0, 0.3);
}

.rate-label {
  color: #a0a0a0;
  font-size: 0.875rem;
}

.rate-value {
  color: #ffd700;
  font-weight: 600;
  font-size: 1rem;
}

.rate-badge {
  background: #27ae60;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: 600;
  animation: pulse 2s infinite;
}

.rate-badge.loading {
  background: #f39c12;
  animation: none;
}

.rate-badge.estimated {
  background: #3498db;
  animation: none;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.nav-link {
  color: #fff;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s;
}

.nav-link:hover {
  color: #ffd700;
}

.btn-register {
  background: linear-gradient(135deg, #ffd700 0%, #ffb700 100%);
  color: #1a1a2e;
  padding: 0.75rem 1.5rem;
  border-radius: 50px;
  text-decoration: none;
  font-weight: 600;
  transition: transform 0.3s, box-shadow 0.3s;
}

.btn-register:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(255, 215, 0, 0.4);
}

.user-menu {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-name {
  color: #fff;
  font-weight: 500;
}

.account-badge {
  background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: 600;
}

.btn-logout {
  background: transparent;
  border: 1px solid #e74c3c;
  color: #e74c3c;
  padding: 0.5rem 1rem;
  border-radius: 50px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s;
}

.btn-logout:hover {
  background: #e74c3c;
  color: white;
}

@media (max-width: 768px) {
  .navbar-container {
    flex-wrap: wrap;
    gap: 1rem;
  }

  .live-rate {
    order: 3;
    width: 100%;
    justify-content: center;
  }
}
</style>
