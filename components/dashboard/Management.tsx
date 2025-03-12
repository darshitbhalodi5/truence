"use client";

import {
  ChevronDown,
  Filter,
  Search,
  EllipsisVertical,
  Pin,
  ClipboardList,
  Check,
  Vote,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { ReviewSubmission, FileData } from "@/types/reviewerData";
import { StatusCounts } from "@/types/statusCounter";
import { parseMisUseRange } from "@/utils/parseMisuseRange";
import { getCurrency } from "@/utils/networkCurrency";
import {
  StatusFilter,
  SortDirection,
  SortField,
  SeverityFilter,
} from "@/types/filterTypes";
import SortIcon from "@/components/sort-icon/SortIcon";
import SeverityInfo from "@/components/severity-change/SeverityInfo";
import StateHandler from "@/components/state-handle/StateHandler";
import ManagerProgramSummary from "@/components/manager-program-summary/ManagerProgramSummary";
import { Tooltip } from "@/components/tooltip/Tooltip";
import { VoteModal } from "@/components/vote-modal/VoteModal";
import { SubmissionDetails } from "@/components/submission-details/SubmissionDetails";
import { FileViewer } from "@/components/view-file/FileViewer";
import { usePin } from "@/hooks/usePin";
import Chat from "@/components/dashboard/Chat";
import { showCustomToast } from "@/components/custom-toast/CustomToast";

// Define ManagerData interface (similar to ReviewerData but for managers)
interface ManagerData {
  isManager: boolean;
  submissions: ReviewSubmission[];
  bounties: CombinedBounty[];
}

// Define CombinedBounty interface based on API response
interface CombinedBounty {
  _id: string;
  networkName: string;
  logoUrl: string;
  reviewerAddresses: string[];
  finalSeverity: boolean;
  initialSeverities: string[];
}

export function Management({
  walletAddress,
  isManager,
}: {
  walletAddress?: string;
  isManager: boolean;
}) {
  const [managerData, setManagerData] = useState<ManagerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<StatusFilter>("ALL");
  const [selectedSubmission, setSelectedSubmission] =
    useState<ReviewSubmission | null>(null);
  const [fileMetadata, setFileMetadata] = useState<Record<string, FileData>>(
    {}
  );
  const [viewingFile, setViewingFile] = useState<{
    url: string;
    name: string;
    contentType: string;
  } | null>(null);
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { pinnedSubmissions, togglePins, isPinned } = usePin({
    walletAddress,
    prefix: "management",
  });
  const [selectedSeverity, setSelectedSeverity] =
    useState<SeverityFilter>("ALL");

  const [isVoteModalOpen, setIsVoteModalOpen] = useState(false);
  const [votingSubmission, setVotingSubmission] =
    useState<ReviewSubmission | null>(null);
  const [voteComment, setVoteComment] = useState("");
  const [selectedVote, setSelectedVote] = useState<
    "accepted" | "rejected" | ""
  >("");
  const [selectedVoteSeverity, setSelectedVoteSeverity] = useState("");

  const [availableChats, setAvailableChats] = useState<
    Array<{
      reportId: string;
      bountyName: string;
      reportTitle: string;
    }>
  >([]);

  const [selectedChat, setSelectedChat] = useState<{
    reportId: string;
  } | null>(null);

  // Fetch manager data
  useEffect(() => {
    const fetchManagerData = async () => {
      if (!walletAddress) {
        setError("No wallet address provided");
        setLoading(false);
        return;
      }

      try {
        const submissionsResponse = await fetch(
          `/api/manager-data?address=${walletAddress}`
        );
        const submissionsData = await submissionsResponse.json();

        if (!submissionsResponse.ok) {
          throw new Error(
            submissionsData.error || "Failed to fetch review submissions"
          );
        }

        const chats: typeof availableChats = [];

        submissionsData.manager.submissions.forEach((submission: any) => {
          chats.push({
            reportId: submission._id,
            bountyName: submission.programName,
            reportTitle: submission.title,
          });
        });
        setAvailableChats(chats);

        // const response = await fetch(`/api/users/${walletAddress}/reports`);
        // if (!response.ok) throw new Error("Failed to fetch manager data");
        // const data = await response.json();
        console.log("submission data for manager", submissionsData);
        console.log(
          "submission data for manager submission",
          submissionsData.manager.submissions
        );
        console.log(
          "submission data for manager bounties",
          submissionsData.manager.bounties
        );
        setManagerData({
          isManager,
          submissions: submissionsData.manager.submissions || [],
          bounties: submissionsData.manager.bounties || [],
        });
      } catch (error) {
        console.error("Error fetching manager data:", error);
        setError(
          error instanceof Error
            ? error.message
            : "Failed to fetch manager data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchManagerData();
  }, [walletAddress]);

  // Function to handle submission updates from the modal
  const handleSubmissionUpdate = (updatedSubmission: ReviewSubmission) => {
    // Update the selected submission
    setSelectedSubmission(updatedSubmission);

    // Also update in the main submissions list
    setManagerData((prevManagerData) =>
      prevManagerData
        ? {
            ...prevManagerData,
            submissions: prevManagerData.submissions.map((sub) =>
              sub._id === updatedSubmission._id ? updatedSubmission : sub
            ),
          }
        : null
    );
  };

  // Filter and sort submissions
  const filteredSubmissions = useMemo(() => {
    if (!managerData?.submissions) return [];

    let filtered = managerData.submissions.filter((submission) => {
      const matchesSearch =
        submission.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        submission.programName
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
      const matchesStatus =
        selectedStatus === "ALL" || submission.status === selectedStatus;
      const matchesSeverity =
        selectedSeverity === "ALL" ||
        submission.severityLevel === selectedSeverity;
      return matchesSearch && matchesStatus && matchesSeverity;
    });

    filtered = filtered.sort((a, b) => {
      const aBookmarked = pinnedSubmissions.includes(a._id);
      const bBookmarked = pinnedSubmissions.includes(b._id);

      if (aBookmarked && !bBookmarked) return -1;
      if (!aBookmarked && bBookmarked) return 1;

      if (sortField === "createdAt") {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
      } else if (sortField === "misUseRange") {
        const valueA = parseMisUseRange(a.misUseRange);
        const valueB = parseMisUseRange(b.misUseRange);
        return sortDirection === "asc" ? valueA - valueB : valueB - valueA;
      }
      return 0;
    });

    return filtered;
  }, [
    managerData?.submissions,
    searchQuery,
    selectedStatus,
    sortField,
    sortDirection,
    selectedSeverity,
    pinnedSubmissions,
  ]);

  const hasManagerVoted = (submission: ReviewSubmission): boolean => {
    return !!submission?.managerVote;
  };

  const handleSubmitVote = async () => {
    if (!votingSubmission || !selectedVote) return;

    try {
      await handleUpdateStatus(
        votingSubmission._id,
        selectedVote,
        selectedVoteSeverity || undefined,
        voteComment
      );
      setIsVoteModalOpen(false);
      setVotingSubmission(null);
      setVoteComment("");
      setSelectedVote("");
      setSelectedVoteSeverity("");
    } catch (error) {
      console.error("Error submitting vote:", error);
    }
  };

  // Close the vote modal and reset state
  const handleCloseVoteModal = () => {
    setIsVoteModalOpen(false);
    setVotingSubmission(null);
    setVoteComment("");
    setSelectedVote("");
    setSelectedVoteSeverity("");
  };

  // Update submission status
  const handleUpdateStatus = async (
    submissionId: string,
    newStatus: string,
    reviewerSeverity?: string,
    comment?: string
  ) => {
    try {
      const response = await fetch(`/api/submissions/${submissionId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus, reviewerSeverity, comment }),
      });

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error || "Failed to update status");

      if (managerData) {
        const updatedSubmissions = managerData.submissions.map((sub) =>
          sub._id === submissionId ? { ...sub, ...data.submission } : sub
        );
        setManagerData({ ...managerData, submissions: updatedSubmissions });
      }
      showCustomToast("success", `Status updated to ${newStatus}`);
    } catch (error) {
      console.error("Error updating status:", error);
      showCustomToast(
        "error",
        error instanceof Error ? error.message : "Failed to update status"
      );
    }
  };

  // Fetch file metadata
  const fetchFileMetadata = async (fileId: string) => {
    try {
      if (!fileId) return;
      const cleanFileId = fileId.split("/").pop();
      if (!cleanFileId) throw new Error("Invalid file ID");

      const response = await fetch(`/api/files/${cleanFileId}/metadata`);
      if (!response.ok) throw new Error("Failed to fetch file metadata");

      const metadata = await response.json();
      setFileMetadata((prev) => ({ ...prev, [fileId]: metadata }));
    } catch (error) {
      console.error("Error fetching file metadata:", error);
      showCustomToast("error", "Failed to fetch file information");
    }
  };

  useEffect(() => {
    if (selectedSubmission?.files) {
      selectedSubmission.files.forEach((fileId) => {
        if (!fileMetadata[fileId]) fetchFileMetadata(fileId);
      });
    }
  }, [selectedSubmission]);

  // View file
  const handleViewFile = async (fileId: string, metadata: FileData) => {
    try {
      const cleanFileId = fileId.split("/").pop();
      if (!cleanFileId) throw new Error("Invalid file ID");

      const response = await fetch(`/api/files/${cleanFileId}`);
      if (!response.ok) throw new Error("Failed to fetch file");

      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      setViewingFile({
        url: blobUrl,
        name: metadata.originalName || metadata.filename,
        contentType: metadata.contentType,
      });
    } catch (error) {
      console.error("Error viewing file:", error);
      showCustomToast("error", "Failed to load file for viewing");
    }
  };

  // Severity configuration
  const severityConfig = {
    ALL: { color: "", tooltip: "All Severities" },
    critical: { color: "bg-red-500", tooltip: "Critical" },
    high: { color: "bg-orange-500", tooltip: "High" },
    medium: { color: "bg-yellow-500", tooltip: "Medium" },
    low: { color: "bg-blue-500", tooltip: "Low" },
  };

  // Handle sorting
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  // Cleanup blob URLs
  useEffect(() => {
    return () => {
      if (viewingFile?.url) URL.revokeObjectURL(viewingFile.url);
    };
  }, [viewingFile]);

  // Calculate status counts
  const statusCounts: StatusCounts = managerData?.submissions?.reduce(
    (counts: StatusCounts, submission) => {
      counts[submission.status] = (counts[submission.status] || 0) + 1;
      return counts;
    },
    { all: managerData?.submissions?.length || 0 }
  ) || { all: 0 };

  const bountyStatusCounts = useMemo(() => {
    if (!managerData?.submissions || !managerData?.bounties) return {};

    return managerData.bounties.reduce((acc, bounty) => {
      const bountySubmissions = managerData.submissions.filter(
        (submission) => submission.programName === bounty.networkName
      );
      const counts = bountySubmissions.reduce(
        (counts: StatusCounts, submission) => {
          counts[submission.status] = (counts[submission.status] || 0) + 1;
          return counts;
        },
        { all: bountySubmissions.length }
      );
      acc[bounty.networkName] = counts;
      return acc;
    }, {} as Record<string, StatusCounts>);
  }, [managerData?.submissions, managerData?.bounties]);

  // Main render
  return (
    <>
      <StateHandler
        isLoading={loading}
        loadingText="Fetching latest submissions for management"
        error={error}
        errorTitle="Error Loading Management Data"
        notAuthorized={!managerData?.isManager}
        notAuthorizedTitle="Not a Manager!"
        notAuthorizedMessage="You are not assigned as a manager for any bounties."
        isEmpty={
          !managerData?.submissions || managerData.submissions.length === 0
        }
        emptyTitle="No Submissions to Manage"
        emptyMessage="There are no submissions to manage at this time."
      >
        <div className="space-y-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl sm:text-2xl font-semibold text-white">
              Manage Submissions
            </h2>
          </div>

          <ManagerProgramSummary
            bounties={
              managerData?.bounties.map((bounty) => ({
                networkName: bounty.networkName,
                logoUrl: bounty.logoUrl,
                reviewerAddresses: bounty.reviewerAddresses,
                statusCounts: bountyStatusCounts[bounty.networkName] || {
                  all: 0,
                },
              })) || []
            }
            statusCounts={statusCounts}
          />

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
            <div className="relative flex-grow max-w-full sm:max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-white" />
              </div>
              <input
                type="text"
                placeholder="Search by submission title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-full bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#99168E] focus:border-transparent"
              />
            </div>

            <div className="flex flex-wrap gap-2 text-[#FAFCA3]">
              {[
                { status: "ALL", count: statusCounts.all || 0 },
                { status: "pending", count: statusCounts.pending || 0 },
                { status: "reviewing", count: statusCounts.reviewing || 0 },
                { status: "accepted", count: statusCounts.accepted || 0 },
                { status: "rejected", count: statusCounts.rejected || 0 },
              ].map(({ status, count }) => (
                <button
                  key={status}
                  onClick={() => setSelectedStatus(status as StatusFilter)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200 border ${
                    selectedStatus === status
                      ? "border-[#99168E] bg-[#99168E]"
                      : "bg-gray-800 border-transparent hover:border-[#99168E]"
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)} ({count})
                </button>
              ))}
            </div>

            <div className="relative">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center gap-2 bg-gray-800 text-white rounded-lg px-4 py-2.5 hover:bg-gray-700 transition-colors duration-200 border border-gray-700"
              >
                <Filter className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {selectedSeverity === "ALL"
                    ? "All Severities"
                    : selectedSeverity.charAt(0).toUpperCase() +
                      selectedSeverity.slice(1)}
                </span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    isFilterOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              {isFilterOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg border border-gray-700 py-1 z-50">
                  <button
                    onClick={() => {
                      setSelectedSeverity("ALL");
                      setIsFilterOpen(false);
                    }}
                    className={`w-full px-4 py-2 text-sm text-left flex items-center gap-2 hover:bg-gray-700 transition-colors duration-200 ${
                      selectedSeverity === "ALL" ? "bg-gray-700" : ""
                    }`}
                  >
                    All Severities
                  </button>
                  {Object.entries(severityConfig)
                    .filter(([key]) => key !== "ALL")
                    .map(([severity, config]) => (
                      <button
                        key={severity}
                        onClick={() => {
                          setSelectedSeverity(severity as SeverityFilter);
                          setIsFilterOpen(false);
                        }}
                        className={`w-full px-4 py-2 text-sm text-left flex items-center gap-2 hover:bg-gray-700 transition-colors duration-200 ${
                          selectedSeverity === severity ? "bg-gray-700" : ""
                        }`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${config.color}`}
                        />
                        {config.tooltip}
                      </button>
                    ))}
                </div>
              )}
            </div>
          </div>

          {/* Submissions Table */}
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <div className="inline-block min-w-full align-middle">
              <div className="scroll-container overflow-y-auto max-h-[600px] scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-700 scrollbar-thumb-rounded-lg">
                <table className="w-full text-sm text-left text-gray-400">
                  <thead className="text-sm text-gray-400 sticky top-0 bg-gray-900 z-10">
                    <tr>
                      <th className="px-4 py-3 hidden md:table-cell">
                        Program
                      </th>
                      <th className="px-4 py-3">Title</th>
                      <th className="px-4 py-3">Submission Address</th>
                      <th className="px-4 py-3 hidden sm:table-cell">
                        Severity
                      </th>
                      <th
                        className="px-4 py-3 hidden lg:table-cell cursor-pointer"
                        onClick={() => handleSort("misUseRange")}
                      >
                        <div className="flex items-center space-x-1">
                          <span>Misuse Amt.</span>
                          <SortIcon
                            field="misUseRange"
                            sortField={sortField}
                            sortDirection={sortDirection}
                          />
                        </div>
                      </th>
                      <th
                        className="px-4 py-3 hidden sm:table-cell cursor-pointer"
                        onClick={() => handleSort("createdAt")}
                      >
                        <div className="flex items-center space-x-1">
                          <span>Submission Date</span>
                          <SortIcon
                            field="createdAt"
                            sortField={sortField}
                            sortDirection={sortDirection}
                          />
                        </div>
                      </th>
                      <th className="px-4 py-3">Manager Vote</th>
                      <th className="px-2 py-3">Pin Submission</th>
                      <th className="px-4 py-3">Details | Vote</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSubmissions.map((submission) => {
                      const bounty = managerData?.bounties.find(
                        (b) => b.networkName === submission.programName
                      );
                      const hasVoted = hasManagerVoted(submission);

                      return (
                        <tr
                          key={submission._id}
                          className="hover:bg-gray-800/50"
                        >
                          <td className="px-4 py-3 hidden md:table-cell">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 relative flex-shrink-0">
                                <img
                                  src={bounty?.logoUrl}
                                  alt={`${submission.programName} Logo`}
                                  className="w-7 h-7 rounded-full"
                                />
                              </div>
                              <span className="text-sm text-white truncate">
                                {submission.programName}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3 font-medium text-white">
                            {submission.title}
                          </td>
                          <td className="px-4 py-3 font-medium text-white">
                            {`${submission.walletAddress.slice(
                              0,
                              8
                            )}...${submission.walletAddress.slice(-6)}`}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center space-x-2">
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  submission.severityLevel === "critical"
                                    ? "bg-red-500/10 text-red-500"
                                    : submission.severityLevel === "high"
                                    ? "bg-orange-500/10 text-orange-500"
                                    : submission.severityLevel === "medium"
                                    ? "bg-yellow-500/10 text-yellow-500"
                                    : "bg-blue-500/10 text-blue-500"
                                }`}
                              >
                                {submission.severityLevel.toUpperCase()}
                              </span>
                              <SeverityInfo
                                submitterSeverity={submission.severityLevel}
                                reviewerSeverity={submission.reviewerSeverity}
                              />
                            </div>
                          </td>
                          <td className="px-4 py-3 hidden lg:table-cell">
                            {submission.misUseRange
                              ? `${submission.misUseRange} ${getCurrency(
                                  submission.programName
                                )}`
                              : "-"}
                          </td>
                          <td className="px-4 py-3 text-gray-400">
                            {new Date(
                              submission.createdAt
                            ).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3 text-center">
                            {submission.reviewVotes &&
                            submission.reviewVotes.length > 0 ? (
                              <div className="flex justify-center space-x-1">
                                {submission.reviewVotes.map((vote, index) => {
                                  let voteIcon =
                                    vote.vote === "accepted" ? (
                                      <ThumbsUp className="w-6 h-6" />
                                    ) : (
                                      <ThumbsDown className="w-6 h-6" />
                                    );
                                  let voteColor =
                                    vote.vote === "accepted"
                                      ? vote.severity
                                        ? {
                                            critical: "text-red-500",
                                            high: "text-orange-500",
                                            medium: "text-yellow-500",
                                            low: "text-blue-500",
                                          }[vote.severity.toLowerCase()] ||
                                          "text-green-500"
                                        : "text-green-500"
                                      : "text-red-500"; // Rejected votes are always red

                                  return (
                                    <span
                                      key={index}
                                      className={`${voteColor} text-lg`}
                                      title={`${vote.reviewerAddress}\nVote: ${
                                        vote.vote
                                      }${
                                        vote.severity
                                          ? ` (Severity: ${vote.severity})`
                                          : ""
                                      }${
                                        vote.comment
                                          ? `\nComment: ${vote.comment}`
                                          : ""
                                      }`}
                                    >
                                      {voteIcon}
                                    </span>
                                  );
                                })}
                              </div>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </td>
                          <td className="px-2 py-3 text-center">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                togglePins(submission._id);
                              }}
                              className="focus:outline-none hover:scale-110 transition-transform duration-200"
                              title={
                                isPinned(submission._id)
                                  ? "Remove bookmark"
                                  : "Add bookmark"
                              }
                            >
                              <Pin
                                className={`w-5 h-5 ${
                                  isPinned(submission._id)
                                    ? "text-[#FAFCA3]"
                                    : "text-gray-400 hover:text-[#FAFCA3]"
                                }`}
                                fill={
                                  isPinned(submission._id) ? "#FAFCA3" : "none"
                                }
                              />
                            </button>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center space-x-2">
                              <Tooltip text="Check submission details for review">
                                <button
                                  onClick={() =>
                                    setSelectedSubmission(submission)
                                  }
                                  className="text-[#FAFCA3] hover:text-[#99168E]"
                                >
                                  <ClipboardList className="w-5 h-5" />
                                </button>
                              </Tooltip>
                              <EllipsisVertical className="w-5 h-5 text-orange-500" />

                              <button
                                onClick={() => {
                                  if (!hasVoted) {
                                    setVotingSubmission(submission);
                                    setIsVoteModalOpen(true);
                                  }
                                }}
                                disabled={hasVoted}
                                className={`px-3 py-1 text-[#FAFCA3] rounded-full ${
                                  hasVoted
                                    ? "opacity-50 cursor-not-allowed"
                                    : "hover:text-[#99168E]"
                                }`}
                              >
                                {hasVoted ? (
                                  <Tooltip text="Already voted!">
                                    <Check className="w-4 h-4" />
                                  </Tooltip>
                                ) : (
                                  <Tooltip text="Give final vote">
                                    <Vote className="w-5 h-5" />
                                  </Tooltip>
                                )}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Voting Modal */}
          {isVoteModalOpen && votingSubmission && (
            <VoteModal
              isOpen={isVoteModalOpen}
              onClose={handleCloseVoteModal}
              votingSubmission={votingSubmission}
              voteComment={voteComment}
              setVoteComment={setVoteComment}
              selectedVote={selectedVote}
              setSelectedVote={setSelectedVote}
              selectedVoteSeverity={selectedVoteSeverity}
              setSelectedVoteSeverity={setSelectedVoteSeverity}
              handleSubmitVote={handleSubmitVote}
              bountiesData={managerData}
            />
          )}

          {/* Submission Details Modal */}
          {selectedSubmission && (
            <SubmissionDetails
              submission={selectedSubmission}
              fileMetadata={fileMetadata}
              onClose={() => setSelectedSubmission(null)}
              onViewFile={handleViewFile}
              managerAddress={walletAddress || ""}
              onSubmissionUpdate={handleSubmissionUpdate}
            />
          )}

          {/* File Viewer Modal */}
          {viewingFile && (
            <FileViewer
              isOpen={!!viewingFile}
              file={viewingFile}
              onClose={() => {
                if (viewingFile?.url) {
                  URL.revokeObjectURL(viewingFile.url);
                }
                setViewingFile(null);
              }}
            />
          )}
          <div className="mt-4 md:mt-6">
            <Chat
              reportId={selectedChat?.reportId}
              onSelectChat={(reportId) => setSelectedChat({ reportId })}
              availableChats={availableChats}
            />
          </div>
        </div>
      </StateHandler>
    </>
  );
}
