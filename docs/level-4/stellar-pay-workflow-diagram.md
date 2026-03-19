# 🏗️ Stellar Pay: Level 4 Workflow & Dependencies

This diagram visualizes the data flow and architectural interactions within your **Stellar Pay AMM** application.

---

### [Architecture Overview]
Your Level 4 application uses a **Factory-Instance Pattern** to manage decentralized liquidity pools on the Stellar Testnet.

```mermaid
graph TD
    User([User / Wallet]) -->|1. Request Deployment| Factory[AMM Factory Contract]
    Factory -->|2. env.deployer.deploy| Pool[AMM Pool Contract Instance]
    Pool -->|3. init| Assets[Asset A & Asset B]
    
    User -->|4. Add Liquidity| Pool
    Pool -->|5. Publish Event| Feed[Live Event Feed]
    
    User -->|6. Execute Swap| Pool
    Pool -->|7. Math x*y=k| Logic[Safe i128 Arithmetic]
    Logic -->|8. Update Reserves| Pool
    
    UI[React App] -->|9. Poll Events| Feed
    UI -->|10. Fetch Reserves| Factory
    Factory -->|11. Cross-Contract Call| Pool
    Pool -->|12. Return (u128, u128)| Factory
    Factory -->|13. Update UI State| UI
```

---

### [Component Dependencies]

| Component | Responsibility | Key Dependency |
| :--- | :--- | :--- |
| **AMM Factory** | Managing Pools, Mapping Assets | `soroban-sdk` / `deployer` |
| **AMM Pool** | Swap Logic, Liquidity Math | `i128` Fixed-Point Math |
| **Swap Dashboard** | UI for Constant Product Swaps | `Stellar SDK` / `Tailwind` |
| **CI/CD Pipeline** | Automated Build & Test | `GitHub Actions` / `Stellar CLI` |
| **Wallet Connector** | Secure Account Access | `Freighter` / `Wallets Kit` |
| **Event Listener** | Real-time UI Updates | `RPC Event Polling` |

---

### [Development Lifecycle]
1.  **Contract Design**: Define `AMMPool` math ($x \cdot y = k$) and `AMMFactory` mapping logic.
2.  **Implementation**: Write Rust code, add `ContractError` enums, and implement `Address.require_auth()`.
3.  **Local Testing**: Use `cargo test` to verify math and cross-contract initialization.
4.  **Deployment**: Use `stellar-cli` to deploy to Testnet and set `VITE_CONTRACT_ID`.
5.  **Frontend Sync**: Integrate the `SwapDashboard` and update the RPC configuration.
6.  **CI/CD Activation**: Push to GitHub and verify that the `.github/workflows/ci.yml` passes.
7.  **Evidence Collection**: Capture screenshots of swaps, builds, and mobile-responsive views.

---
*Created by Antigravity for Stellar Pay Level 4 Applicants.*
