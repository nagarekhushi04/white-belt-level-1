#!/bin/bash
# Build the contract
cd contract
soroban contract build

# Deploy to testnet
CONTRACT_ID=$(soroban contract deploy \
  --wasm target/wasm32-unknown-unknown/release/stellar_counter.wasm \
  --source <YOUR_FUNDED_TESTNET_SECRET_KEY> \
  --network testnet)

echo "Contract deployed at: $CONTRACT_ID"

# Initialize (optional invoke to verify)
soroban contract invoke \
  --id $CONTRACT_ID \
  --source <YOUR_FUNDED_TESTNET_SECRET_KEY> \
  --network testnet \
  -- get_count
