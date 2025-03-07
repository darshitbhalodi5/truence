import { ArbitrumWatchdogInfo } from "@/components/arbitrum-watchdog/Information";
import { ArbitrumWatchdogRules } from "@/components/arbitrum-watchdog/Rules";
import { ArbitrumWatchdogScope } from "@/components/arbitrum-watchdog/Scope";
import ComingSoon from "@/components/coming-soon/ComingSoon";
import { EthereumInfo } from "@/components/ethereum/Information";
import { EthereumRules } from "@/components/ethereum/Rules";
import { EthereumScope } from "@/components/ethereum/Scope";
import { FC } from "react";

export const componentsMap: Record<string, [FC, FC, FC]> = {
  "arbitrum-watchdog": [
    ArbitrumWatchdogInfo,
    ArbitrumWatchdogRules,
    ArbitrumWatchdogScope,
  ],
  ethereum: [EthereumInfo, EthereumRules, EthereumScope],
  uniswap: [ComingSoon, ComingSoon, ComingSoon],
};
