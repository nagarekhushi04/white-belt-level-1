import { SorobanRpc, Contract, TransactionBuilder, Account, Networks } from '@stellar/stellar-sdk'
import fs from 'node:fs'
import path from 'node:path'

function readDotEnvValue(dotEnvText, key) {
    const re = new RegExp(`^${key}=(.*)$`, 'm')
    const match = dotEnvText.match(re)
    if (!match) return null
    return match[1].trim().replace(/^"(.*)"$/, '$1')
}

const root = process.cwd()
const envPath = path.join(root, '.env')
const envText = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf8') : ''

const CONTRACT_ID =
    process.env.VITE_CONTRACT_ID ||
    readDotEnvValue(envText, 'VITE_CONTRACT_ID') ||
    ''

const RPC_URL =
    process.env.VITE_RPC_URL ||
    readDotEnvValue(envText, 'VITE_RPC_URL') ||
    'https://soroban-testnet.stellar.org'

if (!CONTRACT_ID) {
    console.log('NO_CONTRACT_ID: Set VITE_CONTRACT_ID in .env (or env var) first.')
    process.exit(2)
}

const rpc = new SorobanRpc.Server(RPC_URL)
const dummy = new Account('GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF', '0')
const contract = new Contract(CONTRACT_ID)

const tx = new TransactionBuilder(dummy, {
    fee: '100',
    networkPassphrase: Networks.TESTNET,
})
    .addOperation(contract.call('get_count'))
    .setTimeout(30)
    .build()

try {
    const sim = await rpc.simulateTransaction(tx)
    if (SorobanRpc.Api.isSimulationError(sim)) {
        const asJson = JSON.stringify(sim)
        if (asJson.includes('MissingValue')) {
            console.log('NOT_DEPLOYED: Contract missing on-chain (testnet reset or wrong id).')
            process.exit(1)
        }
        console.log('SIMULATION_ERROR:', JSON.stringify(sim, null, 2))
        process.exit(1)
    }

    console.log('DEPLOYED: simulate get_count ok')
    process.exit(0)
} catch (e) {
    console.error('CHECK_FAILED:', e?.message || e)
    process.exit(1)
}

