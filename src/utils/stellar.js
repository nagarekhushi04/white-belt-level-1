import { Horizon, StrKey, TransactionBuilder, Networks, Operation, Asset, Memo, SorobanRpc } from '@stellar/stellar-sdk'
import { HORIZON_URL, RPC_URL } from '../config.js'

const SERVER_URL = HORIZON_URL
export const server = new Horizon.Server(SERVER_URL)

// In v12, SorobanRpc.Server is standard. 
// Adding allowHttp fallback if needed, but keeping it simple for now.
export const rpcServer = new SorobanRpc.Server(RPC_URL, { allowHttp: false })

// ─── Balance ────────────────────────────────────────────────────────────────

/**
 * Fetches the native XLM balance for a given public key.
 * Throws "Account not funded" if the account does not exist on-chain.
 */
export async function fetchBalance(publicKey) {
    if (!publicKey) return '0.0000000';
    try {
        const account = await server.loadAccount(publicKey)
        const native = account.balances.find(b => b.asset_type === 'native')
        return native ? native.balance : '0.0000000'
    } catch (err) {
        console.error("fetchBalance error:", err);
        if (err?.response?.status === 404) {
            throw new Error('Account not funded')
        }
        // Handle generic network errors
        if (err?.message?.includes('failed to fetch') || !err?.response) {
            throw new Error('Network error: Could not reach Stellar Horizon')
        }
        throw new Error(err?.message || 'Failed to fetch balance')
    }
}

// ─── Friendbot ──────────────────────────────────────────────────────────────

/**
 * Funds a testnet account via Friendbot.
 */
export async function fundWithFriendbot(publicKey) {
    if (!publicKey) throw new Error('Public key required for funding');
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
    if (!address) return false;
    try {
        return StrKey.isValidEd25519PublicKey(address)
    } catch {
        return false
    }
}

// ─── Send XLM ────────────────────────────────────────────────────────────────

/**
 * Builds, signs (via provided signTx callback), and submits an XLM payment transaction.
 * Returns the Horizon result object (result.hash is the tx hash).
 */
export async function sendXLM(senderPublicKey, recipientAddress, amount, memo, signTx) {
    try {
        // 1. Load sender account
        const senderAccount = await server.loadAccount(senderPublicKey)

        // 2. Build transaction
        const txBuilder = new TransactionBuilder(senderAccount, {
            fee: '1000', // Increased default fee for better reliability
            networkPassphrase: Networks.TESTNET,
        })
            .addOperation(
                Operation.payment({
                    destination: recipientAddress,
                    asset: Asset.native(),
                    amount: amount.toString(),
                })
            )
            .setTimeout(60) // Increased timeout

        if (memo && memo.trim()) {
            txBuilder.addMemo(Memo.text(memo.trim()))
        }

        const transaction = txBuilder.build()

        // 3. Convert to XDR
        const xdr = transaction.toXDR()

        // 4. Sign via provided kit callback
        const signedXDR = await signTx(xdr)

        // 5. Reconstruct transaction from signed XDR
        const signedTx = TransactionBuilder.fromXDR(signedXDR, Networks.TESTNET)

        // 6. Submit
        const result = await server.submitTransaction(signedTx)
        // 7. Return result (result.hash contains the tx hash)
        return result
    } catch (err) {
        console.error("sendXLM error:", err);
        // Extract useful error message if available from Horizon
        const horizonError = err?.response?.data?.extras?.result_codes?.operations?.[0] || 
                             err?.response?.data?.extras?.result_codes?.transaction;
        if (horizonError) {
             throw new Error(`Stellar Error: ${horizonError}`);
        }
        throw err;
    }
}

/**
 * Checks if the account has at least `minBalance` XLM.
 * Throws a specific error if the balance is too low.
 */
export async function checkSufficientBalance(publicKey, minBalance = 1) {
    if (!publicKey) return;
    try {
        const balanceStr = await fetchBalance(publicKey);
        const balance = parseFloat(balanceStr);
        if (isNaN(balance) || balance < minBalance) {
            throw new Error("Insufficient XLM balance. Please fund your testnet wallet.");
        }
    } catch (err) {
        if (err.message === "Insufficient XLM balance. Please fund your testnet wallet.") {
            throw err;
        }
        if (err?.message === 'Account not funded') {
             throw new Error("Insufficient XLM balance. Please fund your testnet wallet.");
        }
        console.warn('checkSufficientBalance: unexpected error:', err?.message);
    }
}
