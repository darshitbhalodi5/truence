import React, { useState } from "react";
import { ReviewerAddressModalProps, NetwrokItemProps, NetwrokListProps } from "@/types/programSummary";

const ReviewerAddressModal: React.FC<ReviewerAddressModalProps> = ({
  isOpen,
  onClose,
  networkName,
  reviewerAddresses,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">
            {networkName} Reviewer Addresses
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            ✕
          </button>
        </div>
        <div className="mt-4">
          {reviewerAddresses.map((address, index) => (
            <div key={index} className="mb-2 flex items-center">
              <p className="text-white bg-gray-700 p-2 rounded-md text-sm font-mono flex-1 overflow-hidden overflow-ellipsis">
                {address}
              </p>
              <button
                onClick={() => navigator.clipboard.writeText(address)}
                className="ml-2 text-xs bg-blue-600 hover:bg-blue-700 text-white py-1 px-2 rounded"
              >
                Copy
              </button>
            </div>
          ))}
        </div>
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const BountyNetworkItem: React.FC<NetwrokItemProps> = ({
  bounty,
  statusCounts,
}) => {
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

  return (
    <div className="flex justify-between border border-gray-700 rounded-lg p-4 bg-gray-800 text-white mb-4">
      <div>
        {bounty.logoUrl && (
          <img
            src={bounty.logoUrl}
            alt={`${bounty.networkName} logo`}
            className="w-8 h-8 mr-8"
          />
        )}
      </div>
      <h3 className="text-lg font-semibold">{bounty.networkName}</h3>
      {[
        { status: "ALL", count: statusCounts.all || 0 },
        { status: "pending", count: statusCounts.pending || 0 },
        { status: "reviewing", count: statusCounts.reviewing || 0 },
        { status: "accepted", count: statusCounts.accepted || 0 },
        { status: "rejected", count: statusCounts.rejected || 0 },
      ].map(({ status, count }) => (
        <p
          key={status}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200`}
        >
          {status.charAt(0).toUpperCase() + status.slice(1)} ({count})
        </p>
      ))}
      <button
        onClick={() => setIsAddressModalOpen(true)}
        className="text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-lg"
      >
        Reviewer Address
      </button>

      <ReviewerAddressModal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        networkName={bounty.networkName}
        reviewerAddresses={bounty.reviewerAddresses || []}
      />
    </div>
  );
};

const ProgramSummary: React.FC<NetwrokListProps> = ({
  bounties,
  statusCounts,
}) => {
  return (
    <div className="mb-6">
      {bounties.map((bounty, index) => (
        <BountyNetworkItem
          key={index}
          bounty={bounty}
          statusCounts={statusCounts}
        />
      ))}
    </div>
  );
};

export default ProgramSummary;