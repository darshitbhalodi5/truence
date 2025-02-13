"use client";

import { useWallet } from "@/hooks/use-wallet";
import { useState } from "react";
import { LogOut } from "lucide-react";
import {
  ClipboardDocumentIcon,
  ClipboardDocumentCheckIcon,
} from "@heroicons/react/24/outline";
import Symbol from "@/public/assets/symbol.png";
import Image from "next/image";

export function WalletConnect() {
  const { connect, disconnect, isConnected, user } = useWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleConnection = async () => {
    try {
      setIsLoading(true);
      await connect();
    } catch (error) {
      console.error("Wallet connection error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      setIsLoading(true);
      await disconnect();
    } catch (error) {
      console.error("Wallet disconnection error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const copyAddress = async () => {
    if (user?.wallet?.address) {
      await navigator.clipboard.writeText(user.wallet.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const truncateAddress = (address: string) => {
    return `${address?.slice(0, 6)}...${address?.slice(-4)}`;
  };

  return (
    <div className="container mx-auto flex justify-between items-center p-4 border border-white rounded-lg">
      <div className="flex items-center gap-2">
        <Image src={Symbol} alt="Truence Symbol" height={24} width={24} />
        <span className="text-2xl font-bold">Truence</span>
      </div>
      {/* Conditional Rendering for Wallet Connection */}
      {!isConnected ? (
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
          ) : (
            "Connect Wallet"
          )}
        </button>
      ) : (
        <div className="flex items-center gap-2">
          <button
            onClick={copyAddress}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg font-medium text-sm transition-all duration-200"
          >
            <span>
              {user?.wallet?.address
                ? truncateAddress(user.wallet.address)
                : ""}
            </span>
            {copied ? (
              <ClipboardDocumentCheckIcon className="w-5 h-5" color="black" />
            ) : (
              <ClipboardDocumentIcon className="w-5 h-5" color="black" />
            )}
          </button>

          <button
            onClick={handleDisconnect}
            className="p-2 rounded-lg bg-red-100 hover:bg-red-200 text-red-600 transition-all duration-200"
          >
            <LogOut size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
