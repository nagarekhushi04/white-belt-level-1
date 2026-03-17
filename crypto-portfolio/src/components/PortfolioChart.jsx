// src/components/PortfolioChart.jsx
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const COLORS = ['#6366f1', '#14b8a6', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4'];

export function PortfolioChart({ allocations, totalValue }) {
  if (!allocations || allocations.length === 0 || totalValue === 0) {
    return (
      <div className="glass-card flex items-center justify-center h-64 text-slate-500">
        Add tokens with balance to see chart
      </div>
    );
  }

  return (
    <div className="glass-card p-6 h-[400px] flex flex-col">
      <h3 className="font-semibold text-slate-200 mb-4">Allocation Breakdown</h3>
      <div className="flex-1 relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={allocations}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
              stroke="none"
              animationBegin={0}
              animationDuration={800}
            >
              {allocations.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value) => `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
              contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#f8fafc' }}
              itemStyle={{ color: '#e2e8f0' }}
            />
            <Legend 
              verticalAlign="bottom" 
              height={36}
              formatter={(value, entry) => (
                <span className="text-slate-300 font-medium ml-1">
                  {value} ({entry.payload.pct.toFixed(1)}%)
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
        
        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-8">
          <span className="text-xs text-slate-400 uppercase tracking-widest">Total</span>
          <span className="text-xl font-bold text-slate-200">
            ${totalValue >= 1000000 ? (totalValue/1000000).toFixed(2) + 'M' : totalValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </span>
        </div>
      </div>
    </div>
  );
}
