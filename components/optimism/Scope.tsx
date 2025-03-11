import { Globe } from "lucide-react";

export function OptimismScope() {
    return (
      <div className="space-y-12">
        {/* Header */}
        <div className="bg-[#000317] p-6 mt-6 group hover:bg-[#0A0F29] hover:shadow-lg transition-all duration-300">
          <div className="flex items-center space-x-3 mb-1">
            <Globe className="w-6 h-6 text-[#FAFCA3]" />
            <h2 className="text-xl font-semibold text-[#FAFCA3]">
              Optimism Security Program Coverage
            </h2>
          </div>
        </div>
  
        {/* Program Details */}
        <div className="bg-[#000317] p-6 mt-6 group hover:bg-[#0A0F29] hover:shadow-lg transition-all duration-300">
          <div className="border border-[#694770] rounded-lg p-6 space-y-4">
            <h3 className="text-2xl font-medium text-white mb-3">
              About the Program
            </h3>
            <p className="text-[#8E8E8E]">
              A program to safeguard Optimism's Grant Council-allocated funds, ensuring effective use and preventing misuse.
              This initiative continuously monitors fund allocation to prevent misallocation through community oversight and strict review processes.
            </p>
            <ul className="list-disc list-inside text-[#8E8E8E]">
              <li>
                <strong>Additional Payment Required:</strong>{" "}
                <span className="text-white">Yes</span>
              </li>
              <li>
                <strong>Maximum Rewards:</strong>{" "}
                <span className="text-white">500,000 tokens</span>
              </li>
              <li>
                <strong>Total Rewards Paid:</strong>{" "}
                <span className="text-white">1,000 tokens</span>
              </li>
              <li>
                <strong>Manager Address:</strong>{" "}
                <span className="text-white">0xCC957b614146af3c62953c40f3501be1E66ebAA6</span>
              </li>
              <li>
                <strong>Review Committee:</strong>{" "}
                <span className="text-white">4 trusted reviewers</span>
              </li>
              <li>
                <strong>Program Duration:</strong>{" "}
                <span className="text-white">[Start Date] - [End Date]</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }