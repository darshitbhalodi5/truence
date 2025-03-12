import { GoalIcon, PackageSearchIcon, TargetIcon } from "lucide-react";

export function SolanaInfo() {
  return (
    <div className="space-y-12">
      {/* Mission */}
      <div className="bg-[#000317] p-6 group hover:bg-[#0A0F29] hover:shadow-lg transition-all duration-300">
        <div className="flex items-center space-x-3 mb-6">
          <TargetIcon className="w-6 h-6 text-[#FAFCA3]" />
          <h2 className="text-xl font-semibold text-[#FAFCA3]">Mission</h2>
        </div>

        <div className="border border-[#694770] rounded-lg p-6 space-y-4 text-[#8E8E8E] leading-relaxed">
          <p className="text-md">
            The Solana Security Program is dedicated to maintaining the
            network’s integrity and ensuring that transactions remain fast and
            cost-effective. By incentivizing the identification and reporting of
            vulnerabilities, the program encourages community vigilance and
            responsible disclosure.
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

        <div className="p-6 mb-2">
          Protect high-speed, low-cost transaction processing.
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
              Incentives
            </h3>
            <p className="text-[#8E8E8E] text-md leading-relaxed">
              Rewards based on the severity of the issue, ranging from 10 tokens
              for low severity up to 100 tokens for critical vulnerabilities.
            </p>
          </div>

          <div className="rounded-lg p-6 border border-[#31695A] border-t-4 border-t-[#33C59E] min-h-[144px] min-w-[320px]">
            <h3 className="text-lg font-medium mb-4 text-[#33C59E]">
              Governance
            </h3>
            <p className="text-[#8E8E8E] text-md leading-relaxed">
              Managed by a dedicated manager and overseen by a panel of four
              trusted reviewers.
            </p>
          </div>

          <div className="rounded-lg p-6 border border-[#576933] border-t-4 border-t-[#A4DB3C] min-h-[144px] min-w-[320px]">
            <h3 className="text-lg font-medium mb-4 text-[#A4DB3C]">
              Structured Rewards
            </h3>
            <p className="text-[#8E8E8E] text-md leading-relaxed">
              Receive rewards based on impact level, with mentioned base reward
              funds.
            </p>
          </div>

          <div className="rounded-lg p-6 border border-[#7C4F40] border-t-4 border-t-[#E06137] min-h-[144px] min-w-[320px]">
            <h3 className="text-lg font-medium mb-4 text-[#E06137]">
              Active Status
            </h3>
            <p className="text-[#8E8E8E] text-md leading-relaxed">
              The program is live and continuously monitored.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-[#000317] p-6 group hover:bg-[#0A0F29] hover:shadow-lg transition-all duration-300">
        <div className="border border-[#694770] rounded-lg p-6 space-y-4 text-[#8E8E8E] leading-relaxed">
          <p className="text-md">
            This comprehensive approach not only secures the Solana network but
            also fosters an ecosystem of accountability and continuous
            improvement.
          </p>
        </div>
      </div>
    </div>
  );
}
