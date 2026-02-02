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
</script>

<template>
  <div class="home">
    <section class="hero">
      <div class="hero-content">
        <h1 class="hero-title">
          <span class="gold-text">Gold Rate</span> Philippines Calculator
        </h1>
        <p class="hero-subtitle">
          Calculate the exact value of your gold jewelry with live Philippine rates,
          making charges, and 12% VAT included.
        </p>
        <div class="hero-actions">
          <router-link 
            v-if="authStore.isAuthenticated" 
            to="/calculator" 
            class="btn-primary"
          >
            Open Calculator
          </router-link>
          <template v-else>
            <router-link to="/register" class="btn-primary">
              Create Free Demo Account
            </router-link>
            <router-link to="/login" class="btn-secondary">
              Login
            </router-link>
          </template>
        </div>
      </div>
      <div class="hero-visual">
        <div class="gold-bar">
          <div class="gold-bar-shine"></div>
          <span class="gold-bar-text">Au</span>
        </div>
      </div>
    </section>

    <section class="rates-section">
      <h2 class="section-title">Today's Gold Rates in Philippines</h2>
      <p class="section-subtitle">Live rates per gram for different gold purities</p>
      
      <div class="rates-grid">
        <div 
          v-for="purity in purities" 
          :key="purity.key" 
          class="rate-card"
          :class="{ premium: purity.key === '24K' }"
        >
          <div class="rate-header">
            <span class="purity-badge">{{ purity.key }}</span>
            <span class="purity-percent">{{ purity.purity }}</span>
          </div>
          <div class="rate-value">
            {{ formatCurrency(purity.rate) }}
            <span class="rate-unit">/gram</span>
          </div>
          <div class="rate-name">{{ purity.name }}</div>
          <div class="rate-desc">{{ purity.description }}</div>
        </div>
      </div>

      <div class="rates-updated" v-if="goldRateStore.lastUpdated">
        Last updated: {{ new Date(goldRateStore.lastUpdated).toLocaleString('en-PH') }}
        <button @click="goldRateStore.fetchGoldRate()" class="btn-refresh" :disabled="goldRateStore.isLoading">
          {{ goldRateStore.isLoading ? 'Updating...' : 'Refresh Rates' }}
        </button>
      </div>
    </section>

    <section class="features-section">
      <h2 class="section-title">How It Works</h2>
      <div class="features-grid">
        <div class="feature-card">
          <div class="feature-icon">1</div>
          <h3>Select Gold Purity</h3>
          <p>Choose from 24K, 22K, 21K, 18K, 14K, 10K, or 9K gold</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">2</div>
          <h3>Enter Weight in Grams</h3>
          <p>Input the total weight of your gold jewelry</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">3</div>
          <h3>Add Making Charges</h3>
          <p>Include the jeweler's craftsmanship fee</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">4</div>
          <h3>Get Total with 12% VAT</h3>
          <p>See the complete breakdown including tax</p>
        </div>
      </div>
    </section>

    <section class="formula-section">
      <h2 class="section-title">Calculation Formula</h2>
      <div class="formula-box">
        <div class="formula">
          <span class="formula-part">(Gold Rate × Grams)</span>
          <span class="formula-operator">+</span>
          <span class="formula-part">Making Charge</span>
          <span class="formula-operator">+</span>
          <span class="formula-part">12% VAT</span>
          <span class="formula-operator">=</span>
          <span class="formula-result">Final Price</span>
        </div>
        <div class="formula-example">
          <strong>Example:</strong> 24K Gold, 2 grams at ₱9,400/g + ₱3,000 making charge<br>
          (₱9,400 × 2) + ₱3,000 = ₱21,800 + 12% VAT (₱2,616) = <strong>₱24,416</strong>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home {
  padding-bottom: 2rem;
}

.hero {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
  padding: 4rem 0;
}

.hero-title {
  font-size: 3rem;
  font-weight: 700;
  color: #1a1a2e;
  line-height: 1.2;
  margin-bottom: 1.5rem;
}

.gold-text {
  background: linear-gradient(135deg, #ffd700 0%, #b8860b 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: 1.25rem;
  color: #666;
  line-height: 1.6;
  margin-bottom: 2rem;
}

.hero-actions {
  display: flex;
  gap: 1rem;
}

.btn-primary {
  background: linear-gradient(135deg, #ffd700 0%, #ffb700 100%);
  color: #1a1a2e;
  padding: 1rem 2rem;
  border-radius: 50px;
  text-decoration: none;
  font-weight: 600;
  font-size: 1.1rem;
  transition: transform 0.3s, box-shadow 0.3s;
  display: inline-block;
}

.btn-primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(255, 215, 0, 0.4);
}

.btn-secondary {
  background: transparent;
  border: 2px solid #1a1a2e;
  color: #1a1a2e;
  padding: 1rem 2rem;
  border-radius: 50px;
  text-decoration: none;
  font-weight: 600;
  font-size: 1.1rem;
  transition: all 0.3s;
}

.btn-secondary:hover {
  background: #1a1a2e;
  color: white;
}

.hero-visual {
  display: flex;
  justify-content: center;
  align-items: center;
}

.gold-bar {
  width: 200px;
  height: 120px;
  background: linear-gradient(145deg, #ffd700 0%, #daa520 50%, #b8860b 100%);
  border-radius: 8px;
  position: relative;
  box-shadow: 
    0 20px 60px rgba(184, 134, 11, 0.4),
    inset 0 2px 10px rgba(255, 255, 255, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.gold-bar-shine {
  position: absolute;
  top: 10px;
  left: 10px;
  right: 30%;
  height: 20px;
  background: linear-gradient(90deg, rgba(255,255,255,0.6), transparent);
  border-radius: 4px;
}

.gold-bar-text {
  font-size: 3rem;
  font-weight: 700;
  color: rgba(139, 69, 19, 0.6);
}

.rates-section {
  padding: 4rem 0;
}

.section-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1a1a2e;
  text-align: center;
  margin-bottom: 0.5rem;
}

.section-subtitle {
  text-align: center;
  color: #666;
  margin-bottom: 3rem;
}

.rates-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.rate-card {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s, box-shadow 0.3s;
  border: 2px solid transparent;
}

.rate-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

.rate-card.premium {
  border-color: #ffd700;
  background: linear-gradient(135deg, #fffef0 0%, #fff9e6 100%);
}

.rate-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.purity-badge {
  background: linear-gradient(135deg, #ffd700 0%, #b8860b 100%);
  color: #1a1a2e;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-weight: 700;
  font-size: 0.875rem;
}

.purity-percent {
  color: #888;
  font-size: 0.875rem;
}

.rate-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a1a2e;
  margin-bottom: 0.5rem;
}

.rate-unit {
  font-size: 0.875rem;
  font-weight: 400;
  color: #666;
}

.rate-name {
  font-weight: 600;
  color: #333;
  margin-bottom: 0.25rem;
}

.rate-desc {
  font-size: 0.8rem;
  color: #888;
}

.rates-updated {
  text-align: center;
  color: #888;
  font-size: 0.875rem;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
}

.btn-refresh {
  background: #1a1a2e;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: background 0.3s;
}

.btn-refresh:hover:not(:disabled) {
  background: #2d2d44;
}

.btn-refresh:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.features-section {
  padding: 4rem 0;
  background: #f8f9fa;
  margin: 0 -2rem;
  padding-left: 2rem;
  padding-right: 2rem;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 2rem;
}

.feature-card {
  text-align: center;
  padding: 2rem;
}

.feature-icon {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #ffd700 0%, #b8860b 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a1a2e;
}

.feature-card h3 {
  color: #1a1a2e;
  margin-bottom: 0.5rem;
}

.feature-card p {
  color: #666;
  font-size: 0.9rem;
}

.formula-section {
  padding: 4rem 0;
}

.formula-box {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  border-radius: 20px;
  padding: 3rem;
  text-align: center;
}

.formula {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.formula-part {
  background: rgba(255, 215, 0, 0.2);
  color: #ffd700;
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  font-weight: 600;
}

.formula-operator {
  color: white;
  font-size: 1.5rem;
  font-weight: 300;
}

.formula-result {
  background: linear-gradient(135deg, #ffd700 0%, #b8860b 100%);
  color: #1a1a2e;
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  font-weight: 700;
}

.formula-example {
  color: #a0a0a0;
  line-height: 1.8;
}

.formula-example strong {
  color: #ffd700;
}

@media (max-width: 768px) {
  .hero {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .hero-title {
    font-size: 2rem;
  }

  .hero-actions {
    justify-content: center;
    flex-wrap: wrap;
  }

  .hero-visual {
    order: -1;
  }

  .formula {
    flex-direction: column;
  }
}
</style>
