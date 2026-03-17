import React, { useState, useEffect, useCallback } from 'react';
import { getCount, getLastUser, buildIncrementTx, buildResetTx, submitSignedTx, pollTxStatus } from '../utils/contractUtils';
import { checkSufficientBalance, fundWithFriendbot } from '../utils/stellar';
import { parseContractError } from '../utils/errorHandler';
import { CONTRACT_ID } from '../config';

/**
 * ContractCard
 * Shows a counter fetched from a Soroban Smart Contract, and allows users
 * to increment it, tracking whoever incremented it last.
 * 
 * Props:
 *   publicKey    - string | null 
 *   signTx       - function to sign transactions (from useWallet)
 *   txTracker    - { setLoading, setSuccess, setFailed }
 */
export default function ContractCard({ publicKey, signTx, txTracker, ensureWalletConnected, isAlive }) {
    const [count, setCount] = useState(0);
    const [lastUser, setLastUser] = useState(null);
    const [isLoadingData, setIsLoadingData] = useState(false);
    const [isTransacting, setIsTransacting] = useState(false);
    const [fundingStatus, setFundingStatus] = useState(null);
    const [isExpired, setIsExpired] = useState(false);

    const [error, setError] = useState(null);

    // Fetch initial data
    const refreshData = useCallback(async () => {
        setIsLoadingData(true);
        setError(null);
        try {
            const currentCount = await getCount();
            const latestUser = await getLastUser();
            setCount(currentCount);
            setLastUser(latestUser);
            setIsExpired(false);
        } catch (err) {
            if (err.message === "Contract not found — needs redeployment") {
                setIsExpired(true);
            } else {
                setError("Failed to read contract data. The contract might not be deployed yet.");
            }
        } finally {
            setIsLoadingData(false);
        }
    }, [CONTRACT_ID]);

    // Initial load
    useEffect(() => {
        refreshData();
    }, [refreshData]);

    const handleReset = async () => {
        setIsTransacting(true);
        setError(null);
        setFundingStatus(null);

        if (txTracker.setLoading) txTracker.setLoading();

        try {
            await ensureWalletConnected();
            
            setFundingStatus('Checking XLM balance...');
            await checkSufficientBalance(publicKey, 1);
            setFundingStatus(null);

            const xdr = await buildResetTx(publicKey);
            const signedXdr = await signTx(xdr);
            const result = await submitSignedTx(signedXdr);
            const response = await pollTxStatus(result.hash);

            if (response.status === "SUCCESS") {
                if (txTracker.setSuccess) txTracker.setSuccess(response.hash);
                await refreshData();
            } else {
                throw new Error("Reset transaction failed on the network.");
            }
        } catch (err) {
            console.error("Reset failed:", err);
            handleTransactionError(err);
        } finally {
            setIsTransacting(false);
        }
    };

    const handleIncrement = async () => {
        setIsTransacting(true);
        setError(null);
        setFundingStatus(null);

        if (txTracker.setLoading) txTracker.setLoading();

        try {
            await ensureWalletConnected();

            // 1. Strict Balance Check
            setFundingStatus('Checking XLM balance...');
            await checkSufficientBalance(publicKey, 1);
            setFundingStatus(null);

            // 2. Build the transaction using the Soroban SDK
            const xdr = await buildIncrementTx(publicKey);

            // 3. Request user to sign it via Wallet
            const signedXdr = await signTx(xdr);

            // 4. Submit the signed transaction to the Stellar Network
            const result = await submitSignedTx(signedXdr);

            // 5. Poll for ledger inclusion and contract execution success
            const response = await pollTxStatus(result.hash);

            if (response.status === "SUCCESS") {
                if (txTracker.setSuccess) txTracker.setSuccess(response.hash);
                await refreshData();
            } else {
                throw new Error("Transaction failed on the network.");
            }
        } catch (err) {
            console.error("Increment failed:", err);
            handleTransactionError(err);
        } finally {
            setIsTransacting(false);
        }
    };

    const handleTransactionError = (err) => {
        let msg = parseContractError(err);
        
        // Enhance explicit errors
        if (msg.includes("Contract rejected") || msg.toLowerCase().includes("simulation failed")) {
             console.error("Simulation Failure Payload:", err);
             msg = `Contract simulation failed. Address: ${CONTRACT_ID}. Check if your inputs are valid.`;
        }
        
        if (txTracker.setFailed) txTracker.setFailed(msg);
        setError(msg);
    };

    const handleManualFund = async () => {
         setIsTransacting(true);
         setError(null);
         setFundingStatus("⏳ Requesting funds from Friendbot...");
         try {
             await fundWithFriendbot(publicKey);
             setFundingStatus("✅ Successfully funded 10,000 XLM!");
             // Clear after 3s
             setTimeout(() => setFundingStatus(null), 3000);
         } catch(err) {
             setError("Friendbot funding failed: " + err.message);
             setFundingStatus(null);
         } finally {
             setIsTransacting(false);
         }
    };

    const isDeployed = CONTRACT_ID && CONTRACT_ID !== "YOUR_DEPLOYED_CONTRACT_ID_HERE";

    return (
        <div className="card" style={{ marginTop: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h2 style={{ fontSize: '1rem', fontWeight: 600, color: '#e8e8f0', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                    <span>🔢</span> On-Chain Counter
                </h2>
                <div style={{
                    fontSize: '0.65rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    fontWeight: 700,
                    padding: '3px 8px',
                    borderRadius: '12px',
                    background: 'rgba(155, 89, 244, 0.15)',
                    color: '#c29aff',
                    border: '1px solid rgba(155, 89, 244, 0.3)'
                }}>
                    Soroban Contract
                </div>
            </div>

            {!isDeployed ? (
                <div style={{ padding: '20px', textAlign: 'center', background: 'rgba(255,215,64,0.05)', borderRadius: '8px', border: '1px solid rgba(255,215,64,0.2)' }}>
                    <p style={{ color: '#ffd740', fontSize: '0.875rem', margin: 0 }}>
                        Contract not deployed yet! See Step 4 of the tutorial.
                    </p>
                </div>
            ) : isExpired ? (
                <div style={{ padding: '20px', textAlign: 'center', background: 'rgba(255, 82, 82, 0.1)', borderRadius: '8px', border: '1px solid rgba(255, 82, 82, 0.3)', marginBottom: '16px' }}>
                     <h3 style={{ color: '#ff5252', fontSize: '1rem', margin: '0 0 8px 0', fontWeight: 600 }}>⚠️ Contract Expired — Redeploy</h3>
                     <p style={{ color: '#ffb3b3', fontSize: '0.85rem', margin: 0, lineHeight: 1.4 }}>
                         The Stellar Testnet resets periodically, wiping all data. The contract <code>{CONTRACT_ID.slice(0, 4)}...{CONTRACT_ID.slice(-4)}</code> no longer exists on-chain.
                     </p>
                     <p style={{ color: '#8888aa', fontSize: '0.8rem', marginTop: '12px' }}>
                         Run <code>./scripts/deploy.sh</code> in your terminal and update the <b>CONTRACT_ID</b> to fix this!
                     </p>
                </div>
            ) : (
                <>
                    {/* Contract State Viewer */}
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '24px 16px',
                        background: 'rgba(255,255,255,0.02)',
                        borderRadius: '12px',
                        border: '1px solid rgba(255,255,255,0.05)',
                        marginBottom: '20px',
                        position: 'relative'
                    }}>

                        <button
                            onClick={refreshData}
                            disabled={isLoadingData || isTransacting}
                            style={{
                                position: 'absolute',
                                top: '10px',
                                right: '10px',
                                background: 'transparent',
                                border: 'none',
                                color: '#8888aa',
                                cursor: (isLoadingData || isTransacting) ? 'not-allowed' : 'pointer',
                                padding: '4px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'color 0.2s',
                                opacity: (isLoadingData || isTransacting) ? 0.5 : 1
                            }}
                            title="Refresh Data"
                        >
                            🔄
                        </button>

                        <div style={{ fontSize: '0.8rem', color: '#8888aa', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                            Current Count
                        </div>

                        {isLoadingData && !isTransacting ? (
                            <div className="skeleton" style={{ width: '60px', height: '48px', borderRadius: '8px', margin: '8px 0' }}></div>
                        ) : (
                            <div style={{
                                fontSize: '3.5rem',
                                fontWeight: 800,
                                lineHeight: 1,
                                margin: '8px 0',
                                color: '#e8e8f0',
                                textShadow: '0 0 20px rgba(0,212,255,0.3)'
                            }}>
                                {count}
                            </div>
                        )}

                        <div style={{ fontSize: '0.8rem', color: '#555577', marginTop: '4px', fontFamily: 'monospace' }}>
                            Last user: {lastUser ? `${lastUser.slice(0, 4)}...${lastUser.slice(-4)}` : "None"}
                        </div>
                    </div>

                    {fundingStatus && (
                        <div style={{ marginBottom: '12px', textAlign: 'center', padding: '8px 12px', background: 'rgba(0,212,255,0.06)', borderRadius: '8px', border: '1px solid rgba(0,212,255,0.2)' }}>
                            <p style={{ color: '#00d4ff', fontSize: '0.8rem', margin: 0 }}>
                                ⏳ {fundingStatus}
                            </p>
                        </div>
                    )}

                    {error && (
                        <div style={{ marginBottom: '16px', textAlign: 'center' }}>
                            <p style={{ color: '#ff5252', fontSize: '0.85rem', margin: '0 0 8px 0', lineHeight: 1.4 }}>
                                {error}
                            </p>
                            
                            {error.toLowerCase().includes('wallet') && (
                                <button
                                    className="btn btn-ghost"
                                    onClick={ensureWalletConnected}
                                    style={{ fontSize: '0.75rem', padding: '6px 12px', marginRight: '8px' }}
                                >
                                    🔄 Reconnect Wallet
                                </button>
                            )}

                            {error.toLowerCase().includes('insufficient xlm') && (
                                 <button
                                     onClick={handleManualFund}
                                     disabled={isTransacting}
                                     style={{
                                         fontSize: '0.75rem', 
                                         padding: '6px 12px',
                                         background: 'rgba(0, 212, 255, 0.1)',
                                         color: '#00d4ff',
                                         border: '1px solid rgba(0, 212, 255, 0.3)',
                                         borderRadius: '8px',
                                         cursor: isTransacting ? 'not-allowed' : 'pointer',
                                         transition: 'all 0.2s',
                                     }}
                                 >
                                     💸 Fund with Friendbot
                                 </button>
                            )}
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button
                            className="btn btn-primary"
                            onClick={handleIncrement}
                            disabled={isTransacting || isLoadingData || !publicKey}
                            style={{
                                background: (!publicKey || isTransacting) ? '' : 'linear-gradient(135deg, #7c3aed 0%, #db2777 100%)',
                                boxShadow: (!publicKey || isTransacting) ? '' : '0 4px 15px rgba(219, 39, 119, 0.3)',
                                flex: 1
                            }}
                        >
                            {isTransacting ? (
                                <><span className="spinner" /> Executing...</>
                            ) : publicKey ? (
                                '➕ Increment Counter'
                            ) : (
                                'Connect Wallet to Interact'
                            )}
                        </button>

                        <button
                            className="btn"
                            onClick={handleReset}
                            disabled={isTransacting || isLoadingData || !publicKey}
                            style={{
                                background: 'rgba(255,255,255,0.05)',
                                color: '#8888aa',
                                border: '1px solid rgba(255,255,255,0.1)',
                                fontSize: '0.875rem',
                                padding: '0 16px'
                            }}
                            title="Reset counter to 0"
                        >
                            Reset
                        </button>
                    </div>

                    {!publicKey && (
                        <p style={{ textAlign: 'center', color: '#8888aa', fontSize: '0.75rem', marginTop: '10px' }}>
                            You can view the state, but must connect to increment.
                        </p>
                    )}
                </>
            )}
        </div>
    );
}
