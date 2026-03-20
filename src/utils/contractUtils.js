import { Contract, TransactionBuilder, Address, scValToNative, SorobanRpc, Account, xdr } from "@stellar/stellar-sdk";
import { server, rpcServer } from "./stellar.js";
import { CONTRACT_ID, NETWORK_PASSPHRASE } from "../config.js";

// Dummy account for simulateTransaction when reading contract state (no auth needed)
// Usage of Account class ensures sequenceNumber() method is available
const DUMMY_ACCOUNT = new Account("GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF", "0");

// Helper to safely convert SCVal to JS native with BigInt handling
function safeNative(scVal) {
    if (!scVal) return null;
    try {
        // In v12, scValToNative is top-level or under SorobanRpc
        const converter = scValToNative || (SorobanRpc && SorobanRpc.scValToNative);
        if (!converter) throw new Error("scValToNative not found in SDK");

        const val = converter(scVal);
        // React cannot render BigInts directly, so we convert them to strings/numbers
        if (typeof val === 'bigint') {
            return val.toString();
        }
        return val;
    } catch (e) {
        console.warn("SCVal parsing failed:", e);
        return null;
    }
}

// ─── Contract Calls ──────────────────────────────────────────────────────────

// Read contract counter value (no auth needed)
export async function getCount() {
    if (!CONTRACT_ID || CONTRACT_ID === "YOUR_DEPLOYED_CONTRACT_ID_HERE") return 0;

    try {
        const contract = new Contract(CONTRACT_ID);
        const tx = new TransactionBuilder(DUMMY_ACCOUNT, {
            fee: "100",
            networkPassphrase: NETWORK_PASSPHRASE
        })
            .addOperation(contract.call("get_count"))
            .setTimeout(30)
            .build();

        const result = await rpcServer.simulateTransaction(tx);

        if (SorobanRpc.Api.isSimulationError(result)) {
            console.error("FULL SIM ERROR (getCount):", JSON.stringify(result, null, 2));
            if (JSON.stringify(result).includes("HostError: Error(Storage, MissingValue)")) {
                throw new Error("Contract not found — needs redeployment");
            }
        }

        // v12 simulateTransaction returns result.result.retval
        if (!result.result || !result.result.retval) return 0;

        const val = safeNative(result.result.retval);
        return val !== null ? val : 0;
    } catch (err) {
        if (err.message === "Contract not found — needs redeployment") throw err;
        console.error("getCount failed:", err);
        return 0;
    }
}

// Read last user who incremented
export async function getLastUser() {
    if (!CONTRACT_ID || CONTRACT_ID === "YOUR_DEPLOYED_CONTRACT_ID_HERE") return null;

    try {
        const contract = new Contract(CONTRACT_ID);
        const tx = new TransactionBuilder(DUMMY_ACCOUNT, {
            fee: "100",
            networkPassphrase: NETWORK_PASSPHRASE
        })
            .addOperation(contract.call("get_last_user"))
            .setTimeout(30)
            .build();

        const result = await rpcServer.simulateTransaction(tx);

        if (!result.result || !result.result.retval) return null;

        const val = safeNative(result.result.retval);
        return val ? val.toString() : null;
    } catch (err) {
        console.error("getLastUser failed:", err);
        return null;
    }
}

// Build increment transaction (requires auth + signing)
export async function buildIncrementTx(publicKey) {
    if (!CONTRACT_ID || CONTRACT_ID === "YOUR_DEPLOYED_CONTRACT_ID_HERE") {
        throw new Error("Contract ID not set. Please deploy the contract first.");
    }

    const account = await server.loadAccount(publicKey);
    const contract = new Contract(CONTRACT_ID);

    // In v12, we can use nativeToScVal or just pass the address directly to let the SDK handle it.
    // However, some RPCs prefer explicit ScVal conversion.
    const userScVal = new Address(publicKey).toScVal();

    const tx = new TransactionBuilder(account, {
        fee: "1500", // Slightly higher fee for reliability
        networkPassphrase: NETWORK_PASSPHRASE,
    })
        .addOperation(contract.call("increment", userScVal))
        .setTimeout(60)
        .build();

    // Prepare transaction configures Soroban footprint and fees
    try {
        const preparedTx = await rpcServer.prepareTransaction(tx);
        return preparedTx.toXDR();
    } catch (err) {
        console.warn("prepareTransaction failed, checking simulation...", err.message);
        // Try to simulate to get the exact error payload if prepare fails
        const sim = await rpcServer.simulateTransaction(tx);
        if (SorobanRpc.Api.isSimulationError(sim)) {
            const simError = JSON.stringify(sim, null, 2);
            console.error("FULL SIM ERROR (increment):", simError);
            if (simError.includes("HostError: Error(Storage, MissingValue)")) {
                throw new Error("Contract not found — needs redeployment");
            }
        }
        throw err;
    }
}

// Build reset transaction (requires auth + signing)
export async function buildResetTx(publicKey) {
    if (!CONTRACT_ID || CONTRACT_ID === "YOUR_DEPLOYED_CONTRACT_ID_HERE") {
        throw new Error("Contract ID not set. Please deploy the contract first.");
    }

    const account = await server.loadAccount(publicKey);
    const contract = new Contract(CONTRACT_ID);
    const userScVal = new Address(publicKey).toScVal();

    const tx = new TransactionBuilder(account, {
        fee: "1500",
        networkPassphrase: NETWORK_PASSPHRASE,
    })
        .addOperation(contract.call("reset", userScVal))
        .setTimeout(60)
        .build();

    try {
        const preparedTx = await rpcServer.prepareTransaction(tx);
        return preparedTx.toXDR();
    } catch (err) {
        console.warn("prepareTransaction failed, checking simulation...", err.message);
        const sim = await rpcServer.simulateTransaction(tx);
        if (SorobanRpc.Api.isSimulationError(sim)) {
            const simError = JSON.stringify(sim, null, 2);
            console.error("FULL SIM ERROR (reset):", simError);
            if (simError.includes("HostError: Error(Storage, MissingValue)")) {
                throw new Error("Contract not found — needs redeployment");
            }
        }
        throw err;
    }
}

// Submit signed transaction
export async function submitSignedTx(signedXDR) {
    const tx = TransactionBuilder.fromXDR(signedXDR, NETWORK_PASSPHRASE);
    const result = await rpcServer.sendTransaction(tx);

    // v12 sendTransaction status check
    if (result.status === "ERROR") {
        throw new Error(`RPC Submission error: ${JSON.stringify(result.errorResultXdr || result)}`);
    }

    return result; // { hash, status }
}

// Poll transaction status until confirmed
export async function pollTxStatus(hash) {
    let attempts = 0;
    const maxAttempts = 30;

    while (attempts < maxAttempts) {
        try {
            const response = await rpcServer.getTransaction(hash);

            // Handle v12 Soroban response format
            if (response.status === "SUCCESS") {
                return response;
            } else if (response.status === "FAILED") {
                const errorMsg = response.resultXdr ? "Transaction failed on chain" : "Transaction failed (unknown reason)";
                throw new Error(errorMsg);
            } else if (response.status === "NOT_FOUND") {
                await new Promise(r => setTimeout(r, 2000));
                attempts++;
            } else {
                // Processing/PENDING
                await new Promise(r => setTimeout(r, 2000));
                attempts++;
            }
        } catch (err) {
            // "Bad union switch: 4" often occurs if the SDK version is slightly behind 
            // the RPC node's protocol (e.g., protocol 21/22 changes).
            // Since we know the tx might have succeeded on-chain, 
            // we catch the error and retry or check elsewhere.
            console.warn(`Polling error for hash ${hash}:`, err.message);
            
            // If it's a "Bad union switch", it's usually a parsing error for metadata, 
            // but the transaction itself might be successful.
            if (err.message.includes("Bad union switch")) {
                // We'll treat this as a potential success if it persists, 
                // but for now we just wait and retry.
                await new Promise(r => setTimeout(r, 2000));
                attempts++;
                continue;
            }
            throw err;
        }
    }
    throw new Error("Transaction polling timed out. The transaction might still succeed eventually.");
}
