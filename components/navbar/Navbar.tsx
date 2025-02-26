"use client";
import React, { useState } from "react";
import { useWallet } from "@/hooks/use-wallet";
import { LogOut, Menu, X } from "lucide-react";
import {
  ClipboardDocumentIcon,
  ClipboardDocumentCheckIcon,
} from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { showCustomToast } from "@/components/custom-toast/CustomToast";

import Image from "next/image";

export function Navbar() {
  const { connect, disconnect, isConnected, user } = useWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

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

  const copyAddress = () => {
    if (user?.wallet?.address) {
      navigator.clipboard.writeText(user.wallet.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const navItems = [
    {
      label: "Dashboard",
      onClick: () => {
        if (!isConnected) {
          showCustomToast(
            "error",
            "Connect your wallet to view your dashboard"
          );
          return;
        }
        router.push("/dashboard");
        setMobileMenuOpen(false);
      },
    },
    {
      label: "Explore",
      onClick: () => {
        router.push("/bounties/explore");
        setMobileMenuOpen(false);
      },
    },
  ];

  const navigateToHome = () => {
    router.push("/");
    setMobileMenuOpen(false);
  };

  const WalletButton = () => {
    if (!isConnected) {
      return (
        <button
          onClick={handleConnection}
          disabled={isLoading}
          className="px-6 py-2 text-white font-medium"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Connecting...
            </div>
          ) : (
            "Connect"
          )}
        </button>
      );
    }

    return (
      <div className="flex items-center gap-2">
        <button
          onClick={copyAddress}
          className="flex items-center gap-2 px-4 py-2 text-white"
        >
          {user?.wallet?.address && (
            <>
              <span>{`${user.wallet.address.slice(
                0,
                6
              )}...${user.wallet.address.slice(-4)}`}</span>
              {copied ? (
                <ClipboardDocumentCheckIcon className="w-4 h-4" />
              ) : (
                <ClipboardDocumentIcon className="w-4 h-4" />
              )}
            </>
          )}
        </button>
        <button
          onClick={disconnect}
          className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-all duration-200"
          title="Disconnect Wallet"
        >
          <LogOut size={16} />
        </button>
      </div>
    );
  };

  return (
    <div className="bg-[#000108] container mx-auto p-4 border-b-2 border-b-[#99168E] rounded-b-none rounded-lg">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center justify-between w-full md:w-auto">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={navigateToHome}
          >
            <Image
              src="/assets/symbol.png"
              alt="Truence Symbol"
              height={24}
              width={24}
            />
            <span className="text-2xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Truence
            </span>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-white"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-4">
          <div className="flex gap-2">
            {navItems.map((item, index) => (
              <button
                key={index}
                onClick={item.onClick}
                className="flex items-center gap-2 px-4 py-2 text-white"
              >
                <span>{item.label}</span>
              </button>
            ))}
          </div>
          <WalletButton />
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden w-full space-y-2">
            {navItems.map((item, index) => (
              <button
                key={index}
                onClick={item.onClick}
                className="flex items-center gap-2 w-full px-4 py-2 text-white"
              >
                <span>{item.label}</span>
              </button>
            ))}
            <div className="pt-2">
              <WalletButton />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Navbar;
