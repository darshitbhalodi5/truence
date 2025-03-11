import Image from "next/image";
import OptimismLogo from "@/public/assets/optimism.svg";

export function OptimismInfo() {
  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="bg-[#000317] p-6 mt-6 group hover:bg-[#0A0F29] hover:shadow-lg transition-all duration-300">
        <div className="flex items-center space-x-3 mb-1">
          <Image src={OptimismLogo} alt="Optimism Logo" className="w-6 h-6" />
          <h2 className="text-xl font-semibold text-[#FAFCA3]">
            Optimism Security Overview
          </h2>
        </div>
      </div>

      {/* Detailed Information */}
      <div className="bg-[#000317] p-6 group hover:bg-[#0A0F29] hover:shadow-lg transition-all duration-300">
        <div className="border border-[#694770] rounded-lg p-6 space-y-4">
          <h3 className="text-2xl font-medium text-white mb-3">
            Program Objectives & Structure
          </h3>
          <p className="text-[#8E8E8E]">
            The Optimism Security Program is dedicated to safeguarding the funds
            allocated by the Grant Council. It promotes transparency and
            accountability through a robust review process and a well-defined
            reward system.
          </p>
          <ul className="list-disc list-inside text-[#8E8E8E]">
            <li>
              <strong>Objective:</strong> Ensure effective and secure use of
              Council-allocated funds.
            </li>
            <li>
              <strong>Incentives:</strong> Rewards range from 1,000 tokens (Low)
              up to 10,000 tokens (High), with critical issues flagged for
              immediate action.
            </li>
            <li>
              <strong>Governance:</strong> Managed by a dedicated manager and
              overseen by a panel of 4 reviewers.
            </li>
            <li>
              <strong>Participation:</strong> Note that additional payment is
              required for submissions.
            </li>
            <li>
              <strong>Reward Pool:</strong> Up to 500,000 tokens available, with
              1,000 tokens already distributed.
            </li>
          </ul>
          <p className="text-[#8E8E8E]">
            This initiative is essential for maintaining the integrity of the
            Optimism ecosystem by preventing fund misuse and ensuring
            accountability in grant allocations.
          </p>
        </div>
      </div>
    </div>
  );
}
