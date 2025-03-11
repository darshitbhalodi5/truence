"use client";

import { usePrivy } from "@privy-io/react-auth";
import { useCallback } from "react";

export function useWallet() {
  const {
    login,
    logout,
    authenticated,
    ready,
    user,
    connectWallet,
    sendTransaction,
  } = usePrivy();

  const handleConnect = useCallback(async () => {
    if (!authenticated) {
      await login();
    } else {
      await connectWallet();
    }
  }, [authenticated, login, connectWallet]);

  return {
    connect: handleConnect,
    disconnect: logout,
    isConnected: authenticated,
    isReady: ready,
    user,
    sendTransaction,
  };
}
