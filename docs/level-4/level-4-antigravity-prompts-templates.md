# 📋 Level 4: Antigravity Prompt Templates (Copy-Paste Ready)

Use these templates as a standalone platform input. Each block is designed to be copy-pasted directly into your Antigravity chat to hit your Level 4 milestones quickly and efficiently.

---

### [Template 1: Advanced Contract Architecture]
> **Prompt:** "Antigravity, help me design a Level 4 modular contract system for a [Your Project Idea, e.g., Escrow with Arbitration]. Please propose a structure with a Factory contract that deploys individual instances, clearly defining the inter-contract calls and shared state requirements."

---

### [Template 2: Cross-Contract Implementation]
> **Prompt:** "Antigravity, implement the `deploy` function in my Factory contract that correctly invokes the `init` function of newly created child contracts. Ensure error handling for failed cross-contract calls and implement `Authorized` checks."

---

### [Template 3: Constant Product AMM Math]
> **Prompt:** "Antigravity, I need to implement a constant product ($x*y=k$) swap function for Soroban. Please generate the Rust logic for calculating `get_amount_out` ensuring protection against overflow using `i128` and implementing a 0.3% LP fee."

---

### [Template 4: SAC Utility Wrapper]
> **Prompt:** "Antigravity, create a utility function to interact with Stellar Asset Contracts (SAC). I need safe wrappers for `balance(id)`, `transfer(from, to, amount)`, and `transfer_from` with customized error variants."

---

### [Template 5: Robust Error Enum]
> **Prompt:** "Antigravity, analyze my current contracts and rewrite the error handling. Replace all panics and unwraps with a custom `ContractError` enum using `#[contracterror]`. Include explicit errors for `Unauthorized`, `InsufficientBalance`, and `InvalidAmount`."

---

### [Template 6: Event Implementation]
> **Prompt:** "Antigravity, implement a set of events for my [Swap/Escrow] contract. I need events for `LiquidityAdded`, `SwapExecuted`, and `FundsRecovered` that include IDs, amounts, and timestamps for front-end indexing."

---

### [Template 7: CI/CD Workflow Setup]
> **Prompt:** "Antigravity, generate a `.github/workflows/ci.yml` for my Soroban project. It must handle `cargo fmt`, `cargo clippy`, and run `cargo test` in a container that supports the Stellar CLI environment."

---

### [Template 8: Full Integration Test]
> **Prompt:** "Antigravity, write a comprehensive integration test for my [AMM/DEX]. It should simulate a full lifecycle: adding liquidity, performing multiple swaps, and removing liquidity, asserting correct state changes at each step."

---

### [Template 9: Responsive UI Refactor]
> **Prompt:** "Antigravity, refactor my current React components for Level 4 responsiveness. Use Tailwind CSS to ensure the layout is flawless on mobile (375px), tablet, and desktop. Prioritize accessibility and touch-target sizes."

---

### [Template 10: Multi-Wallet Kit]
> **Prompt:** "Antigravity, integrate the `Stellar Wallets Kit` into my frontend. I want a unified 'Connect Wallet' modal that supports Freighter and xBull, with proper event listeners for account switches."

---

### [Template 11: RPC Polling Hook]
> **Prompt:** "Antigravity, write a custom React hook `useSorobanEvents` that intelligently polls for contract events using the Soroban RPC. Implement a 5-second polling interval and local caching to prevent redundant state updates."

---

### [Template 12: Front-end Security Audit]
> **Prompt:** "Antigravity, perform a security review of my frontend transaction submission logic. Ensure I am validating all user inputs before signing and correctly handling testnet vs. mainnet network passphrases."

---

### [Template 13: Technical Deep-Dive Documentation]
> **Prompt:** "Antigravity, help me draft a Level 4 README. I need an 'Architecture' section with a Mermaid sequence diagram showing the interactions between the user, the Factory contract, and the child instances."

---

### [Template 14: Gas & Performance Review]
> **Prompt:** "Antigravity, review my contract implementation for gas efficiency. Identify any redundant state storage and suggest optimizations for loop-heavy operations to minimize Soroban invocation costs."

---
*Created by Antigravity for Level 4 Applicants.*
