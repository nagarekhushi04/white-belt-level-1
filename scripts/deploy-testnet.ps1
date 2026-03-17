$ErrorActionPreference = "Stop"

function Require-Command($name) {
    if (-not (Get-Command $name -ErrorAction SilentlyContinue)) {
        throw "Required command not found: $name"
    }
}

Require-Command "stellar"
Require-Command "cargo"

$root = Split-Path -Parent $PSScriptRoot
$contractManifest = Join-Path $root "contract\\Cargo.toml"

$secret = $env:STELLAR_SECRET_KEY
if (-not $secret) {
    throw "Set STELLAR_SECRET_KEY in your environment (a funded testnet secret key, starts with 'S...')."
}

Write-Host "Building contract wasm..." -ForegroundColor Cyan
stellar contract build --manifest-path $contractManifest --package stellar-counter | Out-Host

$wasmPath = Join-Path $root "contract\\target\\wasm32-unknown-unknown\\release\\stellar_counter.wasm"
if (-not (Test-Path $wasmPath)) {
    throw "WASM not found at: $wasmPath"
}

Write-Host "Deploying to Stellar Testnet..." -ForegroundColor Cyan
$contractId = stellar contract deploy --wasm $wasmPath --source-account $secret --network testnet

if (-not $contractId) {
    throw "Deploy failed: no contract id returned."
}

$contractId = $contractId.Trim()
Write-Host "Deployed contract id: $contractId" -ForegroundColor Green

# Write .env for Vite
$envPath = Join-Path $root ".env"
$lines = @(
    "VITE_CONTRACT_ID=$contractId",
    "VITE_NETWORK_PASSPHRASE=`"Test SDF Network ; September 2015`"",
    "VITE_RPC_URL=`"https://soroban-testnet.stellar.org`"",
    "VITE_HORIZON_URL=`"https://horizon-testnet.stellar.org`""
)

Set-Content -Path $envPath -Value $lines -Encoding UTF8
Write-Host "Wrote $envPath" -ForegroundColor Green

Write-Host "Verifying get_count (simulation only)..." -ForegroundColor Cyan
stellar contract invoke --id $contractId --source-account $secret --network testnet --send no -- get_count | Out-Host

