// src/components/WalletConnect.jsx
import React from 'react';
import { Wallet, LogOut, Loader2 } from 'lucide-react';

export function WalletConnect({ account, isDemo, isConnecting, connect, disconnect }) {
  if (account) {
    return (
      <div className="flex items-center gap-3 bg-slate-800/80 px-4 py-2 rounded-full border border-slate-700/50">
        <div className="flex flex-col items-end">
          <span className="text-sm font-medium text-slate-200">
            {account.slice(0, 6)}...{account.slice(-4)}
          </span>
          {isDemo && (
            <span className="text-[10px] uppercase tracking-wider text-amber-400 font-bold bg-amber-400/10 px-1.5 rounded">
              Demo Mode
            </span>
          )}
        </div>
        <button
          onClick={disconnect}
          className="p-1.5 hover:bg-slate-700 rounded-full transition-colors text-slate-400 hover:text-rose-400"
          title="Disconnect"
        >
          <LogOut size={16} />
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={connect}
      disabled={isConnecting}
      className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-5 py-2.5 rounded-full font-medium transition-all shadow-lg hover:shadow-indigo-500/25 active:scale-95 disabled:opacity-75"
    >
      {isConnecting ? <Loader2 size={18} className="animate-spin" /> : <Wallet size={18} />}
      <span>Connect Wallet</span>
    </button>
  );
}
