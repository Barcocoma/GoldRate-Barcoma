# Gold Rate Philippines Calculator

A modern Vue.js + Vite application for calculating gold jewelry prices in the Philippines with live rates, multiple gold purities, and 12% VAT calculation.

## Features

- **Live Gold Rates**: Real-time Philippine gold rates (with fallback simulation)
- **Multiple Gold Purities**: Calculate for 24K, 22K, 21K, 18K, 14K, 10K, and 9K gold
- **Demo Account System**: User registration and login functionality
- **Complete Price Breakdown**: 
  - Gold Rate × Grams = Base Gold Price
  - Base Gold Price + Making Charge = Subtotal
  - Subtotal + 12% VAT = Final Price
- **Save Calculations**: Store your calculations for reference
- **Modern UI**: Beautiful, responsive design with gold-themed styling

## Formula

```
(Gold Rate per gram × Weight in grams) + Making Charge + 12% VAT = Final Price
```

### Example
- 24K Gold Rate: ₱9,400/gram (as of February 2026)
- Weight: 2 grams
- Making Charge: ₱3,000

Calculation:
1. Gold Value: ₱9,400 × 2 = ₱18,800
2. Subtotal: ₱18,800 + ₱3,000 = ₱21,800
3. VAT (12%): ₱21,800 × 0.12 = ₱2,616
4. **Total: ₱24,416**

## Installation

1. Clone or download this repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open http://localhost:3000 in your browser

## Build for Production

```bash
npm run build
```

## Tech Stack

- **Vue.js 3** - Progressive JavaScript Framework
- **Vite** - Next Generation Frontend Tooling
- **Vue Router** - Official Router for Vue.js
- **Pinia** - Vue.js State Management
- **Axios** - HTTP Client (for live rate fetching)

## Project Structure

```
gold-rate-philippines/
├── public/
│   └── gold-icon.svg
├── src/
│   ├── components/
│   │   └── Navbar.vue
│   ├── router/
│   │   └── index.js
│   ├── stores/
│   │   ├── auth.js
│   │   └── goldRate.js
│   ├── styles/
│   │   └── main.css
│   ├── views/
│   │   ├── Calculator.vue
│   │   ├── Home.vue
│   │   ├── Login.vue
│   │   ├── PurityCalculator.vue
│   │   └── Register.vue
│   ├── App.vue
│   └── main.js
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## Gold Purity Reference

| Karat | Purity | Description |
|-------|--------|-------------|
| 24K   | 99.9%  | Pure Gold - Investment Grade |
| 22K   | 91.6%  | Traditional Jewelry Gold |
| 21K   | 87.5%  | Middle Eastern Standard |
| 18K   | 75%    | Premium Jewelry Gold |
| 14K   | 58.5%  | Popular Western Standard |
| 10K   | 41.7%  | Affordable Jewelry Gold |
| 9K    | 37.5%  | Budget Jewelry Gold |

## Notes

- Gold rates are simulated with realistic Philippine market values when live API is unavailable
- Demo accounts are stored in localStorage (for demonstration purposes)
- The 12% VAT is based on Philippine tax regulations

## License

MIT License
