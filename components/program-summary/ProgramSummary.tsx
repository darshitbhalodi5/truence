import React, { useState } from "react";
import {
  ReviewerAddressModalProps,
  NetwrokItemProps,
  NetwrokListProps,
} from "@/types/programSummary";
import toast from "react-hot-toast";

const ReviewerAddressModal: React.FC<ReviewerAddressModalProps> = ({
  isOpen,
  onClose,
  networkName,
  reviewerAddresses,
}) => {
  const [isAddingReviewer, setIsAddingReviewer] = useState(false);
  const [newReviewer, setNewReviewer] = useState({
    programName: "",
    email: "",
  });

  if (!isOpen) return null;

  const handleSubmitReviewer = async () => {
    try {
      // Replace this with your actual backend submission logic
      const response = await fetch("/api/change-reviewer-address", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          programName: newReviewer.programName,
          email: newReviewer.email,
        }),
      });

      if (response.ok) {
        // Reset form and close modal
        setNewReviewer({
          programName: "",
          email: "",
        });
        setIsAddingReviewer(false);
        onClose();
        // Optionally show a success notification
        toast.success("Reviewer submission successful");
      } else {
        // Handle error
        toast.error("Failed to submit reviewer");
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("An error occurred while submitting");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">
            {networkName} Reviewers
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            ✕
          </button>
        </div>

        {!isAddingReviewer ? (
          <div className="mt-4">
            <div className="mb-4">
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
            <div className="mt-6 flex justify-between">
              <button
                onClick={() => setIsAddingReviewer(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
              >
                Submit New Reviewer
              </button>
              <button
                onClick={onClose}
                className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="space-y-4">
              <div>
                <label htmlFor="programName" className="block text-white mb-2">
                  Program Name
                </label>
                <input
                  id="programName"
                  type="text"
                  value={newReviewer.programName}
                  onChange={(e) =>
                    setNewReviewer((prev) => ({
                      ...prev,
                      programName: e.target.value,
                    }))
                  }
                  placeholder="Enter your program name"
                  className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-white mb-2">
                  Your Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={newReviewer.email}
                  onChange={(e) =>
                    setNewReviewer((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                  placeholder="Enter your email"
                  className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* <div>
                <label
                  htmlFor="walletAddress"
                  className="block text-white mb-2"
                >
                  Wallet Address
                </label>
                <input
                  id="walletAddress"
                  type="text"
                  value={newReviewer.walletAddress}
                  onChange={(e) =>
                    setNewReviewer((prev) => ({
                      ...prev,
                      walletAddress: e.target.value,
                    }))
                  }
                  placeholder="Enter wallet address"
                  className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div> */}
            </div>

            <div className="flex justify-between mt-6">
              <button
                onClick={() => setIsAddingReviewer(false)}
                className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitReviewer}
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
                disabled={
                  !newReviewer.programName ||
                  !newReviewer.email
                }
              >
                Submit Reviewer
              </button>
            </div>
          </div>
        )}
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
