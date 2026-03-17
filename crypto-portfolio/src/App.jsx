import React from 'react';
import { usePortfolio } from './hooks/usePortfolio';
import { ErrorBoundary } from './components/ErrorBoundary';
import { WalletConnect } from './components/WalletConnect';
import { AddTokenForm } from './components/AddTokenForm';
import { TokenList } from './components/TokenList';
import { PortfolioChart } from './components/PortfolioChart';
import { LoadingSkeleton } from './components/LoadingSkeleton';
import { Activity } from 'lucide-react';

function App() {
  const {
    account,
    isDemo,
    tokens,
    addToken,
    removeToken,
    connect,
    disconnect,
    prices,
    totalValue,
    allocations,
    loading,
    error,
    isCached,
    refetch,
  } = usePortfolio();

  return (
    <div className="min-h-screen p-4 md:p-8 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-indigo-600/20 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-5xl mx-auto space-y-6 relative z-10">
        
        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-center bg-slate-800/40 backdrop-blur-md p-4 rounded-2xl border border-slate-700/50 shadow-lg">
          <div className="flex items-center gap-3 mb-4 sm:mb-0">
            <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg shadow-indigo-500/30">
              <Activity className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-100 tracking-tight">
                Defi<span className="text-indigo-400">Track</span>
              </h1>
              <p className="text-xs text-slate-400">Web3 Portfolio Dashboard</p>
            </div>
          </div>
          <WalletConnect
            account={account}
            isDemo={isDemo}
            connect={connect}
            disconnect={disconnect}
            isConnecting={false}
          />
        </header>

        {error && (
          <div className="bg-rose-500/10 border border-rose-500/20 text-rose-300 px-4 py-3 rounded-xl flex items-center justify-between">
            <span>{error}</span>
            <button onClick={refetch} className="text-sm bg-rose-500/20 hover:bg-rose-500/30 px-3 py-1 rounded transition">Retry</button>
          </div>
        )}

        <main className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column: Tokens */}
          <div className="lg:col-span-2 space-y-6">
            <ErrorBoundary>
              <div className="glass-card p-6">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-3xl font-bold tracking-tight text-white mb-1">
                      ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </h2>
                    <p className="text-sm text-emerald-400 font-medium">+0.00% (24h)</p>
                  </div>
                </div>

                <AddTokenForm onAdd={addToken} />
                
                {loading ? (
                  <LoadingSkeleton count={3} />
                ) : (
                  <TokenList 
                    tokens={tokens} 
                    prices={prices} 
                    onRemove={removeToken}
                    isCached={isCached}
                  />
                )}
              </div>
            </ErrorBoundary>
          </div>

          {/* Right Column: Chart */}
          <div className="lg:col-span-1 space-y-6">
            <ErrorBoundary>
              {loading ? (
                <div className="glass-card p-6 h-[400px] flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
                </div>
              ) : (
                <PortfolioChart allocations={allocations} totalValue={totalValue} />
              )}
            </ErrorBoundary>
            
            <div className="glass-card p-5 text-sm text-slate-400">
              <h4 className="font-semibold text-slate-300 mb-2">How it works</h4>
              <ul className="list-disc pl-4 space-y-1">
                <li>Connects to MetaMask via <span className="text-slate-300">ethers.js</span></li>
                <li>Fetches live prices from <span className="text-slate-300">CoinGecko</span></li>
                <li>Caches prices for 60s to avoid rate limits</li>
                <li>Falls back to demo mode if no wallet is found</li>
              </ul>
            </div>
          </div>
          
        </main>
      </div>
    </div>
  );
}

export default App;
