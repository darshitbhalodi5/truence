import React, { useState } from "react";
import { Info } from "lucide-react";
import { SeverityInfoProps } from "@/types/severityInfoProps";

export const SeverityInfo = ({
  submitterSeverity,
  reviewerSeverity,
}: SeverityInfoProps) => {
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);

  // If there's no reviewer severity or it matches the submitter's, don't show anything
  if (
    !reviewerSeverity ||
    reviewerSeverity.toLowerCase() === submitterSeverity.toLowerCase()
  ) {
    return null;
  }

  return (
    <div className="relative group">
      <button
        className="ml-2 text-[#FAFCA3] hover:text-[#99168E]"
        onMouseEnter={() => setIsTooltipVisible(true)}
        onMouseLeave={() => setIsTooltipVisible(false)}
        onClick={(e) => {
          e.preventDefault();
          setIsTooltipVisible(!isTooltipVisible);
        }}
      >
        <Info className="w-4 h-4 text-[#FAFCA3] bg-[#99168E] rounded-full" />
      </button>
      {isTooltipVisible && (
        <div className="absolute z-10 w-64 px-4 py-3 text-sm bg-[#00041B] rounded-lg shadow-lg -translate-x-1/2 left-1/2 mt-2">
          <p className="text-white/80 text-md">Severity Changed</p>
          <p className="mt-1">
            <span className="text-white/80">Old Severity: </span>
            <span className="text-red-300 text-xs">
              {submitterSeverity.toUpperCase()}
            </span>
          </p>
          <p className="mt-1">
            <span className="text-white/80">New Severity: </span>
            <span className="text-green-300 text-xs">
              {reviewerSeverity.toUpperCase()}
            </span>
          </p>
        </div>
      )}
    </div>
  );
};

export default SeverityInfo;
