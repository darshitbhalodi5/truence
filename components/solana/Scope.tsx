import { Globe } from "lucide-react";

export function SolanaScope() {
  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="bg-[#000317] p-6 mt-6 group hover:bg-[#0A0F29] hover:shadow-lg transition-all duration-300">
        <div className="flex items-center space-x-3 mb-1">
          <Globe className="w-6 h-6 text-[#FAFCA3]" />
          <h2 className="text-xl font-semibold text-[#FAFCA3]">
            Solana Security Program Coverage
          </h2>
        </div>
      </div>

      {/* Program Details */}
      <div className="bg-[#000317] p-6 mt-6 group hover:bg-[#0A0F29] hover:shadow-lg transition-all duration-300">
        <div className="border border-[#694770] rounded-lg p-6 space-y-4">
          <h3 className="text-2xl font-medium text-white mb-3">
            About the Program
          </h3>
          <p className="text-[#FAFCA3]">
            You can use any contract or infrastructure related topic for the
            submission in which you found vulnerability.
          </p>
          <p className="text-[#8E8E8E]">
            A proactive security program aimed at ensuring Solana’s high-speed,
            low-cost transactions remain safe and reliable. This initiative is
            designed to continuously monitor the network, identify potential
            vulnerabilities, and safeguard the overall integrity of the
            blockchain.
          </p>
          <ul className="list-disc list-inside text-[#8E8E8E]">
            <li>
              <strong>Maximum Rewards:</strong> 20,000 tokens available for
              successful reports.
            </li>
            <li>
              <strong>Review Committee:</strong> 5 reviewers ensuring fair
              assessment.
            </li>
            <li>
              <strong>Program Duration:</strong> From
              <span className="text-white">
                {" "}
                1 March, 2025 - 1 September, 2025
              </span>
            </li>
            <li>
              <strong>Additional Payment Required:</strong> No extra fees.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
