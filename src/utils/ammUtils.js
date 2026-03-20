import { Contract, TransactionBuilder, Address, SorobanRpc, Account, nativeToScVal, scValToNative } from "@stellar/stellar-sdk";
import { rpcServer, server } from "./stellar.js";
import { POOL_CONTRACT_ID, FACTORY_CONTRACT_ID, NETWORK_PASSPHRASE } from "../config.js";

const DUMMY_ACCOUNT = new Account("GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF", "0");

/**
 * Fetch the current (reserveA, reserveB) from the on-chain AMM Pool.
 */
export async function getPoolReserves() {
    try {
        const contract = new Contract(POOL_CONTRACT_ID);
        const tx = new TransactionBuilder(DUMMY_ACCOUNT, {
            fee: "100",
            networkPassphrase: NETWORK_PASSPHRASE,
        })
            .addOperation(contract.call("get_reserves"))
            .setTimeout(30)
            .build();

        const result = await rpcServer.simulateTransaction(tx);

        if (SorobanRpc.Api.isSimulationError(result)) {
            console.error("Simulation error (get_reserves):", JSON.stringify(result, null, 2));
            return { a: 0, b: 0 };
        }

        if (!result.result || !result.result.retval) return { a: 0, b: 0 };

        const raw = scValToNative(result.result.retval);
        // raw is typically [bigint, bigint] or [string, string]
        const a = typeof raw[0] === "bigint" ? Number(raw[0]) : Number(raw[0]);
        const b = typeof raw[1] === "bigint" ? Number(raw[1]) : Number(raw[1]);
        return { a, b };
    } catch (err) {
        console.error("getPoolReserves failed:", err);
        return { a: 0, b: 0 };
    }
}

/**
 * Build the add_liquidity transaction to seed the pool.
 */
export async function buildAddLiquidityTx(publicKey, amountA, amountB) {
    const account = await server.loadAccount(publicKey);
    const contract = new Contract(POOL_CONTRACT_ID);

    const tx = new TransactionBuilder(account, {
        fee: "2000",
        networkPassphrase: NETWORK_PASSPHRASE,
    })
        .addOperation(
            contract.call(
                "add_liquidity",
                new Address(publicKey).toScVal(),
                nativeToScVal(BigInt(amountA), { type: "u128" }),
                nativeToScVal(BigInt(amountB), { type: "u128" })
            )
        )
        .setTimeout(60)
        .build();

    const prepared = await rpcServer.prepareTransaction(tx);
    return prepared.toXDR();
}

/**
 * Build the swap_a_to_b transaction.
 */
export async function buildSwapTx(publicKey, amountIn) {
    const account = await server.loadAccount(publicKey);
    const contract = new Contract(POOL_CONTRACT_ID);

    const tx = new TransactionBuilder(account, {
        fee: "2000",
        networkPassphrase: NETWORK_PASSPHRASE,
    })
        .addOperation(
            contract.call(
                "swap_a_to_b",
                new Address(publicKey).toScVal(),
                nativeToScVal(BigInt(amountIn), { type: "u128" })
            )
        )
        .setTimeout(60)
        .build();

    const prepared = await rpcServer.prepareTransaction(tx);
    return prepared.toXDR();
}
