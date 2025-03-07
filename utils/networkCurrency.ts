export const NETWORK_CURRENCIES: { [key: string]: string } = {
  Arbitrum: "ARB",
  "Arbitrum Watchdog": "ARB",
  Solana: "SOL",
  Optimism: "OP",
  Ethereum: "ETH",
  Polygon: "POL",
  Base: "ETH",
  Aave: "AAVE",
  Pendle: "PENDLE",
  Uniswap: "UNI",
  GMX: "GMX",
  Default: "USDC",
};

export const getCurrency = (networkName: string) => {
  return NETWORK_CURRENCIES[networkName] || NETWORK_CURRENCIES.Default;
};

export const formatRewardNumber = (rewards: number): string => {
  if (rewards >= 1_000_000) {
    return (rewards / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  } else if (rewards >= 1_000) {
    return (rewards / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
  }
  return rewards.toString();
};
