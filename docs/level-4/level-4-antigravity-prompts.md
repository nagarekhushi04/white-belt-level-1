# 📚 Level 4: Complete Antigravity Prompting Reference

This guide provides deep-dive specifications for building **Level 4 Production-Ready dApps** using Antigravity. Level 4 represents the pinnacle of performance, security, and professional architecture.

---

## 🏗️ The 14 Key Specifications

### 1. Advanced Smart Contract Architecture
**Requirement:** Modular, upgradeable (if applicable), and logically separated contracts.
- **Specification:** Contracts should be partitioned by concern (e.g., `EscrowFactory.rs` and `EscrowInstance.rs`).
- **Antigravity Use Case:** Use the `/architecture` context to map out data flows between contracts before implementation.

### 2. Cross-Contract (Inter-Contract) Communication
**Requirement:** Call functions on other contracts reliably.
- **Specification:** Use Soroban's `env.invoke_contract` for internal calls and `SubInvocation` patterns for complex state updates.
- **Antigravity Use Case:** "Antigravity, implement a secure cross-contract call between my Factory and Instance that uses `Authorized` state for access control."

### 3. Automated Market Maker (AMM) & Liquidity Pools
**Requirement:** Implement at least one core pool mechanic.
- **Specification:** Constant Product Formula ($x * y = k$) for swaps or weighted pools for more complex assets.
- **Antigravity Use Case:** Generating optimized math for fixed-point arithmetic on-chain (using `i128` or `Fixed64`).

### 4. Advanced Token Logic (SAC / SAC-T)
**Requirement:** Manage custom tokens beyond native XLM.
- **Specification:** Interacting with Stellar Asset Contracts (SAC) and implementing `Transfer`, `Mint`, and `Burn` wrappers with precise error handling.

### 5. Production-Ready Error Handling
**Requirement:** Zero-panic contracts.
- **Specification:** Replace `unwrap()` and `expect()` with a robust `ContractError` enum utilizing `#[contracterror]`.
- **Antigravity Use Case:** Auditing existing logic for potential panics and suggesting safe `Result` wrappers.

### 6. Event Indexing & Live Feeds
**Requirement:** Real-time state updates in the UI.
- **Specification:** Subscribing to Soroban events and indexing them for user history search and real-time toast notifications.

### 7. CI/CD Pipelines (GitHub Actions)
**Requirement:** Automatic linting, building, and testing.
- **Specification:** A `.github/workflows/ci.yml` that runs `cargo test`, `cargo fmt`, and `stellar-cli` builds on every PR.

### 8. Comprehensive Automated Testing
**Requirement:** 80%+ coverage on contract logic.
- **Specification:** Integration tests that simulate multi-contract environments and edge cases (e.g., insufficient balance, unauthorized access).

### 9. Mobile-First Responsive Design
**Requirement:** Seamless UX on 350px+ widths.
- **Specification:** Flex/Grid layouts with viewport-aware components and touch-friendly interaction targets.
- **Antigravity Use Case:** "Review this Tailwind layout and make it consistent for iPhone SE and Desktop Ultra-Wide."

### 10. Multi-Wallet Integration
**Requirement:** Support beyond just one extension.
- **Specification:** Integration with Freighter, xBull, and potentially Kit for unified wallet discovery.

### 11. Advanced State Management (Front-end)
**Requirement:** Optimized React renders and caching.
- **Specification:** Use of custom hooks for RPC polling, local storage for metadata caching, and optimistic UI updates for swaps.

### 12. Security Hardening (Front-end)
**Requirement:** Guarding against common web3 exploits.
- **Specification:** Origin checks, input sanitation, and clear "Warning: Mainnet" banners when applicable.

### 13. Professional Documentation & Git History
**Requirement:** Full README with architectures diagrams and 8+ semantic commits.
- **Specification:** Use conventional commits (`feat:`, `fix:`, `docs:`) and clear Mermaid.js diagrams for data flow.

### 14. Performance & Scalability (RPC Optimization)
**Requirement:** Minimizing redundant RPC calls.
- **Specification:** Batching contract reads and using efficient polling intervals based on block time (~5s on Stellar).

---

## ⚖️ Evaluation Criteria
- **Architecture (25%):** Are the contracts clean and logically separated?
- **Blockchain Logic (25%):** Is the AMM/Token math correct and safe?
- **User Interface (20%):** Does it look premium and work on mobile?
- **Operations (15%):** Is there a working CI/CD pipeline?
- **Documentation (15%):** Is it easy for another developer to host and build?

---
*Created by Antigravity for Level 4 Applicants.*
