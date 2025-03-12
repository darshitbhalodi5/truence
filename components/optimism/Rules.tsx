import { NotepadTextIcon } from "lucide-react";

export function OptimismRules() {
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
              <li>Detailed description of the fund misuse incident</li>
              <li>Transaction hashes and relevant addresses</li>
              <li>Step-by-step breakdown of the misuse pattern</li>
              <li>
                Supporting evidence (screenshots, logs, communications) in one
                report
              </li>
            </ul>
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
              <li>Detailed technical analysis of provided evidence</li>
              <li>Severity assessment by review committee</li>
              <li>Verification of fund tracking and impact</li>
              <li>Consensus requirement (3/5 reviewers)</li>
              <li>Private communication phase with involved parties</li>
              <li>Determination of recovery possibilities</li>
              <li>Final reward calculation and distribution</li>
              <li>
                <strong className="text-[#FAFCA3]">Note:</strong> Final severity
                will be decided by reviewer committee if submission accepted
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
