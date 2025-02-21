import React from "react";
import {
  TargetIcon,
  PackageSearchIcon,
  GoalIcon,
  KeyIcon,
  WalletIcon,
} from "lucide-react";
import Image from "next/image";
import OverviewIcon from "@/public/assets/triangle.svg";

export function ArbitrumWatchdogInfo() {
  return (
    <div className="space-y-12">
      {/* Program overview */}
      <div className="bg-[#000317] p-6 mt-6 group hover:bg-[#0A0F29] hover:shadow-lg transition-all duration-300">
        <div className="flex items-center space-x-3 mb-6">
          <Image src={OverviewIcon} alt="Overview Icon" className="w-6 h-6" />
          <h2 className="text-xl font-semibold text-[#FAFCA3]">
            Program Overview
          </h2>
        </div>

        <div className="border border-[#694770] rounded-lg p-6">
          <h3 className="text-lg font-medium text-white mb-3">
            About the Program
          </h3>
          <div className="space-y-4 text-[#8E8E8E] leading-relaxed">
            <p className="text-md">
              The Arbitrum Watchdog program is a community-driven initiative
              designed to protect the Arbitrum ecosystem&apos;s integrity by
              incentivizing the identification and reporting of fund misuse.
              With over 422m ARB tokens allocated across various initiatives,
              this program serves as a crucial oversight mechanism.
            </p>
            <p className="text-md">
              The program employs a comprehensive review system where reports
              are evaluated by a committee of three trusted entities: the
              Arbitrum Foundation, Entropy Advisors, and the elected Research
              Member of the ARDC. This structure ensures fair and thorough
              assessment of all submissions while maintaining reporter
              anonymity.
            </p>
          </div>
        </div>
      </div>

      {/* Mission */}
      <div className="bg-[#000317] p-6 group hover:bg-[#0A0F29] hover:shadow-lg transition-all duration-300">
        <div className="flex items-center space-x-3 mb-6">
          <TargetIcon className="w-6 h-6 text-[#FAFCA3]" />
          <h2 className="text-xl font-semibold text-[#FAFCA3]">Mission</h2>
        </div>

        <div className="border border-[#694770] rounded-lg p-6 space-y-4 text-[#8E8E8E] leading-relaxed">
          <p className="text-md">
            The Watchdog program is a specialized bounty initiative established
            by Entropy Advisors to protect the Arbitrum DAO&apos;s 422m+ ARB
            token allocations across various initiatives. It serves as a
            decentralized accountability mechanism to identify and report fund
            misappropriation.
          </p>
        </div>
      </div>

      {/* About Program Objective */}
      <div className="bg-[#000317] p-6 group hover:bg-[#0A0F29] hover:shadow-lg transition-all duration-300">
        <div className="flex items-center space-x-3 mb-6">
          <GoalIcon className="w-6 h-6 text-[#FAFCA3]" />
          <h2 className="text-xl font-semibold text-[#FAFCA3]">
            Program Objectives
          </h2>
        </div>

        <div className="border border-[#694770] rounded-lg p-6 mb-2">
          <h3 className="text-lg font-medium text-white mb-3">
            Fund Protection
          </h3>
          <div className="space-y-4 text-md text-[#8E8E8E] leading-relaxed">
            Safeguard the DAO&apos;s allocated funds through community vigilance
            and systematic oversight, ensuring resources are used as intended
            across all initiatives.
          </div>
        </div>

        <div className="border border-[#694770] rounded-lg p-6 mb-2">
          <h3 className="text-lg font-medium text-white mb-3">
            Transparency Enhancement
          </h3>
          <div className="space-y-4 text-md text-[#8E8E8E] leading-relaxed">
            Foster an environment of accountability by creating clear reporting
            channels and maintaining open communication about fund usage.
          </div>
        </div>

        <div className="border border-[#694770] rounded-lg p-6">
          <h3 className="text-lg font-medium text-white mb-3">
            Ecosystem Integrity
          </h3>
          <div className="space-y-4 text-md text-[#8E8E8E] leading-relaxed">
            Maintain the integrity of Arbitrum&apos;s grant and incentive
            programs by deterring potential misuse and ensuring proper fund
            allocation.
          </div>
        </div>
      </div>

      {/* Program Features */}
      <div className="bg-[#000317] p-6 group hover:bg-[#0A0F29] hover:shadow-lg transition-all duration-300">
        <div className="flex items-center space-x-3 mb-6">
          <PackageSearchIcon className="w-6 h-6 text-[#FAFCA3]" />
          <h2 className="text-xl font-semibold text-[#FAFCA3]">
            Program Features
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-lg p-6 border border-[#694770] border-t-4 border-t-[#D6188A] min-h-[144px] min-w-[320px]">
            <h3 className="text-lg font-medium mb-4 text-[#D6188A]">
              Anonymous Reporting
            </h3>
            <p className="text-[#8E8E8E] text-sm leading-relaxed">
              Submit reports confidentially through our secure platform,
              protecting whistleblower identities throughout the process.
            </p>
          </div>

          <div className="rounded-lg p-6 border border-[#31695A] border-t-4 border-t-[#33C59E] min-h-[144px] min-w-[320px]">
            <h3 className="text-lg font-medium mb-4 text-[#33C59E]">
              Fair Evaluation
            </h3>
            <p className="text-[#8E8E8E] text-sm leading-relaxed">
              Three-member committee ensures unbiased assessment of all
              submissions with clear severity classifications.
            </p>
          </div>

          <div className="rounded-lg p-6 border border-[#576933] border-t-4 border-t-[#A4DB3C] min-h-[144px] min-w-[320px]">
            <h3 className="text-lg font-medium mb-4 text-[#A4DB3C]">
              Structured Rewards
            </h3>
            <p className="text-[#8E8E8E] text-sm leading-relaxed">
              Receive rewards based on impact level, with additional percentage
              from recovered funds.
            </p>
          </div>

          <div className="rounded-lg p-6 border border-[#7C4F40] border-t-4 border-t-[#E06137] min-h-[144px] min-w-[320px]">
            <h3 className="text-lg font-medium mb-4 text-[#E06137]">
              Continuous Monitoring
            </h3>
            <p className="text-[#8E8E8E] text-sm leading-relaxed">
              Ongoing oversight of all DAO-funded initiatives with regular
              program reviews and updates.
            </p>
          </div>
        </div>
      </div>

      {/* Key Benefits */}
      <div className="bg-[#000317] p-6 group hover:bg-[#0A0F29] hover:shadow-lg transition-all duration-300">
        <div className="flex items-center space-x-3 mb-6">
          <KeyIcon className="w-6 h-6 text-[#FAFCA3]" />
          <h2 className="text-xl font-semibold text-[#FAFCA3]">Key Benefits</h2>
        </div>

        <div className="p-6 pt-0">
          <ul className="list-disc list-inside space-y-2 text-[#8E8E8E] marker:text-[#FAFCA3]">
            <li>
              Enables fund recovery through legal means, smart contract
              enforcement, or community pressure
            </li>
            <li>
              Provides evidence for improving underlying programs and
              identifying bad actors
            </li>
            <li>Testing deterrence measures against malicious actions </li>
            <li>Attracts sophisticated onchain investigators to the DAO</li>
          </ul>
        </div>
      </div>

      {/* Budget & Management */}
      <div className="bg-[#000317] p-6 group hover:bg-[#0A0F29] hover:shadow-lg transition-all duration-300">
        <div className="flex items-center space-x-3 mb-6">
          <WalletIcon className="w-6 h-6 text-[#FAFCA3]" />
          <h2 className="text-xl font-semibold text-[#FAFCA3]">
            Budget & Management
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-lg p-6 border border-[#694770] border-l-4 border-l-[#D6188A] min-h-[112px] min-w-[288px]">
            <h3 className="text-sm font-medium mb-4 text-white">
              Total Allocation
            </h3>
            <p className="text-white text-xl leading-relaxed">400,000 ARB</p>
          </div>

          <div className="rounded-lg p-6 border border-[#31695A] border-l-4 border-l-[#33C59E] min-h-[112px] min-w-[288px]">
            <h3 className="text-sm font-medium mb-4 text-white">
              Review Committee
            </h3>
            <p className="text-white text-xl leading-relaxed">3 Members</p>
          </div>

          <div className="rounded-lg p-6 border border-[#576933] border-l-4 border-l-[#A4DB3C] min-h-[112px] min-w-[288px]">
            <h3 className="text-sm font-medium mb-4 text-white">
              Program Duration
            </h3>
            <p className="text-white text-xl leading-relaxed">
              Until Funds Exhausted
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
