import { NotepadTextIcon } from "lucide-react";

export function OptimismRules() {
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
                Minor misuse of Council-allocated funds with minimal financial impact.
                Easily correctable without significant consequences.
              </p>
              <p className="text-[#8E8E8E] text-sm mt-2">
                <strong>Reward:</strong> 1,000 tokens
              </p>
            </div>
            {/* Medium Severity */}
            <div className="bg-[#000108] rounded-lg p-6 border border-[#576933] border-l-4 border-l-[#A4DB3C]">
              <h3 className="text-xl font-medium text-[#A4DB3C] mb-2">
                Medium Severity
              </h3>
              <p className="text-[#8E8E8E] text-sm">
                Misuse that leads to inefficiencies or minor financial losses.
                May cause limited disruption to approved initiatives but remains manageable.
              </p>
              <p className="text-[#8E8E8E] text-sm mt-2">
                <strong>Reward:</strong> 5,000 tokens
              </p>
            </div>
            {/* High Severity */}
            <div className="bg-[#000108] rounded-lg p-6 border border-[#663A2B] border-l-4 border-l-[#AC350D]">
              <h3 className="text-xl font-medium text-[#AC350D] mb-2">
                High Severity
              </h3>
              <p className="text-[#8E8E8E] text-sm">
                Significant misallocation affecting multiple stakeholders;
                may compromise the intended purpose of the Council’s budget.
              </p>
              <p className="text-[#8E8E8E] text-sm mt-2">
                <strong>Reward:</strong> 10,000 tokens
              </p>
            </div>
            {/* Critical Severity */}
            <div className="bg-[#000108] rounded-lg p-6 border border-[#D6188A] border-l-4 border-l-[#E06137]">
              <h3 className="text-xl font-medium text-[#E06137] mb-2">
                Critical Severity
              </h3>
              <p className="text-[#8E8E8E] text-sm">
                Severe exploitation leading to substantial financial loss or reputational damage.
                Immediate corrective action is required to prevent further harm.
              </p>
              <p className="text-[#8E8E8E] text-sm mt-2">
                <strong>Reward:</strong> 0 tokens
              </p>
            </div>
          </div>
          <div className="mt-6 border-t border-[#694770] pt-4 text-[#8E8E8E] text-sm">
            <p>
              <strong>Misuse Range:</strong> {" "}{'<25K'}, {" "}{'25K-50K'}, {" "}{'50K-100K'}, {" "}{'100K-250K'}, {" "}{'>250K'}
            </p>
          </div>
        </div>
      </div>
    );
  }