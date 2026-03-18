# 🌟 Stellar Pay – Simple Payment & Counter dApp

[![Network: Stellar Testnet](https://img.shields.io/badge/Network-Stellar%20Testnet-blue.svg)](https://stellar.expert/explorer/testnet)
[![Tech Stack: React + Vite](https://img.shields.io/badge/Stack-React%20%2B%20Vite-61DAFB.svg)](https://vitejs.dev/)
[![Styling: Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20CSS-38B2AC.svg)](https://tailwindcss.com/)
[![Deployment: Vercel](https://img.shields.io/badge/Deployment-Vercel-black.svg)](https://white-belt-level-1-khushinagare04-5573s-projects.vercel.app/)

**Stellar Pay** is a high-performance, decentralized payment application built for the **Stellar Testnet**. It provides a sleek, modern interface for managing testnet funds and interacting with on-chain Soroban smart contracts.

---

### 🌐 Vercel Deployment 
[View Live Site](https://white-belt-level-1-khushinagare04-5573s-projects.vercel.app/)


---

## 🖼️ App Screenshot

![Stellar Pay dApp](./screenshots/dapp_main_screenshot.png)
*Modern, dark-themed UI with real-time balance tracking and contract interaction.*

---

## 🔗 Deployed Smart Contract

**Soroban Counter Contract:**
[`CDJJ5BYJHWZBXRRX5M2XAEX5GMINIR3FDEAL4H7KRUZJXTXL44KCS2ZY`](https://stellar.expert/explorer/testnet/contract/CDJJ5BYJHWZBXRRX5M2XAEX5GMINIR3FDEAL4H7KRUZJXTXL44KCS2ZY)

---

## 🚀 Key Features

- **Multi-Wallet Support** – Connect seamlessly with **Freighter**, **xBull (Extension)**, or **xBull (Web)**.
- **Instant Faucet** – One-click funding via **Friendbot** (10,000 test XLM).
- **Smooth Payments** – Send XLM to any Stellar address with real-time validation and fee calculation.
- **On-Chain Counter** – Interact with a Soroban smart contract to `increment` and `reset` a global state.
- **Live Event Feed** – Watch contract events happen in real-time with our built-in event listener.
- **Dark Mode Aesthetics** – Sleek, low-light design optimized for developers.

---

## 🛠️ Tech Stack

- **Frontend**: React 18 + Vite 5
- **Styling**: Tailwind CSS 3
- **Blockchain**: `@stellar/stellar-sdk` (Horizon + Soroban RPC)
- **Wallets**: `@stellar/freighter-api`, `@creit.tech/stellar-wallets-kit`, `@creit.tech/xbull-wallet-connect`
- **Tests**: Vitest + Testing Library

---

## ⚙️ Local Development

### 1. Install Dependencies
```bash
npm install
```
*Note: If `npm install` fails due to dependency conflicts, use `npm install --ignore-scripts`.*

### 2. Configure Environment
Create a `.env` file in the root:
```env
VITE_CONTRACT_ID=CDJJ5BYJHWZBXRRX5M2XAEX5GMINIR3FDEAL4H7KRUZJXTXL44KCS2ZY
VITE_NETWORK_PASSPHRASE="Test SDF Network ; September 2015"
VITE_RPC_URL=https://soroban-testnet.stellar.org
VITE_HORIZON_URL=https://horizon-testnet.stellar.org
```

### 3. Run Development Server
```bash
npm run dev
```

---

## 🧪 Testing

Run unit and component tests:
```bash
npm test
```

---

## 📁 Project Structure

- **/src**: Main Stellar Pay dApp source code and core components.
- **/contract**: Soroban smart contract source code (Rust).
- **/crypto-portfolio**: A separate Ethereum-based portfolio tracker dApp using ethers.js.
- **/stellar-payment-dapp**: A specialized implementation of the Stellar payment flow.
- **/scripts**: Deployment and automation scripts for Soroban contracts.

---

*Built with ❤️ on Stellar Testnet · Not for use with real XLM funds.*

