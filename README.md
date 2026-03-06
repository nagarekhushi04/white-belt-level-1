Stellar Pay – Simple Payment dApp
Send XLM on Stellar Testnet using your Freighter wallet — fast, simple, and fee-light.

🔗 Live URL
https://your-deployment-url.vercel.app

🛠 Tech Stack
Layer	Technology
Frontend	React 18 + Vite 5
Styling	Tailwind CSS 3
Stellar SDK	@stellar/stellar-sdk v12
Wallet	@stellar/freighter-api v2
Network	Stellar Testnet (Horizon)
⚙️ Setup & Development
# Install dependencies
npm install

# Start the development server
npm run dev
Then open http://localhost:5173 in your browser.

🧪 How to Test
Install Freighter – download from freighter.io (Chrome / Brave extension)
Switch to Testnet – open Freighter → Settings → Network → select Test Network
Use Friendbot – click 💧 Fund with Friendbot to receive 10,000 test XLM
Send XLM – paste any testnet address, enter an amount, add an optional memo, click 🚀 Send XLM
View on Explorer – after a successful transaction, click the hash link to view it on stellar.expert
✅ Level 1 Checklist
 React + Vite project scaffold
 Tailwind CSS dark theme (#0f0f1a background)
 Header with brand, Testnet badge, and wallet slot
 useWallet hook (connect / disconnect via Freighter)
 WalletCard – shows truncated public key + balance
 useBalance hook – auto-fetches XLM balance
 Friendbot faucet button with toast feedback
 SendForm – recipient / amount / memo fields with validation
 Full transaction flow: build → sign (Freighter) → submit (Horizon)
 StatusBanner – success hash link + user-friendly error messages
 Responsive mobile layout
 Footer: "Built on Stellar Testnet · Not for real funds"
📁 Project Structure
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
White Belt – Level 1 · Stellar Payment dApp
