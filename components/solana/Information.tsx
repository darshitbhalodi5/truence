import Image from "next/image";
import SolanaIcon from "@/public/assets/solana.svg";

export function SolanaInfo() {
  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="bg-[#000317] p-6 mt-6 group hover:bg-[#0A0F29] hover:shadow-lg transition-all duration-300">
        <div className="flex items-center space-x-3 mb-1">
          <Image src={SolanaIcon} alt="Solana Logo" className="w-6 h-6" />
          <h2 className="text-xl font-semibold text-[#FAFCA3]">
            Solana Security Overview
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
            The Solana Security Program is dedicated to maintaining the
            network’s integrity and ensuring that transactions remain fast and
            cost-effective. By incentivizing the identification and reporting of
            vulnerabilities, the program encourages community vigilance and
            responsible disclosure.
          </p>
          <ul className="list-disc list-inside text-[#8E8E8E]">
            <li>
              <strong>Objective:</strong> Protect high-speed, low-cost
              transaction processing.
            </li>
            <li>
              <strong>Incentives:</strong> Rewards based on the severity of the
              issue, ranging from 10 tokens for low severity up to 100 tokens
              for critical vulnerabilities.
            </li>
            <li>
              <strong>Governance:</strong> Managed by a dedicated manager and
              overseen by a panel of four trusted reviewers.
            </li>
            <li>
              <strong>Active Status:</strong> The program is live and
              continuously monitored.
            </li>
            <li>
              <strong>Payment:</strong> No additional payment is required to
              participate.
            </li>
          </ul>
          <p className="text-[#8E8E8E]">
            This comprehensive approach not only secures the Solana network but
            also fosters an ecosystem of accountability and continuous
            improvement.
          </p>
        </div>
      </div>
    </div>
  );
}
