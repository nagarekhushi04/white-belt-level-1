## Stellar Pay – Simple Payment + Soroban Counter dApp

Send XLM and interact with an **on-chain counter** on **Stellar Testnet** (Freighter + xBull supported).
## vercel deployment 
https://vercel.com/khushinagare04-5573s-projects/white-belt-level-1
### Project description
Stellar Pay is a simple decentralized app for Stellar Testnet that lets you:

- Connect a wallet (Freighter / xBull)
- View your native XLM balance + fund via Friendbot
- Send XLM to another Stellar address
- Call a Soroban contract counter (`get_count`, `increment`, `reset`) and see events + tx status

### Screenshots
- Wallet connected:
  - `screenshots/wallet connected state and balance displayed.png.png`
- Successful transaction:
  - `screenshots/successful testnet transaction.png.png`
- Transaction result:
  - `screenshots/transaction result.png.png`

## Project structure
- `/src`: Main Stellar Pay dApp source code and core components.
- `/contract`: Soroban smart contract source code (Rust).
- `/crypto-portfolio`: A separate Ethereum-based portfolio tracker dApp using ethers.js.
- `/stellar-payment-dapp`: A specialized implementation of the Stellar payment flow.
- `/scripts`: Deployment and automation scripts for Soroban contracts.

## Component overview (Main App)
- **WalletCard.jsx**: Manages secure connection to Stellar wallets (Freighter, xBull) and handles XLM friendbot funding.
- **ContractCard.jsx**: The primary interface for the Soroban counter contract, supporting fetching state, incrementing, and resetting features.
- **SendForm.jsx**: A validated form for sending XLM with memo support and real-time fee status.
- **EventFeed.jsx**: A live listener component that displays real-time Soroban events as they occur on-chain.
- **TxStatusTracker.jsx**: Provides visual feedback for transaction lifecycles—pending, confirmed, or failed—with links to Stellar Expert.
- **ErrorToast.jsx**: A global notification system for user-friendly error reporting across the application.
- **Header.jsx**: Responsive navigation bar displaying network status and live wallet balance indicators.
- **StatusBanner.jsx**: Contextual banner for quick transaction success/failure results.


## Tech stack
- **Frontend**: React 18 + Vite 5
- **Styling**: Tailwind CSS
- **Stellar**: `@stellar/stellar-sdk` (Horizon + Soroban RPC)
- **Wallets**: `@stellar/freighter-api`, `@creit.tech/stellar-wallets-kit`, `@creit.tech/xbull-wallet-connect`
- **Tests**: Vitest + Testing Library

## Setup (local)
Install deps:

```bash
npm install
```

Windows note: if `npm install` fails due to a dependency calling `yarn`, use:

```bash
npm install --ignore-scripts
```

Create env file:
- Copy `.env.example` → `.env`
- Set `VITE_CONTRACT_ID` after deploying your contract

Run:

```bash
npm run dev
```

## Run tests

```bash
npm test
```

## Deploy Soroban contract (testnet, Windows)
You need a **funded testnet secret key**.

```powershell
$env:STELLAR_SECRET_KEY="S................................................"
.\scripts\deploy-testnet.ps1
```

This will deploy and write `.env` with `VITE_CONTRACT_ID=...`.

## Environment variables
See `.env.example`:
- `VITE_CONTRACT_ID`: Soroban contract ID on Testnet
- `VITE_RPC_URL`: Soroban RPC endpoint (default: testnet)
- `VITE_HORIZON_URL`: Horizon endpoint (default: testnet)
- `VITE_NETWORK_PASSPHRASE`: network passphrase (default: testnet)

## Known limitations / future improvements
- Add an in-app “RPC down” banner when Soroban RPC polling fails (currently silent).
- Add more component tests around wallet connect flows (requires mocking extensions).
