# DefiTrack - Web3 Crypto Portfolio Tracker

A complete end-to-end Crypto Portfolio Tracker dApp built with React, Vite, and Web3 tools.

## Core Features
1. **Wallet Connection**: Connects to MetaMask or falls back to a realistic Mock/Demo account.
2. **Live Prices**: Fetches live USD prices for assets from the CoinGecko free API.
3. **Caching**: Uses in-memory and `localStorage` caching with a 60-second TTL to avoid API rate limits, displaying a "Cached" badge on the UI when active.
4. **Portfolio Value**: Calculates and displays total USD value of holdings.
5. **Visual Breakdown**: Features a Recharts pie chart to visualize asset allocation.
6. **Custom Tokens**: Users can add/remove custom ERC20 contract addresses.

## Architecture

```mermaid
graph TD
    App[App.jsx (Main Layout)] --> ErrorBoundary[ErrorBoundary]
    App --> usePortfolioHook((usePortfolio))
    
    usePortfolioHook --> useWalletHook((useWallet))
    usePortfolioHook --> usePricesHook((usePrices))
    
    useWalletHook --> Ethers[Ethers.js / MetaMask]
    usePricesHook --> CoinGecko[CoinGecko API]
    usePricesHook --> Cache[(Local Storage Cache)]
    
    ErrorBoundary --> TokenList[TokenList UI]
    ErrorBoundary --> PortfolioChart[PortfolioChart UI]
    
    TokenList --> AddTokenForm[AddTokenForm]
```

## Setup Instructions

1. **Prerequisites**: Node.js v18+ and MetaMask extension installed in your browser.
2. **Installation**:
   ```bash
   npm install
   ```
3. **Run the Development Server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

## Testing

The project uses `vitest` and `React Testing Library`. The test suite covers:
- Portfolio calculations
- API fetching with mocked fetch
- Cache logic with mocked timers
- Component rendering (WalletConnect, TokenList)

**Run tests once:**
```bash
npm test
```

**Run in watch mode:**
```bash
npm run test:watch
```

## Known Limitations
1. **CoinGecko Rate Limit**: The free CoinGecko API is heavily rate-limited. If you refresh too often or add too many custom tokens quickly, prices may fall back to mocked demo strings. The 60-second caching helps mitigate this.
2. **Custom Network Support**: The app assumes the Ethereum Mainnet context for custom token addresses in MetaMask. Using testnets may result in 0 balances if tokens aren't deployed there.
3. **BigInt to Number**: For simplicity, `ethers.js` BigInt balances are parsed to JS numbers. This is fine for demo purposes but can lose precision for massive token amounts (> 9 quadrillion).
