<script setup>
import { useGoldRateStore } from '../stores/goldRate'
import { useAuthStore } from '../stores/auth'
import { computed } from 'vue'

const goldRateStore = useGoldRateStore()
const authStore = useAuthStore()

const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 0
  }).format(value)
}

const purities = computed(() => {
  return Object.entries(goldRateStore.purityDescriptions).map(([key, info]) => ({
    key,
    ...info,
    rate: goldRateStore.getRateByPurity(key)
  }))
})

const lastUpdatedFormatted = computed(() => {
  if (!goldRateStore.lastUpdated) return ''
  return new Date(goldRateStore.lastUpdated).toLocaleString('en-PH')
})
</script>

<template>
  <div class="calculator-page">
    <div class="page-header">
      <h1>Gold Calculator</h1>
      <p>Welcome, <strong>{{ authStore.user?.name }}</strong>! Select a gold purity to calculate jewelry prices.</p>
    </div>

    <div class="rates-info">
      <div class="rates-status">
        <span class="status-dot" :class="{ loading: goldRateStore.isLoading }"></span>
        <span v-if="goldRateStore.isLoading">Updating rates...</span>
        <span v-else>Live rates as of {{ lastUpdatedFormatted }}</span>
      </div>
      <button 
        @click="goldRateStore.fetchGoldRate()" 
        class="btn-refresh"
        :disabled="goldRateStore.isLoading"
      >
        Refresh Rates
      </button>
    </div>

    <div class="calculator-grid">
      <router-link
        v-for="purity in purities"
        :key="purity.key"
        :to="`/calculator/${purity.key}`"
        class="calculator-card"
        :class="{ premium: purity.key === '24K' }"
      >
        <div class="card-badge" v-if="purity.key === '24K'">Most Popular</div>
        
        <div class="card-header">
          <div class="purity-circle">
            <span class="purity-label">{{ purity.key }}</span>
          </div>
          <div class="purity-info">
            <h3>{{ purity.name }}</h3>
            <span class="purity-percent">{{ purity.purity }} Pure</span>
          </div>
        </div>

        <div class="card-rate">
          <span class="rate-label">Current Rate</span>
          <span class="rate-value">{{ formatCurrency(purity.rate) }}</span>
          <span class="rate-unit">per gram</span>
        </div>

        <div class="card-desc">
          {{ purity.description }}
        </div>

        <div class="card-action">
          <span>Open Calculator</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </div>
      </router-link>
    </div>

    <div class="calculator-note">
      <h3>How to Use</h3>
      <ol>
        <li>Click on any gold purity card above</li>
        <li>Enter the weight of your jewelry in grams</li>
        <li>Add the making/craftsmanship charge</li>
        <li>Get the total price including 12% VAT automatically</li>
      </ol>
    </div>
  </div>
</template>

<style scoped>
.calculator-page {
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  text-align: center;
  margin-bottom: 2rem;
}

.page-header h1 {
  font-size: 2.5rem;
  color: #1a1a2e;
  margin-bottom: 0.5rem;
}

.page-header p {
  color: #666;
  font-size: 1.1rem;
}

.rates-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  padding: 1rem 1.5rem;
  border-radius: 12px;
  margin-bottom: 2rem;
}

.rates-status {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: white;
}

.status-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #27ae60;
  animation: pulse 2s infinite;
}

.status-dot.loading {
  background: #f39c12;
  animation: blink 0.5s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.7; transform: scale(1.1); }
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

.btn-refresh {
  background: linear-gradient(135deg, #ffd700 0%, #ffb700 100%);
  color: #1a1a2e;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 50px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
}

.btn-refresh:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(255, 215, 0, 0.4);
}

.btn-refresh:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.calculator-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.calculator-card {
  background: white;
  border-radius: 20px;
  padding: 1.5rem;
  text-decoration: none;
  color: inherit;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s, box-shadow 0.3s;
  position: relative;
  overflow: hidden;
  border: 2px solid transparent;
}

.calculator-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  border-color: #ffd700;
}

.calculator-card.premium {
  background: linear-gradient(135deg, #fffef0 0%, #fff9e6 100%);
  border-color: #ffd700;
}

.card-badge {
  position: absolute;
  top: 1rem;
  right: -2rem;
  background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
  color: white;
  padding: 0.25rem 3rem;
  font-size: 0.75rem;
  font-weight: 600;
  transform: rotate(45deg);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.purity-circle {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ffd700 0%, #b8860b 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 15px rgba(184, 134, 11, 0.3);
}

.purity-label {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1a1a2e;
}

.purity-info h3 {
  color: #1a1a2e;
  font-size: 1.25rem;
  margin-bottom: 0.25rem;
}

.purity-percent {
  color: #888;
  font-size: 0.9rem;
}

.card-rate {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 12px;
  text-align: center;
  margin-bottom: 1rem;
}

.rate-label {
  display: block;
  color: #888;
  font-size: 0.8rem;
  margin-bottom: 0.25rem;
}

.rate-value {
  display: block;
  font-size: 1.75rem;
  font-weight: 700;
  color: #1a1a2e;
}

.rate-unit {
  color: #888;
  font-size: 0.9rem;
}

.card-desc {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
  line-height: 1.5;
}

.card-action {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  color: #ffd700;
  padding: 0.875rem;
  border-radius: 12px;
  font-weight: 600;
  transition: background 0.3s;
}

.calculator-card:hover .card-action {
  background: linear-gradient(135deg, #ffd700 0%, #ffb700 100%);
  color: #1a1a2e;
}

.calculator-note {
  background: #f8f9fa;
  padding: 2rem;
  border-radius: 16px;
}

.calculator-note h3 {
  color: #1a1a2e;
  margin-bottom: 1rem;
}

.calculator-note ol {
  color: #666;
  padding-left: 1.5rem;
}

.calculator-note li {
  margin-bottom: 0.5rem;
}

@media (max-width: 768px) {
  .page-header h1 {
    font-size: 1.75rem;
  }

  .rates-info {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .calculator-grid {
    grid-template-columns: 1fr;
  }
}
</style>
