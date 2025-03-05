import { X } from "lucide-react";

interface CombinedBounty {
  networkName: string;
  logoUrl: string;
  finalSeverity?: boolean;
  initialSeverities?: string[];
}

interface VoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  votingSubmission: any;
  voteComment: string;
  setVoteComment: (value: string) => void;
  selectedVote: "accepted" | "rejected" | "";
  setSelectedVote: (value: "accepted" | "rejected" | "") => void;
  selectedVoteSeverity: string;
  setSelectedVoteSeverity: (value: string) => void;
  handleSubmitVote: () => void;
  bountiesData: { bounties: CombinedBounty[] } | null;
}

export function VoteModal({
  isOpen,
  onClose,
  votingSubmission,
  voteComment,
  setVoteComment,
  selectedVote,
  setSelectedVote,
  selectedVoteSeverity,
  setSelectedVoteSeverity,
  handleSubmitVote,
  bountiesData,
}: VoteModalProps) {
  if (!isOpen || !votingSubmission) return null;

  const bounty = bountiesData?.bounties.find(
    (b) => b.networkName === votingSubmission.programName
  );

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-2 sm:p-4 z-50 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#00041B] rounded-xl p-3 sm:p-6 max-w-md w-full border border-[#99168E] shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-[#FAFCA3]">
            Vote on Submission
          </h3>
          <button
            onClick={onClose}
            className="hover:bg-[#99168E] p-1 rounded-xl transition-colors"
          >
            <X className="w-6 h-6 text-[#FAFCA3]" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-white/80 block mb-2">
              Vote
            </label>
            <div className="flex space-x-4">
              <button
                onClick={() => setSelectedVote("accepted")}
                className={`px-4 py-2 rounded-lg flex-1 ${
                  selectedVote === "accepted"
                    ? "bg-green-600 text-white"
                    : "bg-gray-800 text-white hover:bg-gray-700"
                }`}
              >
                Accept
              </button>
              <button
                onClick={() => setSelectedVote("rejected")}
                className={`px-4 py-2 rounded-lg flex-1 ${
                  selectedVote === "rejected"
                    ? "bg-red-600 text-white"
                    : "bg-gray-800 text-white hover:bg-gray-700"
                }`}
              >
                Reject
              </button>
            </div>
          </div>

          {selectedVote === "accepted" && bounty?.finalSeverity && (
            <div>
              <label className="text-sm font-medium text-white/80 block mb-2">
                Severity
              </label>
              <select
                value={selectedVoteSeverity}
                onChange={(e) => setSelectedVoteSeverity(e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#99168E]"
              >
                <option value="">Select Severity</option>
                {bounty.initialSeverities?.map((severity: string) => (
                  <option key={severity} value={severity}>
                    {severity}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="text-sm font-medium text-white/80 block mb-2">
              Comment
            </label>
            <textarea
              value={voteComment}
              onChange={(e) => setVoteComment(e.target.value)}
              className="w-full h-24 p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#99168E]"
              placeholder="Add your comments here..."
            />
          </div>

          <div className="flex justify-end space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmitVote}
              disabled={
                !selectedVote ||
                (selectedVote === "accepted" &&
                  votingSubmission.programName &&
                  bounty?.finalSeverity &&
                  !selectedVoteSeverity)
              }
              className="px-4 py-2 bg-[#99168E] text-[#FAFCA3] rounded-lg hover:bg-[#7A126F] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Submit Vote
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
