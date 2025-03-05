import React, { useState } from "react";
import {
  ReviewerAddressModalProps,
  NetwrokItemProps,
  NetwrokListProps,
} from "@/types/programSummary";
import toast from "react-hot-toast";
import { X } from "lucide-react";
import {
  ClipboardDocumentIcon,
  ClipboardDocumentCheckIcon,
} from "@heroicons/react/24/outline";

const ReviewerAddressModal: React.FC<ReviewerAddressModalProps> = ({
  isOpen,
  onClose,
  networkName,
  reviewerAddresses,
}) => {
  const [isAddingReviewer, setIsAddingReviewer] = useState(false);
  const [copiedStates, setCopiedStates] = useState<{ [key: number]: boolean }>(
    {}
  );
  const [newReviewer, setNewReviewer] = useState({
    programName: networkName,
    email: "",
  });

  if (!isOpen) return null;

  const copyAddress = (index: number) => {
    navigator.clipboard.writeText(reviewerAddresses[index]);
    setCopiedStates((prev) => ({ ...prev, [index]: true }));
    setTimeout(() => {
      setCopiedStates((prev) => ({ ...prev, [index]: false }));
    }, 2000);
  };

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
    <div className="fixed inset-0 bg-black/70 bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#00041B] rounded-xl p-3 sm:p-6 max-w-md w-full border border-[#99168E] shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-[#FAFCA3]">
            {networkName} Reviewers
          </h2>
          <button
            onClick={onClose}
            className="hover:bg-[#99168E] p-1 rounded-xl transition-colors"
          >
            <X className="w-6 h-6 text-[#FAFCA3]" />
          </button>
        </div>

        {!isAddingReviewer ? (
          <div className="mt-4">
            <div className="mb-4">
              {reviewerAddresses.map((address, index) => (
                <div key={index} className="mb-2 flex items-center">
                  <p className="text-white bg-gray-700/30 p-2 text-sm font-mono flex-1 overflow-hidden overflow-ellipsis border-b border-[#99168E]">
                    {`${address.slice(0, 20)}...${address.slice(-15)}`}
                  </p>
                  <button onClick={() => copyAddress(index)} className="p-2">
                    {copiedStates[index] ? (
                      <ClipboardDocumentCheckIcon className="w-4 h-4 text-[#FAFCA3]" />
                    ) : (
                      <ClipboardDocumentIcon className="w-4 h-4 text-[#FAFCA3]" />
                    )}
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-6 flex justify-between">
              <button
                onClick={() => setIsAddingReviewer(true)}
                className="bg-gradient-to-r from from-[#990F62] via-[#99168E] to-[#991DB5] text-white py-2 px-4 rounded"
              >
                Change Reviewer
              </button>
              <button
                onClick={onClose}
                className="bg-gray-700/80 text-white py-2 px-4 rounded"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="programName"
                  className="block text-white/80 mb-2"
                >
                  Program Name
                </label>
                <input
                  id="programName"
                  type="text"
                  disabled
                  value={networkName}
                  onChange={(e) =>
                    setNewReviewer((prev) => ({
                      ...prev,
                      programName: e.target.value,
                    }))
                  }
                  placeholder={networkName}
                  className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#99168E]"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-white/80 mb-2">
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
                  className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#99168E]"
                />
              </div>
            </div>

            <div className="flex justify-between mt-6">
              <button
                onClick={() => setIsAddingReviewer(false)}
                className="bg-gray-700/80 text-white py-2 px-4 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitReviewer}
                className="bg-gradient-to-r from from-[#990F62] via-[#99168E] to-[#991DB5] text-white py-2 px-4 rounded"
                disabled={!newReviewer.programName || !newReviewer.email}
              >
                Submit
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const BountyNetworkItem: React.FC<NetwrokItemProps> = ({ bounty }) => {
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

  return (
    <div className="grid grid-cols-12 items-center border border-gray-700 rounded-lg p-3 bg-[#000625] text-white mb-2 gap-4">
      <div className="col-span-3 flex items-center">
        {bounty.logoUrl && (
          <img
            src={bounty.logoUrl}
            alt={`${bounty.networkName} logo`}
            className="w-7 h-7 mr-7"
          />
        )}
        <h3 className="text-lg font-semibold">{bounty.networkName}</h3>
      </div>
      <div className="col-span-6 grid grid-cols-5 gap-2">
        {[
          { status: "ALL", count: bounty.statusCounts.all || 0 },
          { status: "pending", count: bounty.statusCounts.pending || 0 },
          { status: "reviewing", count: bounty.statusCounts.reviewing || 0 },
          { status: "accepted", count: bounty.statusCounts.accepted || 0 },
          { status: "rejected", count: bounty.statusCounts.rejected || 0 },
        ].map(({ status, count }) => (
          <p
            key={status}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium text-center`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)} ({count})
          </p>
        ))}
      </div>
      <div className="col-span-3 flex justify-end">
        <button
          onClick={() => setIsAddressModalOpen(true)}
          className="text-white bg-gradient-to-r from from-[#990F62] via-[#99168E] to-[#991DB5] px-3 py-1.5 rounded-lg"
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
    </div>
  );
};

const ManagerProgramSummary: React.FC<NetwrokListProps> = ({ bounties }) => {
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
            <BountyNetworkItem key={index} bounty={bounty} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ManagerProgramSummary;
