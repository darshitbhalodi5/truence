import Image from "next/image";
import {
  GoalIcon,
  KeyIcon,
  PackageSearchIcon,
  TargetIcon,
  WalletIcon,
} from "lucide-react";
import OverviewIcon from "@/public/assets/triangle.svg";

export function OptimismInfo() {
  return (
    <div className="space-y-12">
      <div className="bg-[#000317] p-6 mt-6 group hover:bg-[#0A0F29] hover:shadow-lg transition-all duration-300">
        <div className="flex items-center space-x-3 mb-1">
          <Image src={OverviewIcon} alt="overview icon" className="w-6 h-6" />
          <h2 className="text-xl font-semibold text-[#FAFCA3]">
            Program Overview
          </h2>
        </div>
      </div>
      {/* Program overview */}
      <div className="bg-[#000317] p-6 mt-6 group hover:bg-[#0A0F29] hover:shadow-lg transition-all duration-300">
        <div className="border border-[#694770] rounded-lg p-6">
          <h3 className="text-lg font-medium text-white mb-3">
            About the Program
          </h3>
          <div className="space-y-4 text-[#8E8E8E] leading-relaxed">
            <p className="text-md">
              The Optimism Security Program is dedicated to safeguarding the
              funds allocated by the Grant Council. It promotes transparency and
              accountability through a robust review process and a well-defined
              reward system.
            </p>
          </div>
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
            Maintain the integrity of Optimism&apos;s grant and incentive
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
            <p className="text-[#8E8E8E] text-md leading-relaxed">
              Submit reports confidentially through our secure platform,
              protecting whistleblower identities throughout the process.
            </p>
          </div>

          <div className="rounded-lg p-6 border border-[#31695A] border-t-4 border-t-[#33C59E] min-h-[144px] min-w-[320px]">
            <h3 className="text-lg font-medium mb-4 text-[#33C59E]">
              Fair Evaluation
            </h3>
            <p className="text-[#8E8E8E] text-md leading-relaxed">
              Three-member committee ensures unbiased assessment of all
              submissions with clear severity classifications.
            </p>
          </div>

          <div className="rounded-lg p-6 border border-[#576933] border-t-4 border-t-[#A4DB3C] min-h-[144px] min-w-[320px]">
            <h3 className="text-lg font-medium mb-4 text-[#A4DB3C]">
              Structured Rewards
            </h3>
            <p className="text-[#8E8E8E] text-md leading-relaxed">
              Receive rewards based on impact level, with additional percentage
              from recovered funds.
            </p>
          </div>

          <div className="rounded-lg p-6 border border-[#7C4F40] border-t-4 border-t-[#E06137] min-h-[144px] min-w-[320px]">
            <h3 className="text-lg font-medium mb-4 text-[#E06137]">
              Continuous Monitoring
            </h3>
            <p className="text-[#8E8E8E] text-md leading-relaxed">
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
          <div className="bg-[#000108] rounded-lg p-6 border border-[#694770] border-l-4 border-l-[#D6188A] min-h-[112px] min-w-[288px]">
            <h3 className="text-sm font-medium mb-4 text-white">
              Total Allocation
            </h3>
            <p className="text-white text-xl leading-relaxed">500,000 OP</p>
          </div>

          <div className="bg-[#000108] rounded-lg p-6 border border-[#31695A] border-l-4 border-l-[#33C59E] min-h-[112px] min-w-[288px]">
            <h3 className="text-sm font-medium mb-4 text-white">
              Review Committee
            </h3>
            <p className="text-white text-xl leading-relaxed">5 Members</p>
          </div>

          <div className="bg-[#000108] rounded-lg p-6 border border-[#576933] border-l-4 border-l-[#A4DB3C] min-h-[112px] min-w-[288px]">
            <h3 className="text-sm font-medium mb-4 text-white">
              Program Duration
            </h3>
            <p className="text-white text-xl leading-relaxed">
              Till 500000 OP rewarded
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
