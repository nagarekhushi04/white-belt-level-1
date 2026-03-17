import { Horizon, StrKey, TransactionBuilder, Networks, Operation, Asset, Memo } from '@stellar/stellar-sdk'
import { signTransaction } from '@stellar/freighter-api'

const SERVER_URL = 'https://horizon-testnet.stellar.org'
const server = new Horizon.Server(SERVER_URL)

// ─── Balance ────────────────────────────────────────────────────────────────

/**
 * Fetches the native XLM balance for a given public key.
 * Throws "Account not funded" if the account does not exist on-chain.
 */
export async function fetchBalance(publicKey) {
    try {
        const account = await server.loadAccount(publicKey)
        const native = account.balances.find(b => b.asset_type === 'native')
        return native ? native.balance : '0.0000000'
    } catch (err) {
        if (err?.response?.status === 404) {
            throw new Error('Account not funded')
        }
        throw err
    }
}

// ─── Friendbot ──────────────────────────────────────────────────────────────

/**
 * Funds a testnet account via Friendbot.
 */
export async function fundWithFriendbot(publicKey) {
    const response = await fetch(
        `https://friendbot.stellar.org?addr=${encodeURIComponent(publicKey)}`
    )
    if (!response.ok) {
        const text = await response.text()
        throw new Error(text || 'Friendbot failed to fund the account')
    }
    return await response.json()
}

// ─── Address Validation ──────────────────────────────────────────────────────

/**
 * Returns true if the given string is a valid Stellar Ed25519 public key.
 */
export function isValidStellarAddress(address) {
    try {
        return StrKey.isValidEd25519PublicKey(address)
    } catch {
        return false
    }
}

// ─── Send XLM ────────────────────────────────────────────────────────────────

/**
 * Builds, signs (via Freighter), and submits an XLM payment transaction.
 * Returns the Horizon result object (result.hash is the tx hash).
 */
export async function sendXLM(senderPublicKey, recipientAddress, amount, memo) {
    // 1. Load sender account
    const senderAccount = await server.loadAccount(senderPublicKey)

    // 2. Build transaction
    const txBuilder = new TransactionBuilder(senderAccount, {
        fee: '100',
        networkPassphrase: Networks.TESTNET,
    })
        .addOperation(
            Operation.payment({
                destination: recipientAddress,
                asset: Asset.native(),
                amount: amount.toString(),
            })
        )
        .setTimeout(30)

    if (memo && memo.trim()) {
        txBuilder.addMemo(Memo.text(memo.trim()))
    }

    const transaction = txBuilder.build()

    // 3. Convert to XDR
    const xdr = transaction.toXDR()

    // 4. Sign with Freighter
    const signedResult = await signTransaction(xdr, {
        network: 'TESTNET',
        networkPassphrase: Networks.TESTNET,
    })

    // signTransaction returns either a string XDR or { signedTxXdr, ... }
    const signedXDR =
        typeof signedResult === 'string' ? signedResult : signedResult.signedTxXdr

    // 5. Reconstruct transaction from signed XDR
    const signedTx = TransactionBuilder.fromXDR(signedXDR, Networks.TESTNET)

    // 6. Submit
    const result = await server.submitTransaction(signedTx)

    // 7. Return result (result.hash contains the tx hash)
    return result
}
