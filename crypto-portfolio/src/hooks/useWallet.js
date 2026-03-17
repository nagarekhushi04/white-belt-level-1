// src/hooks/useWallet.js
import { useState, useCallback, useEffect } from 'react';
import { ethers } from 'ethers';

// ERC20 minimal ABI for balance & symbol
const ERC20_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)"
];

const DEMO_ACCOUNT = "0xDemoAccount1234567890abcdef1234567890abc";
const DEFAULT_TOKENS = [
  { address: 'eth', symbol: 'ETH', isNative: true },
  { address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', symbol: 'USDC', isNative: false },
  { address: '0x514910771af9ca656af840dff83e8264ecf986ca', symbol: 'LINK', isNative: false },
];

export function useWallet() {
  const [account, setAccount] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [tokens, setTokens] = useState(DEFAULT_TOKENS);
  const [balances, setBalances] = useState({});
  const [loadingBalances, setLoadingBalances] = useState(false);
  const [isDemo, setIsDemo] = useState(false);

  const checkWallet = useCallback(async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.listAccounts();
        if (accounts.length > 0) {
          setAccount(accounts[0].address);
          setIsDemo(false);
          return accounts[0].address;
        }
      } catch (err) {
        console.error("Auto conn error", err);
      }
    }
    return null;
  }, []);

  useEffect(() => {
    checkWallet();
  }, [checkWallet]);

  const connect = async () => {
    setIsConnecting(true);
    try {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        setAccount(accounts[0]);
        setIsDemo(false);
      } else {
        // Fallback to Demo Mode
        setAccount(DEMO_ACCOUNT);
        setIsDemo(true);
      }
    } catch (err) {
      console.error(err);
      // Fallback on reject
      setAccount(DEMO_ACCOUNT);
      setIsDemo(true);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = () => {
    setAccount(null);
    setIsDemo(false);
    setBalances({});
  };

  const addToken = async (address) => {
    if (tokens.find(t => t.address.toLowerCase() === address.toLowerCase())) return;

    if (isDemo || !window.ethereum) {
      // Demo mock token addition
      setTokens([...tokens, { address, symbol: 'CUSTOM', isNative: false }]);
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(address, ERC20_ABI, provider);
      const symbol = await contract.symbol();
      setTokens([...tokens, { address, symbol, isNative: false }]);
    } catch (err) {
      console.error("Failed to add token", err);
      throw new Error("Invalid token address or network issue.");
    }
  };

  const removeToken = (address) => {
    setTokens(tokens.filter(t => t.address.toLowerCase() !== address.toLowerCase()));
  };

  const fetchBalances = useCallback(async () => {
    if (!account) return;
    setLoadingBalances(true);

    try {
      if (isDemo || !window.ethereum) {
        // Mock balances
        const mockBals = {};
        tokens.forEach(t => {
          if (t.address === 'eth') mockBals[t.address] = 2.5;
          else if (t.symbol === 'USDC') mockBals[t.address] = 1250.0;
          else if (t.symbol === 'LINK') mockBals[t.address] = 450.0;
          else mockBals[t.address] = Math.floor(Math.random() * 100);
        });
        setBalances(mockBals);
        setLoadingBalances(false);
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const newBalances = {};

      for (const token of tokens) {
        try {
          if (token.isNative) {
            const bal = await provider.getBalance(account);
            newBalances[token.address] = parseFloat(ethers.formatEther(bal));
          } else {
            const contract = new ethers.Contract(token.address, ERC20_ABI, provider);
            const bal = await contract.balanceOf(account);
            const decimals = await contract.decimals();
            newBalances[token.address] = parseFloat(ethers.formatUnits(bal, decimals));
          }
        } catch (e) {
          console.error("Balance fetch failed for", token.address, e);
          newBalances[token.address] = 0;
        }
      }
      setBalances(newBalances);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingBalances(false);
    }
  }, [account, tokens, isDemo]);

  useEffect(() => {
    if (account) fetchBalances();
  }, [account, fetchBalances]);

  // Combine token info with balance
  const portfolioTokens = tokens.map(t => ({
    ...t,
    balance: balances[t.address] || 0
  }));

  return {
    account,
    isDemo,
    isConnecting,
    connect,
    disconnect,
    tokens: portfolioTokens,
    addToken,
    removeToken,
    loadingBalances,
    refreshBalances: fetchBalances
  };
}
