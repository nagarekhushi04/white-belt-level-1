// src/tests/TokenList.test.jsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { TokenList } from '../components/TokenList';

describe('TokenList', () => {
  it('renders empty state when no tokens', () => {
    render(<TokenList tokens={[]} prices={{}} onRemove={() => {}} />);
    expect(screen.getByText('No tokens found. Add one above.')).toBeInTheDocument();
  });

  it('renders tokens with balances and calculated USD values', () => {
    const tokens = [
      { address: 'eth', symbol: 'ETH', balance: 2, isNative: true }
    ];
    const prices = { eth: 3000 };
    
    render(<TokenList tokens={tokens} prices={prices} onRemove={() => {}} />);
    
    expect(screen.getByText('ETH')).toBeInTheDocument();
    expect(screen.getByText('$6,000.00')).toBeInTheDocument(); // 2 * 3000
    expect(screen.getByText(/2 ETH/)).toBeInTheDocument();
  });

  it('displays cached badge when isCached is true', () => {
    const tokens = [{ address: 'eth', symbol: 'ETH', balance: 1 }];
    
    const { rerender } = render(
      <TokenList tokens={tokens} prices={{}} onRemove={() => {}} isCached={false} />
    );
    expect(screen.queryByText('Cached')).not.toBeInTheDocument();

    rerender(<TokenList tokens={tokens} prices={{}} onRemove={() => {}} isCached={true} />);
    expect(screen.getByText('Cached')).toBeInTheDocument();
  });
});
