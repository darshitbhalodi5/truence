import { ArbitrumWatchdogInfo } from "@/components/arbitrum-watchdog/Information";
import { ArbitrumWatchdogRules } from "@/components/arbitrum-watchdog/Rules";
import { ArbitrumWatchdogScope } from "@/components/arbitrum-watchdog/Scope";
import { SolanaInfo } from "@/components/solana/Information";
import ComingSoon from "@/components/coming-soon/ComingSoon";
import ProgramClosed from "@/components/program-closed/ProgramClosed";
import { FC } from "react";
import { SolanaRules } from "@/components/solana/Rules";
import { SolanaScope } from "@/components/solana/Scope";
import { OptimismInfo } from "@/components/optimism/Information";
import { OptimismRules } from "@/components/optimism/Rules";
import { OptimismScope } from "@/components/optimism/Scope";

export const componentsMap: Record<string, [FC, FC, FC]> = {
  "arbitrum-watchdog": [
    ArbitrumWatchdogInfo,
    ArbitrumWatchdogRules,
    ArbitrumWatchdogScope,
  ],
  ethereum: [ComingSoon, ComingSoon, ComingSoon],
  uniswap: [ComingSoon, ComingSoon, ComingSoon],
  aave: [ComingSoon, ComingSoon, ComingSoon],
  gmx: [ProgramClosed, ProgramClosed, ProgramClosed],
  pendle: [ProgramClosed, ProgramClosed, ProgramClosed],
  base: [ProgramClosed, ProgramClosed, ProgramClosed],
  solana: [SolanaInfo, SolanaRules, SolanaScope],
  optimism: [OptimismInfo, OptimismRules, OptimismScope],
};
