# 🛡️ Security Policy & Best Practices

This document outlines the security measures and best practices implemented in the Stellar Pay Level 4 Application.

## 🔒 Smart Contract Security

### 1. Authorization
- **RequireAuth**: All sensitive functions (e.g., `swap`, `add_liquidity`, `set_pool`) use Soroban's `Address.require_auth()` to ensure only the owner/authorized account can initiate state changes.
- **Factory Restrictions**: Each AMM pool tracks its `Factory` address to ensure it only accepts commands from its legitimate creator.

### 2. Arithmetic Safety
- **Overflow Protection**: We use `i128` and `u128` for all liquidity math to prevent overflow.
- **Constant Product Guard**: The `swap` function checks for divide-by-zero scenarios and ensures `x * y = k` remains stable.

### 3. Error Handling
- **Zero-Panic**: We use a custom `ContractError` enum to handle failures gracefully (e.g., `InsufficientReserves`, `NotInitialized`) instead of allowing the contract to panic.

## 🌐 Frontend Security

### 1. Sanitization
- All user inputs in the `SendForm` and `SwapDashboard` are validated for type and range before being passed to the Stellar SDK.

### 2. Network Integrity
- The application verifies the `NETWORK_PASSPHRASE` before each transaction to prevent accidental mainnet submissions during testnet development.

### 3. Dependency Auditing
- We utilize `npm audit` and a CI/CD pipeline to ensure that all frontend libraries (React, Stellar SDK) are up to date and free of known vulnerabilities.

---
*Maintained by the Level 4 Development Team.*
