import { NotepadTextIcon } from "lucide-react";

export function SolanaRules() {
  return (
    <div className="space-y-12">
      <div className="bg-[#000317] p-6 mt-6 group hover:bg-[#0A0F29] hover:shadow-lg transition-all duration-300">
        <div className="flex items-center space-x-3 mb-1">
          <NotepadTextIcon className="w-6 h-6 text-[#FAFCA3]" />
          <h2 className="text-xl font-semibold text-[#FAFCA3]">
            Rules & Guidelines
          </h2>
        </div>
      </div>

      <div className="bg-[#000317] p-6 group hover:bg-[#0A0F29] hover:shadow-lg transition-all duration-300">
        <h3 className="text-2xl font-medium text-white mb-5">
          Submission Guidelines
        </h3>
        <div className="space-y-4">
          <div className="p-4 bg-[#000108] border border-[#694770] rounded-lg">
            <h4 className="text-white text-xl font-medium mb-6">
              Required Information
            </h4>
            <ul className="list-disc list-inside text-md space-y-4 text-white">
              <li>Detailed description of the vulnerability</li>
              <li>
                Transaction hashes and relevant addresses if any accident or
                fund related threat
              </li>
              <li>Step-by-step breakdown of the issue</li>
              <li>
                Supporting report acceptance (screenshots, logs, communications)
                in one report
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Severity and Rewards */}
      <div className="bg-[#000317] p-6 group hover:bg-[#0A0F29] hover:shadow-lg transition-all duration-300">
        <h2 className="space-x-3 mb-4 text-xl font-semibold text-[#FAFCA3]">
          Detailed Severity Levels & Rewards
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Low Severity */}
          <div className="bg-[#000108] rounded-lg p-6 border border-[#31695A] border-l-4 border-l-[#33C59E]">
            <h3 className="text-xl font-medium text-[#33C59E] mb-2">
              Low Severity
            </h3>
            <p className="text-[#8E8E8E] text-sm mt-2">
              <strong>Reward:</strong> 10 SOL. No additional payment.
            </p>
          </div>

          {/* Medium Severity */}
          <div className="bg-[#000108] rounded-lg p-6 border border-[#576933] border-l-4 border-l-[#A4DB3C]">
            <h3 className="text-xl font-medium text-[#A4DB3C] mb-2">
              Medium Severity
            </h3>
            <p className="text-[#8E8E8E] text-sm mt-2">
              <strong>Reward:</strong> 25 SOL. No additional payment.
            </p>
          </div>

          {/* High Severity */}
          <div className="bg-[#000108] rounded-lg p-6 border border-[#663A2B] border-l-4 border-l-[#AC350D]">
            <h3 className="text-xl font-medium text-[#AC350D] mb-2">
              High Severity
            </h3>
            <p className="text-[#8E8E8E] text-sm mt-2">
              <strong>Reward:</strong> 50 SOL. No additional payment.
            </p>
          </div>

          {/* Critical Severity */}
          <div className="bg-[#000108] rounded-lg p-6 border border-[#D6188A] border-l-4 border-l-[#E06137]">
            <h3 className="text-xl font-medium text-[#E06137] mb-2">
              Critical Severity
            </h3>
            <p className="text-[#8E8E8E] text-sm mt-2">
              <strong>Reward:</strong> 100 SOL. No additional payment.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-[#000317] p-6 group hover:bg-[#0A0F29] hover:shadow-lg transition-all duration-300">
        <h3 className="text-2xl font-medium text-white mb-5">
          Evaluation Process
        </h3>
        <div className="space-y-4">
          <div className="p-4 bg-[#000108] border border-[#694770] rounded-lg">
            <ul className="list-disc list-inside text-md space-y-4 text-white">
              <li>Initial screening for completeness and relevance</li>
              <li>Detailed technical analysis of provided proof</li>
              <li>Severity assessment by review committee</li>
              <li>Verification of fund tracking and impact</li>
              <li>
                Private communication phase with involved parties if any doubt
              </li>
              <li>Final reward distribution</li>
              <li>
                <strong className="text-[#FAFCA3]">Note:</strong> Final severity will be decided by
                reviewer committee if submission accepted
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
