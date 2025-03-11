"use client";

import { PrivyProvider } from "@privy-io/react-auth";
import { WagmiProvider, createConfig, http } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { mainnet } from "viem/chains";
import { PrivyProviderWrapperProps } from "@/types/privyWrapper";

const wagmiConfig = createConfig({
  chains: [mainnet],
  transports: {
    [mainnet.id]: http(),
  },
});

const queryClient = new QueryClient();

export function PrivyProviderWrapper({ children }: PrivyProviderWrapperProps) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
      config={{
        appearance: {
          theme: "dark",
          landingHeader: "Welcome to Truence",
          loginMessage: "Connect your wallet to get started",
          accentColor: "#99168E",
          logo: "./favicon.ico",
          showWalletLoginFirst: true,
          walletList: [
            "metamask",
            "phantom",
            "coinbase_wallet",
            "uniswap",
            "wallet_connect",
            "rabby_wallet",
            "safe",
          ],
        },
        loginMethods: ["wallet"],
        defaultChain: mainnet,
        supportedChains: [mainnet],
      }}
    >
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={wagmiConfig}>{children}</WagmiProvider>
      </QueryClientProvider>
    </PrivyProvider>
  );
}
