import { ArbitrumWatchdogInfo } from "@/components/arbitrum-watchdog/Information";
import { ArbitrumWatchdogRules } from "@/components/arbitrum-watchdog/Rules";
import { ArbitrumWatchdogScope } from "@/components/arbitrum-watchdog/Scope";
import { EthereumInfo } from "@/components/ethereum/Information";
import { EthereumRules } from "@/components/ethereum/Rules";
import { EthereumScope } from "@/components/ethereum/Scope";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const componentsMap: any = {
  "arbitrum-watchdog": [
    ArbitrumWatchdogInfo,
    ArbitrumWatchdogRules,
    ArbitrumWatchdogScope,
  ],
  "ethereum": [EthereumInfo, EthereumRules, EthereumScope], // Add more mappings if needed
};