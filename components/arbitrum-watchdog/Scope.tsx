import React from "react";
import {
  Target,
  AwardIcon,
  EqualIcon,
  ArrowDownIcon,
  ArrowUpIcon,
  Globe,
} from "lucide-react";

export function ArbitrumWatchdogScope() {
  return (
    <div className="space-y-12">
      <div className="bg-[#000317] p-6 mt-6 group hover:bg-[#0A0F29] hover:shadow-lg transition-all duration-300">
        <div className="flex items-center space-x-3 mb-1">
          <Globe className="w-6 h-6 text-[#FAFCA3]" />
          <h2 className="text-xl font-semibold text-[#FAFCA3]">
            Program Coverage & Scope
          </h2>
        </div>
      </div>
      {/* Program coverage and scope */}
      <div className="bg-[#000317] p-6 mt-6 group hover:bg-[#0A0F29] hover:shadow-lg transition-all duration-300">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-3 bg-[#000108] border border-[#694770] rounded-lg p-6">
            <h3 className="text-2xl font-medium text-white mb-5">
              Covered Programs
            </h3>
            <ul className="space-y-2 list-disc marker:text-[#8E8E8E] pl-4 text-[#8E8E8E]">
              {[
                "Questbook Domain allocations",
                "Stylus Sprint initiatives",
                "Arbitrum Foundation grants",
                "All incentive programs",
              ].map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-3 bg-[#000108] border border-[#694770] rounded-lg p-6">
            <h3 className="text-2xl font-medium text-white mb-5">
              Fund Misuse Definition
            </h3>
            <ul className="space-y-2 list-disc marker:text-[#8E8E8E] pl-4 text-[#8E8E8E]">
              {[
                "Stated terms of allocation",
                "Project objectives",
                "Agreement conditions",
                "Overall spirit of allocation",
              ].map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-6 bg-[#000108] border border-[#694770] rounded-lg p-6">
            <h3 className="text-2xl font-medium text-white mb-5">
              Qualifying Activities
            </h3>
            <div className="space-y-4">
              <div className="p-4 bg-[#000108] border border-[#7C4F40] rounded-lg">
                <h4 className="text-white text-xl font-medium mb-2">
                  Fund Misappropriation
                </h4>
                <p className="text-[#8E8E8E]">
                  Unauthorized use or diversion of allocated funds, including
                  but not limited to personal use, unauthorized projects, or
                  undisclosed activities.
                </p>
              </div>
              <div className="p-4 bg-[#000108] border border-[#31695A] rounded-lg">
                <h4 className="text-white text-xl font-medium mb-2">
                  False Reporting
                </h4>
                <p className="text-[#8E8E8E]">
                  Fabrication of progress reports, milestones, or deliverables
                  to obtain or retain funding.
                </p>
              </div>
              <div className="p-4 bg-[#000108] border border-[#576933] rounded-lg">
                <h4 className="text-white text-xl font-medium mb-2">
                  Incentive Gaming
                </h4>
                <p className="text-[#8E8E8E]">
                  Manipulation of incentive programs through artificial
                  activity, collusion, or exploitation of program mechanics.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Severity Levels and Rewards */}
      <div className="bg-[#000317] p-6 group hover:bg-[#0A0F29] hover:shadow-lg transition-all duration-300">
        <div className="flex items-center space-x-3 mb-6">
          <AwardIcon className="w-6 h-6 text-[#FAFCA3]" />
          <h2 className="text-xl font-semibold text-[#FAFCA3]">
            Severity Levels & Rewards
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#000108] rounded-lg p-6 border border-[#31695A] border-l-4 border-l-[#33C59E] min-h-[112px] min-w-[288px]">
            <div className="flex items-center space-x-2 mb-4">
              <ArrowDownIcon className="h-6 w-6 text-[#33C59E]" />
              <h3 className="text-xl font-medium text-[#33C59E]">
                Low Severity
              </h3>
            </div>
            <p className="text-white text-sm pl-8 leading-relaxed">
              Minor misuse with limited impact on DAO&apos;s financial health or
              reputation.
            </p>
          </div>

          <div className="bg-[#000108] rounded-lg p-6 border border-[#576933] border-l-4 border-l-[#A4DB3C] min-h-[112px] min-w-[288px]">
            <div className="flex items-center space-x-2 mb-4">
              <EqualIcon className="h-6 w-6 text-[#A4DB3C]" />
              <h3 className="text-xl font-medium text-[#A4DB3C]">
                Medium Severity
              </h3>
            </div>
            <p className="text-white text-sm pl-8 leading-relaxed">
              Significant misuse impacting DAO resources, but potentially
              recoverable.
            </p>
          </div>

          <div className="bg-[#000108] rounded-lg p-6 border border-[#663A2B] border-l-4 border-l-[#AC350D] min-h-[112px] min-w-[288px]">
            <div className="flex items-center space-x-2 mb-4">
              <ArrowUpIcon className="h-6 w-6 text-[#AC350D]" />
              <h3 className="text-xl font-medium text-[#AC350D]">
                High Severity
              </h3>
            </div>
            <p className="text-white text-sm pl-8 leading-relaxed">
              Large-scale, deliberate misuse of DAO-allocated funds.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
