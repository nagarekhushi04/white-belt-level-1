import React, { useState, useEffect, useCallback } from 'react';
import { getPoolReserves, buildSwapTx, buildAddLiquidityTx } from '../../utils/ammUtils';
import { submitSignedTx, pollTxStatus } from '../../utils/contractUtils';

const SwapDashboard = ({ walletAddress, isConnected, signTx, refreshBalance }) => {
  const [amountIn, setAmountIn] = useState('');
  const [estimatedOut, setEstimatedOut] = useState('0.00');
  const [reserves, setReserves] = useState({ a: 0, b: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [txStatus, setTxStatus] = useState(null); // null | 'pending' | 'success' | 'error'
  const [txMessage, setTxMessage] = useState('');
  const [txHash, setTxHash] = useState('');

  // Fetch reserves on mount and after each swap
  const fetchReserves = useCallback(async () => {
    const res = await getPoolReserves();
    setReserves(res);
  }, []);

  useEffect(() => {
    fetchReserves();
    const interval = setInterval(fetchReserves, 8000);
    return () => clearInterval(interval);
  }, [fetchReserves]);

  // Estimate output using constant product math
  useEffect(() => {
    if (amountIn && !isNaN(amountIn) && parseFloat(amountIn) > 0 && reserves.a > 0) {
      const input = parseFloat(amountIn);
      const output = (reserves.b * input) / (reserves.a + input);
      setEstimatedOut(output.toFixed(4));
    } else {
      setEstimatedOut('0.00');
    }
  }, [amountIn, reserves]);

  const needsLiquidity = reserves.a === 0 && reserves.b === 0;

  // Seed liquidity into the pool (first-time setup)
  const handleSeedLiquidity = async () => {
    if (!isConnected || !signTx) return;
    setIsLoading(true);
    setTxStatus('pending');
    setTxMessage('Seeding pool with 10,000 XLM / 5,000 TKNB...');
    try {
      const xdr = await buildAddLiquidityTx(walletAddress, 10000, 5000);
      const signedXDR = await signTx(xdr);
      const result = await submitSignedTx(signedXDR);
      setTxHash(result.hash);
      setTxMessage('Waiting for confirmation...');
      await pollTxStatus(result.hash);
      setTxStatus('success');
      setTxMessage('Pool seeded! Reserves are now live.');
      fetchReserves();
      if (refreshBalance) refreshBalance();
    } catch (err) {
      console.error('Seed liquidity failed:', err);
      setTxStatus('error');
      setTxMessage(err.message || 'Failed to seed liquidity');
    } finally {
      setIsLoading(false);
    }
  };

  // Execute swap on-chain
  const handleSwap = async () => {
    if (!isConnected || !signTx || !amountIn || parseFloat(amountIn) <= 0) return;
    setIsLoading(true);
    setTxStatus('pending');
    setTxMessage('Building swap transaction...');
    setTxHash('');
    try {
      const xdr = await buildSwapTx(walletAddress, Math.floor(parseFloat(amountIn)));
      setTxMessage('Please approve in wallet...');
      const signedXDR = await signTx(xdr);
      setTxMessage('Submitting to Stellar Testnet...');
      const result = await submitSignedTx(signedXDR);
      setTxHash(result.hash);
      setTxMessage('Confirming on-chain...');
      await pollTxStatus(result.hash);
      setTxStatus('success');
      setTxMessage(`Swapped ${amountIn} XLM → ~${estimatedOut} TKNB`);
      setAmountIn('');
      fetchReserves();
      if (refreshBalance) refreshBalance();
    } catch (err) {
      console.error('Swap failed:', err);
      setTxStatus('error');
      setTxMessage(err.message || 'Swap failed');
    } finally {
      setIsLoading(false);
    }
  };

  const priceImpact = amountIn && reserves.a > 0
    ? ((parseFloat(amountIn) / (reserves.a + parseFloat(amountIn))) * 100).toFixed(2)
    : '0.00';

  return (
    <div className="bg-[#1a1a2e] border border-blue-500/20 rounded-2xl p-6 shadow-xl max-w-md mx-auto mt-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <span>🔄</span> Swap Assets
        </h2>
        <span className="text-xs bg-blue-500/10 text-blue-400 px-2 py-1 rounded-full animate-pulse">
          Soroban Testnet
        </span>
      </div>

      {/* Transaction Status Banner */}
      {txStatus && (
        <div className={`mb-4 p-3 rounded-xl text-sm font-medium ${
          txStatus === 'pending' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' :
          txStatus === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
          'bg-red-500/10 text-red-400 border border-red-500/20'
        }`}>
          <div className="flex items-center gap-2">
            {txStatus === 'pending' && <span className="animate-spin">⏳</span>}
            {txStatus === 'success' && <span>✅</span>}
            {txStatus === 'error' && <span>❌</span>}
            <span>{txMessage}</span>
          </div>
          {txHash && (
            <a
              href={`https://stellar.expert/explorer/testnet/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-400 underline mt-1 block"
            >
              View on Stellar Explorer →
            </a>
          )}
          {txStatus !== 'pending' && (
            <button
              onClick={() => { setTxStatus(null); setTxMessage(''); setTxHash(''); }}
              className="text-xs mt-2 text-slate-500 hover:text-slate-300"
            >
              Dismiss
            </button>
          )}
        </div>
      )}

      {/* Empty Pool Warning / Seed Button */}
      {needsLiquidity && isConnected && (
        <div className="mb-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm">
          <p className="mb-2">⚠️ Pool is empty. Seed initial liquidity to enable swaps:</p>
          <button
            onClick={handleSeedLiquidity}
            disabled={isLoading}
            className="w-full py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-semibold text-sm transition-all disabled:opacity-50"
          >
            {isLoading ? '⏳ Seeding...' : '💧 Seed 10,000 XLM / 5,000 TKNB'}
          </button>
        </div>
      )}

      {/* Input Section */}
      <div className="space-y-4">
        <div className="bg-[#0f0f1a] p-4 rounded-xl border border-white/5 group hover:border-blue-500/30 transition-all">
          <label className="text-xs text-slate-400 uppercase tracking-wider mb-2 block">Sell XLM</label>
          <div className="flex items-center gap-3">
            <input
              type="number"
              value={amountIn}
              onChange={(e) => setAmountIn(e.target.value)}
              placeholder="0.00"
              min="1"
              disabled={isLoading || needsLiquidity}
              className="bg-transparent text-2xl font-semibold text-white w-full outline-none disabled:opacity-50"
            />
            <span className="bg-white/5 px-3 py-1 rounded-lg text-sm text-slate-300">XLM</span>
          </div>
        </div>

        {/* Swap Arrow Icon */}
        <div className="flex justify-center -my-2 relative z-10">
          <div className="bg-blue-500 p-2 rounded-xl text-white shadow-lg shadow-blue-500/50 hover:scale-110 transition-transform cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>

        {/* Output Section */}
        <div className="bg-[#0f0f1a] p-4 rounded-xl border border-white/5">
          <label className="text-xs text-slate-400 uppercase tracking-wider mb-2 block">Receive TokenB (Estimated)</label>
          <div className="flex items-center gap-3">
            <div className="text-2xl font-semibold text-blue-400 w-full">{estimatedOut}</div>
            <span className="bg-white/5 px-3 py-1 rounded-lg text-sm text-slate-300">TKNB</span>
          </div>
        </div>
      </div>

      {/* Reserves and Price Info */}
      <div className="mt-6 space-y-2">
        <div className="flex justify-between text-xs text-slate-500">
          <span>Pool Liquidity (On-Chain)</span>
          <span className={reserves.a > 0 ? 'text-green-400' : 'text-red-400'}>
            {reserves.a.toLocaleString()} XLM / {reserves.b.toLocaleString()} TKNB
          </span>
        </div>
        <div className="flex justify-between text-xs text-slate-500">
          <span>Price Impact</span>
          <span className={parseFloat(priceImpact) > 5 ? 'text-red-400' : 'text-slate-400'}>
            {priceImpact}%
          </span>
        </div>
        <div className="flex justify-between text-xs text-slate-500">
          <span>Slippage Tolerance</span>
          <span>0.5%</span>
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={handleSwap}
        className={`w-full mt-6 py-4 rounded-xl font-bold transition-all shadow-lg ${
          isConnected && !isLoading && !needsLiquidity && amountIn && parseFloat(amountIn) > 0
            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-600/20 active:scale-[0.98]'
            : 'bg-slate-800 text-slate-500 cursor-not-allowed'
        }`}
        disabled={!isConnected || isLoading || needsLiquidity || !amountIn || parseFloat(amountIn) <= 0}
      >
        {!isConnected
          ? 'Connect Wallet to Swap'
          : isLoading
          ? '⏳ Processing...'
          : needsLiquidity
          ? 'Pool Empty — Seed Liquidity First'
          : !amountIn || parseFloat(amountIn) <= 0
          ? 'Enter Amount'
          : `Swap ${amountIn} XLM → TokenB`}
      </button>

      <div className="mt-4 text-[10px] text-center text-slate-600 uppercase tracking-[2px]">
        Constant Product x · y = k · On-Chain AMM
      </div>
    </div>
  );
};

export default SwapDashboard;
