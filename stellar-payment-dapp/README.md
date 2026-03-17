# Stellar Pay – Simple Payment dApp

Send XLM on Stellar Testnet using your Freighter wallet — fast, simple, and fee-light.

### � Project Description
Stellar Pay is a simple, decentralized payment application built to interact with the Stellar Testnet. It acts as an intuitive web interface for users to effortlessly manage their testnet funds. Once connected to a Freighter wallet, users can view their current native XLM balances, fund their newly created accounts with Friendbot, and seamlessly send test XLM to other Stellar addresses with real-time transaction tracking.

[Stellar Pay Live](https://your-deployment-url.vercel.app)
### Wallet Connected State and Balance Displayed
![Wallet Connected](<wallet connected state and balance displayed.png>)
> The Freighter wallet is successfully connected and the truncated public key is shown.
### Successful Testnet Transaction
![Successful Transaction](<successful testnet transaction.png>)
> Screenshot demonstrating a populated form to send a transaction. 
### Transaction Result
![Transaction Result](<transaction result.png>)
> Shows the success banner with a link to the Stellar explorer hash.

### 🛠 Tech Stack

| Layer | Technology |
| --- | --- |
| *Frontend* | React 18 + Vite 5 |
| *Styling* | Tailwind CSS 3 |
| *Stellar SDK* | @stellar/stellar-sdk v12 |
| *Wallet* | @stellar/freighter-api v2 |
| *Network* | Stellar Testnet (Horizon) |

### ⚙️ Setup Instructions (How to run locally)

1. *Clone the repository*:
   ```bash
   git clone https://github.com/nagarekhushi04/white-belt-level-1.git
   cd white-belt-level-1
   ```

2. *Install dependencies*:
   ```bash
   npm install
   ```

3. *Start the development server*:
   ```bash
   npm run dev
   ```

4. *Open in browser*:
   Navigate to http://localhost:5173 in your browser.

### 🧪 How to Test
1. *Install Freighter* – download from [freighter.io](https://www.freighter.io) (Chrome / Brave extension)
2. *Switch to Testnet* – open Freighter → Settings → Network → select Test Network
3. *Use Friendbot* – click 💧 *Fund with Friendbot* to receive 10,000 test XLM
4. *Send XLM* – paste any testnet address, enter an amount, add an optional memo, click 🚀 *Send XLM*
5. *View on Explorer* – after a successful transaction, click the hash link to view it on stellar.expert

## ✅ Level 1 Checklist
- [x] React + Vite project scaffold
- [x] Tailwind CSS dark theme (#0f0f1a background)
- [x] Header with brand, Testnet badge, and wallet slot
- [x] useWallet hook (connect / disconnect via Freighter)
- [x] WalletCard – shows truncated public key + balance
- [x] useBalance hook – auto-fetches XLM balance
- [x] Friendbot faucet button with toast feedback
- [x] SendForm – recipient / amount / memo fields with validation
- [x] Full transaction flow: build → sign (Freighter) → submit (Horizon)
- [x] StatusBanner – success hash link + user-friendly error messages
- [x] Responsive mobile layout
- [x] Footer: "Built on Stellar Testnet · Not for real funds"

## 📁 Project Structure
```text
src/
  components/
    Header.jsx        # App shell header
    WalletCard.jsx    # Wallet connect/balance UI
    SendForm.jsx      # XLM payment form
    StatusBanner.jsx  # Success/error transaction banner
  hooks/
    useWallet.js      # Freighter connect/disconnect state
    useBalance.js     # XLM balance fetch + refresh
  utils/
    stellar.js        # fetchBalance, fundWithFriendbot, sendXLM, isValidStellarAddress
  App.jsx             # Root component
  main.jsx            # React DOM entry
  index.css           # Global styles + Tailwind
```

---
White Belt – Level 1 · Stellar Payment dApp
