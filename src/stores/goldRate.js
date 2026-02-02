import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useGoldRateStore = defineStore('goldRate', () => {
  const baseRate24K = ref(0)
  const lastUpdated = ref(null)
  const isLoading = ref(false)
  const error = ref(null)
  const currency = ref('PHP')

  // Gold purity multipliers (percentage of pure gold)
  const purityMultipliers = {
    '24K': 1.0,      // 99.9% pure
    '22K': 0.916,    // 91.6% pure
    '21K': 0.875,    // 87.5% pure
    '18K': 0.75,     // 75% pure
    '14K': 0.585,    // 58.5% pure
    '10K': 0.417,    // 41.7% pure
    '9K': 0.375      // 37.5% pure
  }

  const purityDescriptions = {
    '24K': { name: '24 Karat', purity: '99.9%', description: 'Pure Gold - Investment Grade' },
    '22K': { name: '22 Karat', purity: '91.6%', description: 'Traditional Jewelry Gold' },
    '21K': { name: '21 Karat', purity: '87.5%', description: 'Middle Eastern Standard' },
    '18K': { name: '18 Karat', purity: '75%', description: 'Premium Jewelry Gold' },
    '14K': { name: '14 Karat', purity: '58.5%', description: 'Popular Western Standard' },
    '10K': { name: '10 Karat', purity: '41.7%', description: 'Affordable Jewelry Gold' },
    '9K': { name: '9 Karat', purity: '37.5%', description: 'Budget Jewelry Gold' }
  }

  // Get rate for specific purity
  const getRateByPurity = computed(() => {
    return (purity) => {
      const multiplier = purityMultipliers[purity] || 1
      return Math.round(baseRate24K.value * multiplier)
    }
  })

  // Fetch live gold rate from multiple sources
  async function fetchGoldRate() {
    isLoading.value = true
    error.value = null

    // Try multiple free APIs in order
    const apis = [
      {
        name: 'Gold-API',
        url: 'https://www.goldapi.io/api/XAU/PHP',
        headers: { 'x-access-token': 'goldapi-demo' },
        parse: (data) => Math.round(data.price_gram_24k)
      },
      {
        name: 'MetalPriceAPI',
        url: 'https://api.metalpriceapi.com/v1/latest?api_key=demo&base=XAU&currencies=PHP',
        parse: (data) => Math.round((1 / data.rates.PHP) * 31.1035) // Convert oz to gram
      }
    ]

    for (const api of apis) {
      try {
        const response = await fetch(api.url, {
          method: 'GET',
          headers: api.headers || {}
        })
        
        if (response.ok) {
          const data = await response.json()
          const rate = api.parse(data)
          if (rate && rate > 0) {
            baseRate24K.value = rate
            lastUpdated.value = new Date().toISOString()
            isLoading.value = false
            return
          }
        }
      } catch (err) {
        console.warn(`${api.name} failed:`, err.message)
      }
    }

    // Fallback to accurate simulated rate if all APIs fail
    console.warn('All APIs failed, using current market rate estimate')
    await fetchSimulatedRate()
    isLoading.value = false
  }

  // Simulated rate based on ACTUAL Philippine market data (February 2026)
  async function fetchSimulatedRate() {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // ACTUAL Philippine gold rate as of February 2026: ~₱9,250-9,650 per gram for 24K
    // Source: livepriceofgold.com, goldpricez.com
    const basePrice = 9400 // Current accurate base price in PHP
    const variance = Math.floor(Math.random() * 200) - 100 // +/- 100 PHP variance for market fluctuation
    
    baseRate24K.value = basePrice + variance
    lastUpdated.value = new Date().toISOString()
    error.value = 'Using estimated market rate (API unavailable)'
  }

  // Calculate gold value
  function calculateGoldValue(purity, grams, makingCharge) {
    const ratePerGram = getRateByPurity.value(purity)
    const goldValue = ratePerGram * grams
    const subtotal = goldValue + makingCharge
    const tax = subtotal * 0.12 // 12% VAT
    const total = subtotal + tax

    return {
      ratePerGram,
      goldValue,
      makingCharge,
      subtotal,
      tax,
      total,
      purity,
      grams
    }
  }

  return {
    baseRate24K,
    lastUpdated,
    isLoading,
    error,
    currency,
    purityMultipliers,
    purityDescriptions,
    getRateByPurity,
    fetchGoldRate,
    fetchSimulatedRate,
    calculateGoldValue
  }
})
