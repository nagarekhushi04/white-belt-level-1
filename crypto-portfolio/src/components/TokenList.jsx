// src/components/TokenList.jsx
import React from 'react';
import { Trash2, AlertCircle } from 'lucide-react';

export function TokenList({ tokens, prices, onRemove, isCached }) {
  if (tokens.length === 0) {
    return (
      <div className="text-center py-10 px-4 glass-card">
        <p className="text-slate-400">No tokens found. Add one above.</p>
      </div>
    );
  }

  return (
    <div className="glass-card overflow-hidden">
      {/* Header with Title and Cache Badge */}
      <div className="flex justify-between items-center px-6 py-4 border-b border-slate-700/50 bg-slate-800/30">
        <h3 className="font-semibold text-slate-200">Your Assets</h3>
        {isCached && (
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 text-xs font-medium uppercase tracking-wider border border-emerald-500/20" title="Prices loaded from local cache (60s TTL)">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Cached
          </span>
        )}
      </div>

      <div className="divide-y divide-slate-700/30">
        {tokens.map((token) => {
          const rawPrice = prices[token.address.toLowerCase()] || 0;
          const value = token.balance * rawPrice;
          
          return (
            <div key={token.address} className="flex items-center justify-between p-4 hover:bg-slate-800/40 transition-colors group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-300 font-bold border border-indigo-500/30">
                  {token.symbol[0]}
                </div>
                <div>
                  <h4 className="font-bold text-slate-200">{token.symbol}</h4>
                  <p className="text-xs text-slate-400 font-mono" title={token.address}>
                    {token.isNative ? 'Native' : `${token.address.slice(0, 6)}...${token.address.slice(-4)}`}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <div className="font-semibold text-slate-200">
                    {value > 0 ? `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '$0.00'}
                  </div>
                  <div className="text-xs text-slate-400">
                    {token.balance.toLocaleString(undefined, { maximumFractionDigits: 6 })} {token.symbol}
                    {rawPrice > 0 ? ` @ $${rawPrice.toLocaleString()}` : ' (No price data)'}
                  </div>
                </div>
                
                <button
                  onClick={() => onRemove(token.address)}
                  className="opacity-0 group-hover:opacity-100 p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-400/10 rounded-lg transition-all"
                  title="Remove token"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
