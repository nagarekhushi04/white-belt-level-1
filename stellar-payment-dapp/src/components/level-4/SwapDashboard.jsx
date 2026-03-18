import React, { useState, useEffect } from 'react';

const SwapDashboard = ({ walletAddress, isConnected }) => {
  const [amountIn, setAmountIn] = useState('');
  const [estimatedOut, setEstimatedOut] = useState('0.00');
  const [reserves, setReserves] = useState({ a: 1000, b: 500 }); // Mocked from AMM logic $x*y=k$

  useEffect(() => {
    if (amountIn && !isNaN(amountIn)) {
      // amnt_out = (res_b * amnt_in) / (res_a + amnt_in)
      const input = parseFloat(amountIn);
      const output = (reserves.b * input) / (reserves.a + input);
      setEstimatedOut(output.toFixed(4));
    } else {
      setEstimatedOut('0.00');
    }
  }, [amountIn, reserves]);

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
              className="bg-transparent text-2xl font-semibold text-white w-full outline-none"
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

      {/* Reserves Info */}
      <div className="mt-6 space-y-2">
        <div className="flex justify-between text-xs text-slate-500">
          <span>Pool Liquidity (Reserves)</span>
          <span>{reserves.a} XLM / {reserves.b} TKNB</span>
        </div>
        <div className="flex justify-between text-xs text-slate-500">
          <span>Slippage Tolerance</span>
          <span>0.5%</span>
        </div>
      </div>

      {/* Action Button */}
      <button 
        className={`w-full mt-6 py-4 rounded-xl font-bold transition-all shadow-lg ${
          isConnected 
          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-600/20' 
          : 'bg-slate-800 text-slate-500 cursor-not-allowed'
        }`}
        disabled={!isConnected}
      >
        {isConnected ? `Swap XLM ↔ TokenB` : 'Connect Wallet to Swap'}
      </button>

      <div className="mt-4 text-[10px] text-center text-slate-600 uppercase tracking-[2px]">
        Constant Product $x \cdot y = k$ logic
      </div>
    </div>
  );
};

export default SwapDashboard;
