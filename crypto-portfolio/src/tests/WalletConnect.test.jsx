// src/tests/WalletConnect.test.jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { WalletConnect } from '../components/WalletConnect';

describe('WalletConnect', () => {
  it('renders Connect button when no account is provided', () => {
    const connectMock = vi.fn();
    render(<WalletConnect account={null} connect={connectMock} />);
    
    const button = screen.getByText('Connect Wallet');
    expect(button).toBeInTheDocument();
    
    fireEvent.click(button);
    expect(connectMock).toHaveBeenCalledTimes(1);
  });

  it('shows loader when connecting', () => {
    render(<WalletConnect account={null} isConnecting={true} />);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('renders account abbreviation when connected', () => {
    const disconnectMock = vi.fn();
    const account = "0x1234567890abcdef1234567890abcdef12345678";
    
    render(<WalletConnect account={account} disconnect={disconnectMock} isDemo={false} />);
    
    expect(screen.getByText('0x1234...5678')).toBeInTheDocument();
    
    const button = screen.getByTitle('Disconnect');
    fireEvent.click(button);
    expect(disconnectMock).toHaveBeenCalledTimes(1);
  });

  it('shows demo badge if isDemo is true', () => {
    const account = "0xDemoAccount";
    render(<WalletConnect account={account} isDemo={true} />);
    
    expect(screen.getByText('Demo Mode')).toBeInTheDocument();
  });
});
