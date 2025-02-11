'use client';

import { useWallet } from '@/hooks/use-wallet';
import { useState } from 'react';

export function WalletConnect() {
  const { connect, disconnect, isConnected, user } = useWallet();
  const [isLoading, setIsLoading] = useState(false);

  const handleConnection = async () => {
    try {
      setIsLoading(true);
      if (isConnected) {
        await disconnect();
      } else {
        await connect();
      }
    } catch (error) {
      console.error('Wallet connection error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleConnection}
      disabled={isLoading}
      className="px-6 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium transition-all duration-200 disabled:opacity-50"
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          Connecting...
        </span>
      ) : isConnected ? (
        `${user?.wallet?.address?.slice(0, 6)}...${user?.wallet?.address?.slice(-4)}`
      ) : (
        'Connect Wallet'
      )}
    </button>
  );
} 