<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useGoldRateStore } from '../stores/goldRate'

const route = useRoute()
const router = useRouter()
const goldRateStore = useGoldRateStore()

const purity = computed(() => route.params.purity)
const purityInfo = computed(() => goldRateStore.purityDescriptions[purity.value])
const ratePerGram = computed(() => goldRateStore.getRateByPurity(purity.value))

// Form inputs
const grams = ref(1)
const makingCharge = ref(0)

// Calculation results
const calculation = computed(() => {
  return goldRateStore.calculateGoldValue(purity.value, grams.value, makingCharge.value)
})

// Saved calculations
const savedCalculations = ref([])

const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 0
  }).format(value)
}

function saveCalculation() {
  const calc = {
    id: Date.now(),
    purity: purity.value,
    grams: grams.value,
    makingCharge: makingCharge.value,
    ratePerGram: ratePerGram.value,
    total: calculation.value.total,
    date: new Date().toLocaleString('en-PH')
  }
  
  savedCalculations.value.unshift(calc)
  
  // Keep only last 10 calculations
  if (savedCalculations.value.length > 10) {
    savedCalculations.value.pop()
  }
  
  localStorage.setItem(`goldCalcs_${purity.value}`, JSON.stringify(savedCalculations.value))
}

function clearSaved() {
  savedCalculations.value = []
  localStorage.removeItem(`goldCalcs_${purity.value}`)
}

function loadSavedCalculations() {
  const saved = localStorage.getItem(`goldCalcs_${purity.value}`)
  if (saved) {
    savedCalculations.value = JSON.parse(saved)
  }
}

// Watch for purity changes
watch(purity, () => {
  loadSavedCalculations()
}, { immediate: true })

// Validate purity on mount
onMounted(() => {
  if (!purityInfo.value) {
    router.push('/calculator')
  }
})
</script>

<template>
  <div class="purity-calculator" v-if="purityInfo">
    <div class="calc-header">
      <router-link to="/calculator" class="back-link">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
        Back to All Calculators
      </router-link>
      
      <div class="purity-badge-large">
        <span class="purity-karat">{{ purity }}</span>
        <span class="purity-name">{{ purityInfo.name }}</span>
        <span class="purity-percent">{{ purityInfo.purity }} Pure Gold</span>
      </div>
    </div>

    <div class="calc-container">
      <div class="calc-main">
        <div class="calc-section rate-display">
          <h3>Current {{ purity }} Gold Rate</h3>
          <div class="current-rate">
            <span class="rate-value">{{ formatCurrency(ratePerGram) }}</span>
            <span class="rate-unit">per gram</span>
          </div>
          <div class="rate-update">
            <span class="live-indicator"></span>
            Live Philippine Rate
            <button @click="goldRateStore.fetchGoldRate()" class="btn-mini-refresh">
              Refresh
            </button>
          </div>
        </div>

        <div class="calc-section input-section">
          <h3>Calculate Your Gold Jewelry</h3>
          
          <div class="input-group">
            <label for="grams">
              <span class="label-text">Weight in Grams</span>
              <span class="label-hint">Enter the total weight of your gold jewelry</span>
            </label>
            <div class="input-wrapper">
              <input
                id="grams"
                type="number"
                v-model.number="grams"
                min="0.01"
                step="0.01"
                placeholder="0.00"
              />
              <span class="input-suffix">grams</span>
            </div>
          </div>

          <div class="input-group">
            <label for="makingCharge">
              <span class="label-text">Making Charge</span>
              <span class="label-hint">Jeweler's craftsmanship fee (optional)</span>
            </label>
            <div class="input-wrapper">
              <span class="input-prefix">₱</span>
              <input
                id="makingCharge"
                type="number"
                v-model.number="makingCharge"
                min="0"
                step="100"
                placeholder="0"
              />
            </div>
          </div>
        </div>

        <div class="calc-section result-section">
          <h3>Price Breakdown</h3>
          
          <div class="result-row">
            <span class="result-label">Gold Value</span>
            <span class="result-formula">{{ formatCurrency(ratePerGram) }} × {{ grams }}g</span>
            <span class="result-value">{{ formatCurrency(calculation.goldValue) }}</span>
          </div>

          <div class="result-row">
            <span class="result-label">Making Charge</span>
            <span class="result-formula">Craftsmanship</span>
            <span class="result-value">{{ formatCurrency(calculation.makingCharge) }}</span>
          </div>

          <div class="result-row subtotal">
            <span class="result-label">Subtotal</span>
            <span class="result-formula">Before Tax</span>
            <span class="result-value">{{ formatCurrency(calculation.subtotal) }}</span>
          </div>

          <div class="result-row tax">
            <span class="result-label">VAT (12%)</span>
            <span class="result-formula">Tax</span>
            <span class="result-value">{{ formatCurrency(calculation.tax) }}</span>
          </div>

          <div class="result-row total">
            <span class="result-label">TOTAL PRICE</span>
            <span class="result-formula">Final Amount</span>
            <span class="result-value">{{ formatCurrency(calculation.total) }}</span>
          </div>

          <button @click="saveCalculation" class="btn-save">
            Save This Calculation
          </button>
        </div>
      </div>

      <div class="calc-sidebar">
        <div class="saved-section">
          <div class="saved-header">
            <h3>Saved Calculations</h3>
            <button v-if="savedCalculations.length" @click="clearSaved" class="btn-clear">
              Clear All
            </button>
          </div>

          <div v-if="savedCalculations.length" class="saved-list">
            <div v-for="calc in savedCalculations" :key="calc.id" class="saved-item">
              <div class="saved-info">
                <span class="saved-grams">{{ calc.grams }}g</span>
                <span class="saved-making">+ {{ formatCurrency(calc.makingCharge) }} making</span>
              </div>
              <div class="saved-total">{{ formatCurrency(calc.total) }}</div>
              <div class="saved-date">{{ calc.date }}</div>
            </div>
          </div>

          <div v-else class="saved-empty">
            <p>No saved calculations yet.</p>
            <p>Click "Save This Calculation" to save your results.</p>
          </div>
        </div>

        <div class="tips-section">
          <h3>Tips</h3>
          <ul>
            <li><strong>{{ purity }}</strong> gold contains {{ purityInfo.purity }} pure gold</li>
            <li>Making charges vary by jeweler and design complexity</li>
            <li>12% VAT is standard for jewelry in the Philippines</li>
            <li>Always verify rates with your local jeweler</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.purity-calculator {
  max-width: 1200px;
  margin: 0 auto;
}

.calc-header {
  margin-bottom: 2rem;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: #666;
  text-decoration: none;
  font-weight: 500;
  margin-bottom: 1.5rem;
  transition: color 0.3s;
}

.back-link:hover {
  color: #1a1a2e;
}

.purity-badge-large {
  background: linear-gradient(135deg, #ffd700 0%, #b8860b 100%);
  padding: 2rem;
  border-radius: 20px;
  text-align: center;
  color: #1a1a2e;
  box-shadow: 0 8px 30px rgba(184, 134, 11, 0.3);
}

.purity-karat {
  display: block;
  font-size: 3rem;
  font-weight: 700;
  line-height: 1;
  margin-bottom: 0.5rem;
}

.purity-name {
  display: block;
  font-size: 1.5rem;
  font-weight: 500;
  margin-bottom: 0.25rem;
}

.purity-percent {
  font-size: 1rem;
  opacity: 0.8;
}

.calc-container {
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 2rem;
}

.calc-main {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.calc-section {
  background: white;
  border-radius: 20px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.calc-section h3 {
  color: #1a1a2e;
  font-size: 1.1rem;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid #f0f0f0;
}

.rate-display {
  text-align: center;
}

.current-rate {
  margin: 1.5rem 0;
}

.current-rate .rate-value {
  display: block;
  font-size: 2.5rem;
  font-weight: 700;
  color: #1a1a2e;
}

.current-rate .rate-unit {
  color: #888;
}

.rate-update {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: #666;
  font-size: 0.9rem;
}

.live-indicator {
  width: 8px;
  height: 8px;
  background: #27ae60;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.7; transform: scale(1.1); }
}

.btn-mini-refresh {
  background: #f0f0f0;
  border: none;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: background 0.3s;
}

.btn-mini-refresh:hover {
  background: #e0e0e0;
}

.input-group {
  margin-bottom: 1.5rem;
}

.input-group label {
  display: block;
  margin-bottom: 0.5rem;
}

.label-text {
  display: block;
  font-weight: 600;
  color: #1a1a2e;
  margin-bottom: 0.25rem;
}

.label-hint {
  display: block;
  font-size: 0.85rem;
  color: #888;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-wrapper input {
  width: 100%;
  padding: 1rem;
  padding-right: 4rem;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  font-size: 1.25rem;
  font-weight: 600;
  transition: border-color 0.3s, box-shadow 0.3s;
}

.input-wrapper input:focus {
  outline: none;
  border-color: #ffd700;
  box-shadow: 0 0 0 4px rgba(255, 215, 0, 0.1);
}

.input-prefix {
  position: absolute;
  left: 1rem;
  color: #888;
  font-size: 1.25rem;
  font-weight: 600;
}

.input-prefix + input {
  padding-left: 2.5rem;
}

.input-suffix {
  position: absolute;
  right: 1rem;
  color: #888;
}

.result-row {
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: 1rem;
  padding: 0.75rem 0;
  border-bottom: 1px solid #f0f0f0;
  align-items: center;
}

.result-label {
  font-weight: 500;
  color: #333;
}

.result-formula {
  color: #888;
  font-size: 0.85rem;
}

.result-value {
  font-weight: 600;
  color: #1a1a2e;
  text-align: right;
}

.result-row.subtotal {
  background: #f8f9fa;
  margin: 0 -1.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
}

.result-row.tax {
  color: #888;
}

.result-row.total {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  margin: 0.5rem -1.5rem -1.5rem;
  padding: 1.25rem 1.5rem;
  border-radius: 0 0 20px 20px;
  border: none;
}

.result-row.total .result-label,
.result-row.total .result-formula,
.result-row.total .result-value {
  color: white;
}

.result-row.total .result-value {
  font-size: 1.5rem;
  color: #ffd700;
}

.btn-save {
  width: 100%;
  background: linear-gradient(135deg, #ffd700 0%, #ffb700 100%);
  color: #1a1a2e;
  border: none;
  padding: 1rem;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 1.5rem;
  transition: transform 0.3s, box-shadow 0.3s;
}

.btn-save:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 215, 0, 0.4);
}

.calc-sidebar {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.saved-section {
  background: white;
  border-radius: 20px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.saved-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.saved-header h3 {
  color: #1a1a2e;
  font-size: 1rem;
  margin: 0;
}

.btn-clear {
  background: none;
  border: none;
  color: #e74c3c;
  font-size: 0.85rem;
  cursor: pointer;
}

.btn-clear:hover {
  text-decoration: underline;
}

.saved-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-height: 400px;
  overflow-y: auto;
}

.saved-item {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 12px;
}

.saved-info {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.saved-grams {
  background: linear-gradient(135deg, #ffd700 0%, #b8860b 100%);
  color: #1a1a2e;
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.8rem;
}

.saved-making {
  color: #888;
  font-size: 0.85rem;
}

.saved-total {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1a1a2e;
}

.saved-date {
  font-size: 0.75rem;
  color: #888;
  margin-top: 0.25rem;
}

.saved-empty {
  text-align: center;
  color: #888;
  padding: 2rem 0;
}

.saved-empty p {
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.tips-section {
  background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
  border-radius: 20px;
  padding: 1.5rem;
}

.tips-section h3 {
  color: #2e7d32;
  font-size: 1rem;
  margin-bottom: 1rem;
}

.tips-section ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.tips-section li {
  color: #333;
  font-size: 0.9rem;
  margin-bottom: 0.75rem;
  padding-left: 1.5rem;
  position: relative;
}

.tips-section li::before {
  content: "•";
  position: absolute;
  left: 0;
  color: #27ae60;
  font-weight: 700;
}

@media (max-width: 900px) {
  .calc-container {
    grid-template-columns: 1fr;
  }

  .calc-sidebar {
    order: -1;
  }
}

@media (max-width: 600px) {
  .purity-karat {
    font-size: 2rem;
  }

  .current-rate .rate-value {
    font-size: 1.75rem;
  }

  .result-row {
    grid-template-columns: 1fr auto;
  }

  .result-formula {
    display: none;
  }
}
</style>
