$ErrorActionPreference = "Stop"

function Require-Command($name) {
    if (-not (Get-Command $name -ErrorAction SilentlyContinue)) {
        throw "Required command not found: $name. Run 'cargo install --locked stellar-cli' to fix."
    }
}

Require-Command "stellar"
Require-Command "cargo"

$root = Split-Path -Parent $PSScriptRoot
$contractManifest = Join-Path $root "contract\\Cargo.toml"

# 1. Provide a fundable Testnet Secret Key
$secret = $env:STELLAR_SECRET_KEY
if (-not $secret) {
    throw "Set STELLAR_SECRET_KEY in your environment (starts with 'S...')."
}

Write-Host "🚀 Building Level 4 Advanced AMM Contracts..." -ForegroundColor Cyan
stellar contract build --manifest-path $contractManifest | Out-Host

# 2. Deploy AMM Pool
$poolWasmPath = Join-Path $root "contract\\target\\wasm32-unknown-unknown\\release\\amm_pool.wasm"
Write-Host "📦 Deploying AMM Pool instance..." -ForegroundColor Yellow
$poolId = stellar contract deploy --wasm $poolWasmPath --source-account $secret --network testnet
$poolId = $poolId.Trim()
Write-Host "✅ Pool Instance ID: $poolId" -ForegroundColor Green

# 3. Deploy AMM Factory
$factoryWasmPath = Join-Path $root "contract\\target\\wasm32-unknown-unknown\\release\\amm_factory.wasm"
Write-Host "📦 Deploying AMM Factory..." -ForegroundColor Yellow
$factoryId = stellar contract deploy --wasm $factoryWasmPath --source-account $secret --network testnet
$factoryId = $factoryId.Trim()
Write-Host "✅ Factory ID: $factoryId" -ForegroundColor Green

# 4. Integrate Factory and Pool (Level 4 Inter-contract Setup)
Write-Host "🔗 Initializing Factory with Admin account..." -ForegroundColor Cyan
stellar contract invoke --id $factoryId --source-account $secret --network testnet -- init --admin $secret

Write-Host "🔗 Registering Pool in Factory..." -ForegroundColor Cyan
# Simulation of registering a specific pair (for demo)
$assetA = "GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF" # Mock Native/Asset
$assetB = "GBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBSX6" # Mock Token
stellar contract invoke --id $factoryId --source-account $secret --network testnet -- set_pool --admin $secret --asset_a $assetA --asset_b $assetB --pool_address $poolId

# 5. Populate .env for Frontend
$envPath = Join-Path $root ".env"
$lines = @(
    "VITE_CONTRACT_ID=$poolId",
    "VITE_FACTORY_ID=$factoryId",
    "VITE_NETWORK_PASSPHRASE=`"Test SDF Network ; September 2015`"",
    "VITE_RPC_URL=`"https://soroban-testnet.stellar.org`"",
    "VITE_HORIZON_URL=`"https://horizon-testnet.stellar.org`""
)

Set-Content -Path $envPath -Value $lines -Encoding UTF8
Write-Host "📄 .env updated for Level 4 successfully." -ForegroundColor Green
