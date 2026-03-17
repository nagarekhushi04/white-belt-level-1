// src/components/LoadingSkeleton.jsx
import React from 'react';

export function LoadingSkeleton({ count = 3 }) {
  return (
    <div className="space-y-4 animate-pulse" data-testid="loading-skeleton">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="glass-card p-4 flex justify-between items-center opacity-70">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-slate-700/50"></div>
            <div className="space-y-2">
              <div className="h-4 w-24 bg-slate-700/50 rounded"></div>
              <div className="h-3 w-16 bg-slate-700/50 rounded"></div>
            </div>
          </div>
          <div className="space-y-2 text-right">
            <div className="h-4 w-20 bg-slate-700/50 rounded ml-auto"></div>
            <div className="h-3 w-12 bg-slate-700/50 rounded ml-auto"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
