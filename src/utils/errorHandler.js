export function parseWalletError(error) {
    const msg = error?.message || error?.toString() || ""
    const lower = msg.toLowerCase()
    
    if (msg === "USER_REJECTED" || lower.includes("rejected") || lower.includes("declined") || lower.includes("cancel")) {
        return { code: "USER_REJECTED", message: "You rejected the transaction in your wallet." }
    }
    if (lower.includes("not found") || lower.includes("not installed")) {
        return { code: "WALLET_NOT_FOUND", message: "Wallet extension not found. Please install Freighter or xBull." }
    }
    if (lower.includes("insufficient") || lower.includes("balance")) {
        return { code: "INSUFFICIENT_BALANCE", message: "Insufficient XLM balance for this transaction (including fees)." }
    }
    if (lower.includes("timeout")) {
        return { code: "TIMEOUT", message: "The operation timed out. Please try again." }
    }
    
    return { code: "WALLET_ERROR", message: `Wallet Error: ${msg.slice(0, 100)}` }
}

export function parseContractError(error) {
    // Log the full error to the console so it can be inspected in DevTools
    console.error("RPC Error Details:", error);
    const msg = error?.message || error?.toString?.() || ""
    const lower = msg.toLowerCase()

    if (msg === "USER_REJECTED" || lower.includes("rejected")) {
        return "Transaction rejected by user."
    }

    // Check for explicit panic strings from our contract
    if (lower.includes("maxreached")) return 'Counter limit reached (max 10).'
    if (lower.includes("repeatusernotallowed")) return 'You cannot increment twice in a row.'
    if (lower.includes("unauthorizedreset")) return 'Reset not allowed.'
    
    // SDK/Network errors
    if (lower.includes("network") || lower.includes("fetch") || lower.includes("horizon")) {
        return "Network connection issue. Please check your internet or Stellar Testnet status."
    }

    if (msg.includes("Bad union switch") || msg.includes("union switch")) {
        return "Transaction Simulation Failed: The contract rejected the call. Check if you have enough XLM for fees."
    }

    if (lower.includes("hosterror") && lower.includes("auth")) {
        return "Authorization Failed: Ensure your wallet is connected correctly."
    }
    
    if (lower.includes("timeout")) {
        return "Transaction timed out during polling. It may still succeed soon."
    }

    // Default fallback
    return `Contract Error: ${msg.slice(0, 150)}${msg.length > 150 ? '...' : ''}`
}
