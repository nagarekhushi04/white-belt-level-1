# 🌟 Stellar Pay – Simple Payment & Counter dApp

[![Network: Stellar Testnet](https://img.shields.io/badge/Network-Stellar%20Testnet-blue.svg)](https://stellar.expert/explorer/testnet)
[![Tech Stack: React + Vite](https://img.shields.io/badge/Stack-React%20%2B%20Vite-61DAFB.svg)](https://vitejs.dev/)
[![Styling: Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20CSS-38B2AC.svg)](https://tailwindcss.com/)

**Stellar Pay** is a high-performance, decentralized payment application built for the **Stellar Testnet**. It provides a sleek, modern interface for managing testnet funds and interacting with on-chain Soroban smart contracts.

---

## 🖼️ App Screenshot

![Stellar Pay dApp](../screenshots/dapp_main_screenshot.png)
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

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | [React 18](https://react.dev/) | Component-based UI library |
| **Build Tool** | [Vite 5](https://vitejs.dev/) | Ultra-fast frontend tooling |
| **Styling** | [Tailwind CSS 3](https://tailwindcss.com/) | Utility-first CSS framework |
| **Blockchain** | [@stellar/stellar-sdk](https://github.com/stellar/js-stellar-sdk) | Interaction with Horizon & Soroban RPC |
| **Wallet** | [@stellar/freighter-api](https://www.freighter.io/) | Wallet integration via browser extensions |

---

## ⚙️ Local Development

### 1. Clone & Install
```bash
git clone https://github.com/nagarekhushi04/white-belt-level-1.git
cd white-belt-level-1
npm install
```

### 2. Configure Environment
Create a `.env` file in the root (if not already present):
```env
VITE_CONTRACT_ID=CDJJ5BYJHWZBXRRX5M2XAEX5GMINIR3FDEAL4H7KRUZJXTXL44KCS2ZY
VITE_NETWORK_PASSPHRASE="Test SDF Network ; September 2015"
VITE_RPC_URL=https://soroban-testnet.stellar.org
VITE_HORIZON_URL=https://horizon-testnet.stellar.org
```

### 3. Launch App
```bash
npm run dev
```
Navigate to [http://localhost:5173](http://localhost:5173).

---

## 🧪 Testing the dApp

1. **Setup Wallet**: Install the [Freighter](https://www.freighter.io) extension and switch to **Test Network**.
2. **Fund Wallet**: Click the 💧 **Fund with Friendbot** button to receive test tokens.
3. **Send XLM**: Paste a recipient address and send a small amount.
4. **Interact with Counter**: Click **Increment** to see our Soroban contract update on-chain.
5. **Verify**: Click the transaction hash to view the proof on [Stellar.expert](https://stellar.expert).

---

## 📁 Project Structure

```text
src/
├── components/       # UI Components (Header, WalletCard, SendForm, etc.)
├── hooks/            # Custom hooks for wallet management & balance fetching
├── utils/            # Stellar SDK helpers & blockchain logic
├── App.jsx           # Main application entry point
└── index.css         # Global styles & Tailwind entry
```

---

*Built with ❤️ on Stellar Testnet · Not for use with real XLM funds.*

