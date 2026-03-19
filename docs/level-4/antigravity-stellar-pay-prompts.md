# 🚀 Level 4 - Stellar Pay: 14 Antigravity-Ready Prompts

This file contains 14 complete prompts optimized for the **Antigravity AI Platform**. Use these standalone templates to build, audit, and submit your **Stellar Pay AMM** implementation.

---

### [Prompt 1: Project Introduction]
**Title:** Level 4 - Stellar Pay: Advanced AMM Implementation
**Prompt:**
Welcome to Level 4! Your goal is to build a production-grade Automated Market Maker (AMM) on the Stellar Testnet. This project requires you to implement a Factory-Instance pattern where a Factory contract manages multiple constant product liquidity pools. You will need to design the blockchain architecture, implement complex fixed-point math for swaps, ensure mobile responsiveness for your React UI, and setup a robust CI/CD pipeline. The suggested timeline is 4 weeks. Let's start by mapping out the high-level architecture!

---

### [Prompt 2: Smart Contract Requirements]
**Title:** Smart Contract: Math, Safety, and Quality Standards
**Prompt:**
Antigravity, let's implement the core `AMMPool` logic. I need a constant product formula ($x \cdot y = k$) for asset swapping. Requirements: 
- Use `i128` or `u128` for all reserve and amount calculations to prevent overflow.
- Replace all `panic!` and `unwrap()` with a custom `ContractError` enum utilizing `#[contracterror]`.
- Implement `Address.require_auth()` on all functions that update state.
- Ensure the code follows professional Rust formatting and clean code standards.

---

### [Prompt 3: Inter-Contract Calls]
**Title:** Multi-Contract Communication: Factory to Pool Interaction
**Prompt:**
Antigravity, I need to implement a cross-contract call between my `AMMFactory` and my `AMMPool` contract. Please write the `get_pool_reserves` function in the Factory that uses the `AMMPool` client (via `contractimport!`) to fetch the current (u128, u128) reserves for a given pool address. Ensure the Factory correctly handles potential errors if the pool address is invalid.

---

### [Prompt 4: Custom Token & Pool]
**Title:** Custom Token Specifications and Liquidity Pool Deployment
**Prompt:**
Antigravity, let's configure the token interactions for the AMM. I need to implement support for Stellar Asset Contracts (SAC). Please write the logic for adding liquidity, where the pool contract receives `AssetA` and `AssetB` and updates its internal reserves accordingly. Ensure we have clear events for `LiquidityAdded` and `SwapExecuted` including amounts and timestamps.

---

### [Prompt 5: CI/CD Pipeline]
**Title:** GitHub Actions Pipeline: Build, Lint, and Test Automation
**Prompt:**
Antigravity, generate a `.github/workflows/ci.yml` file for my project. The pipeline should:
- Run on `push` and `pull_request` to the `main` branch.
- Install the Rust toolchain with the `wasm32-unknown-unknown` target.
- Run `cargo fmt --check` and `cargo clippy`.
- Execute `cargo test` for all contracts in the `/contract` directory.
- Build the React frontend using `npm run build`.

---

### [Prompt 6: Mobile Responsiveness]
**Title:** Responsive UI: From 1920px Desktop to 390px Mobile
**Prompt:**
Antigravity, refactor my `SwapDashboard` component for Level 4 responsiveness. Use Tailwind CSS breakpoints to ensure:
- Desktop (1920px): Centered, wide layout with detailed reserve info.
- Tablet (768px): Adaptive card width with touch-friendly buttons.
- Mobile (390px): Vertical stack with large input fields and optimized font sizes.
Audit the layout to ensure there is no horizontal overflow on small devices.

---

### [Prompt 7: GitHub Repository]
**Title:** Repository Organization and Security Standards
**Prompt:**
Antigravity, review my project's folder structure for Level 4 standards. Ensure that:
- Contracts are in `/contract/contracts/`.
- Documentation is in `/docs/`.
- Frontend is clean and logically separated.
- Sensitive files like `.env` and `target/` are correctly ignored in `.gitignore`.
- Provide a summary of the security standards implemented in the `SECURITY.md`.

---

### [Prompt 8: Git Commits]
**Title:** Git History: 8+ Meaningful Semantic Commits
**Prompt:**
Antigravity, I need to ensure my git history meets the "8+ meaningful commits" requirement. Please analyze my current implementation and suggest 8 logical, semantic commit messages (e.g., `feat:`, `fix:`, `docs:`, `test:`) that would represent a progressive development lifecycle from foundation to final polish.

---

### [Prompt 9: Comprehensive README]
**Title:** Professional README: The 11 Required Sections
**Prompt:**
Antigravity, help me draft a complete root `README.md` for my Level 4 project. It must include:
1. Project Title & Badges (CI, Deployment)
2. Description & Key Features
3. High-Level Architecture (Mermaid Diagram)
4. Tech Stack Table
5. Setup Instructions (Clone, Install, Env)
6. Testing Guide (Contract & Frontend)
7. Deployment Guide (Testnet instructions)
8. Project Structure Tree
9. Mobile Responsiveness Proof
10. Security Implementation Summary
11. Team/Credits

---

### [Prompt 10: CI/CD Badge & Screenshots]
**Title:** Evidence Collection: Build Badges and WASM Screenshots
**Prompt:**
Antigravity, guide me through collecting the required visual evidence for my submission. I need to:
- Add the GitHub Actions CI status badge to my README header.
- Provide instructions on how to capture a terminal screenshot showing a successful `cargo build --release` with the resulting WASM binary sizes.
- Help me capture a high-quality screenshot of the Swap Dashboard in action on a mobile-view browser.

---

### [Prompt 11: Submission Information]
**Title:** Final Submission Format and Evidence Presentation
**Prompt:**
Antigravity, what is the best format for my final submission? Please provide a template for the "Submission Summary" which should include:
- Repository URL (Public GitHub)
- Live Deployment URL (Vercel)
- Deployed Contract IDs (Testnet)
- Verification that all 7 core Level 4 requirements are met.
- Links to relevant documentation (Action Plan, Checklist, Security).

---

### [Prompt 12: Final Verification Checklist]
**Title:** Pre-Submission Checklist: The Final Review Gate
**Prompt:**
Antigravity, let's run a final quality audit against the Level 4 Master Checklist. We need to verify that:
- The AMM math is 100% safe from overflow.
- Inter-contract calls work without errors.
- The UI is fully responsive on 390px.
- CI/CD pipeline is passing green on GitHub.
- Documentation is complete and professional.
Flag any potential issues before I hit submit!

---

### [Prompt 13: Evaluation Criteria]
**Title:** Scoring Rubric: How My Level 4 Project is Evaluated
**Prompt:**
Antigravity, what are the primary weighted categories for my project's evaluation? Please describe a scoring scale (90 to 60) focusing on:
- Blockchain Architecture & Math (25%)
- UI/UX & Responsiveness (25%)
- Ops & DevOps (Pipeline, Testing) (20%)
- Documentation & Standards (Git, README) (15%)
- Code Quality & Security (15%)

---

### [Prompt 14: Success Criteria]
**Title:** Final Success Gate and Ready-to-Submit Verification
**Prompt:**
Antigravity, I have completed all implementation tasks. Please perform a final sweep of the codebase and confirm if I meet the "Submission-Ready" gate. If everything looks solid, generate a final "Success Report" that I can include in my submission to show that all Level 4 requirements have been meticulously fulfilled.

---
*Created by Antigravity for Stellar Pay Level 4 Applicants.*
