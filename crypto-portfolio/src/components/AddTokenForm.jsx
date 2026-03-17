// src/components/AddTokenForm.jsx
import React, { useState } from 'react';
import { Plus, Search } from 'lucide-react';

export function AddTokenForm({ onAdd }) {
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!address.trim()) return;
    
    setLoading(true);
    setError('');
    
    try {
      await onAdd(address.trim());
      setAddress('');
    } catch (err) {
      setError(err.message || 'Failed to add token');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="relative flex items-center">
        <div className="absolute left-4 text-slate-400">
          <Search size={18} />
        </div>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Add custom ERC20 contract address..."
          className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl py-3 pl-12 pr-32 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-mono text-sm"
        />
        <button
          type="submit"
          disabled={loading || !address.trim()}
          className="absolute right-2 px-4 py-1.5 bg-indigo-500 hover:bg-indigo-400 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
        >
          {loading ? 'Adding...' : <><Plus size={16} /> Add</>}
        </button>
      </div>
      {error && <p className="text-rose-400 text-sm mt-2 ml-2">{error}</p>}
    </form>
  );
}
