import { NotepadTextIcon } from "lucide-react";

export function SolanaRules() {
  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="bg-[#000317] p-6 mt-6 group hover:bg-[#0A0F29] hover:shadow-lg transition-all duration-300">
        <div className="flex items-center space-x-3 mb-1">
          <NotepadTextIcon className="w-6 h-6 text-[#FAFCA3]" />
          <h2 className="text-xl font-semibold text-[#FAFCA3]">
            Severity Levels & Rewards
          </h2>
        </div>
      </div>

      {/* Severity and Rewards */}
      <div className="bg-[#000317] p-6 group hover:bg-[#0A0F29] hover:shadow-lg transition-all duration-300">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Low Severity */}
          <div className="bg-[#000108] rounded-lg p-6 border border-[#31695A] border-l-4 border-l-[#33C59E]">
            <h3 className="text-xl font-medium text-[#33C59E] mb-2">
              Low Severity
            </h3>
            <p className="text-[#8E8E8E] text-sm">
              Minor security issue with negligible impact on Solana’s
              infrastructure. No urgent action needed.
            </p>
            <p className="text-[#8E8E8E] text-sm mt-2">
              <strong>Reward:</strong> 10 tokens
            </p>
          </div>

          {/* Medium Severity */}
          <div className="bg-[#000108] rounded-lg p-6 border border-[#576933] border-l-4 border-l-[#A4DB3C]">
            <h3 className="text-xl font-medium text-[#A4DB3C] mb-2">
              Medium Severity
            </h3>
            <p className="text-[#8E8E8E] text-sm">
              Moderate issue potentially leading to transaction inefficiencies
              or delays. May cause minor financial loss.
            </p>
            <p className="text-[#8E8E8E] text-sm mt-2">
              <strong>Reward:</strong> 25 tokens
            </p>
          </div>

          {/* High Severity */}
          <div className="bg-[#000108] rounded-lg p-6 border border-[#663A2B] border-l-4 border-l-[#AC350D]">
            <h3 className="text-xl font-medium text-[#AC350D] mb-2">
              High Severity
            </h3>
            <p className="text-[#8E8E8E] text-sm">
              Significant vulnerability that could disrupt Solana’s rapid
              transaction processing, impacting many users under specific
              conditions.
            </p>
            <p className="text-[#8E8E8E] text-sm mt-2">
              <strong>Reward:</strong> 50 tokens
            </p>
          </div>

          {/* Critical Severity */}
          <div className="bg-[#000108] rounded-lg p-6 border border-[#D6188A] border-l-4 border-l-[#E06137]">
            <h3 className="text-xl font-medium text-[#E06137] mb-2">
              Critical Severity
            </h3>
            <p className="text-[#8E8E8E] text-sm">
              Severe security flaw that endangers Solana’s core infrastructure
              and consensus mechanism, with potential for large-scale financial
              loss.
            </p>
            <p className="text-[#8E8E8E] text-sm mt-2">
              <strong>Reward:</strong> 100 tokens
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
