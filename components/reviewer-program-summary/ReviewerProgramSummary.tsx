import React, { useState } from "react";
import { NetwrokListProps } from "@/types/programSummary";

const ReviewerProgramSummary: React.FC<NetwrokListProps> = ({ bounties }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="mb-6">
      {/* Single Expand/Collapse Button */}
      <div
        className="flex items-center justify-between p-3 cursor-pointer bg-gray-900 text-gray-400 rounded-lg mb-3"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h3 className="text-lg font-semibold">Program Details</h3>
        <span className="text-sm">
          {isExpanded ? "▲ Collapse" : "▼ Expand"}
        </span>
      </div>

      {/* Show all bounty details when expanded */}
      {isExpanded && (
        <div className="space-y-2">
          {bounties.map((bounty, index) => (
            <div
              key={index}
              className="grid grid-cols-6 items-center border border-gray-700 rounded-lg p-3 bg-[#000625] text-white/80 mb-2 gap-4"
            >
              <div className="col-span-2 flex items-center">
                {bounty.logoUrl && (
                  <img
                    src={bounty.logoUrl}
                    alt={`${bounty.networkName} logo`}
                    className="w-7 h-7 mr-7"
                  />
                )}
                <h3 className="text-lg font-semibold">{bounty.networkName}</h3>
              </div>

              <div className="col-span-4 grid grid-cols-5 gap-2">
                {[
                  { status: "ALL", count: bounty.statusCounts.all || 0 },
                  {
                    status: "pending",
                    count: bounty.statusCounts.pending || 0,
                  },
                  {
                    status: "reviewing",
                    count: bounty.statusCounts.reviewing || 0,
                  },
                  {
                    status: "accepted",
                    count: bounty.statusCounts.accepted || 0,
                  },
                  {
                    status: "rejected",
                    count: bounty.statusCounts.rejected || 0,
                  },
                ].map(({ status, count }) => (
                  <p
                    key={status}
                    className="px-3 py-1.5 rounded-lg text-sm font-medium text-center bg-gray-700/40"
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)} ({count})
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewerProgramSummary;
