'use client';

import { PrivyProvider } from '@privy-io/react-auth';
import { WagmiProvider, createConfig, http } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { arbitrum, arbitrumSepolia } from "viem/chains";
import { PrivyProviderWrapperProps } from "@/types/privyWrapper"

const wagmiConfig = createConfig({
    chains: [arbitrum, arbitrumSepolia],
    transports: {
        [arbitrum.id]: http(),
        [arbitrumSepolia.id]: http(),
    },
});

const queryClient = new QueryClient();

export function PrivyProviderWrapper({ children }: PrivyProviderWrapperProps) {
    return (
        <PrivyProvider
            appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
            config={{
                appearance: {
                    theme: 'dark',
                    accentColor: '#3B82F6',
                    logo: "./favicon.ico",
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
                loginMethods: ['wallet'],
                defaultChain: arbitrum,
                supportedChains: [arbitrum, arbitrumSepolia],
            }}
        >
            <QueryClientProvider client={queryClient}>
                <WagmiProvider config={wagmiConfig}>
                    {children}
                </WagmiProvider>
            </QueryClientProvider>
        </PrivyProvider>
    );
} 