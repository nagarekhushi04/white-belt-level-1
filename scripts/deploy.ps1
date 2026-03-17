# Deploy the contract to testnet using the 'deployer' identity
Write-Host "Building contract..."
Set-Location -Path "contract"
stellar contract build

# Find the built wasm. 
$WASM_PATH = "target/wasm32v1-none/release/stellar_counter.wasm"
if (-not (Test-Path $WASM_PATH)) {
    $WASM_PATH = "target/wasm32-unknown-unknown/release/stellar_counter.wasm"
}

Write-Host "Using WASM at $WASM_PATH"

Write-Host "Deploying to Testnet..."
$CONTRACT_ID = stellar contract deploy `
  --wasm $WASM_PATH `
  --source deployer `
  --network testnet

if ($LASTEXITCODE -ne 0) {
    Write-Host "Deployment failed!"
    exit 1
}

Write-Host "Contract deployed at: $CONTRACT_ID"

# Update config.js
Write-Host "Updating UI configuration..."
$configFile = "../src/config.js"
if (Test-Path $configFile) {
    $content = Get-Content $configFile -Raw
    $newContent = $content -replace "VITE_CONTRACT_ID\s*\|\|\s*'.*'", "VITE_CONTRACT_ID || '$CONTRACT_ID'"
    Set-Content -Path $configFile -Value $newContent -Encoding UTF8
    Write-Host "Configuration updated."
} else {
    Write-Host "Warning: Config file not found at $configFile"
}

Write-Host "Done! Your dApp is now connected to the new contract."
