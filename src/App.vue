<script setup>
import { useAuthStore } from './stores/auth'
import { useGoldRateStore } from './stores/goldRate'
import { onMounted } from 'vue'
import Navbar from './components/Navbar.vue'

const authStore = useAuthStore()
const goldRateStore = useGoldRateStore()

onMounted(() => {
  goldRateStore.fetchGoldRate()
})
</script>

<template>
  <div class="app">
    <Navbar />
    <main class="main-content">
      <router-view />
    </main>
    <footer class="footer">
      <p>&copy; 2024 Gold Rate Philippines Calculator. All rights reserved.</p>
      <p class="disclaimer">Disclaimer: Rates shown are for reference only. Please verify with your local jeweler.</p>
    </footer>
  </div>
</template>

<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
}

.footer {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  color: #a0a0a0;
  text-align: center;
  padding: 1.5rem;
  font-size: 0.875rem;
}

.footer .disclaimer {
  font-size: 0.75rem;
  margin-top: 0.5rem;
  opacity: 0.7;
}
</style>
