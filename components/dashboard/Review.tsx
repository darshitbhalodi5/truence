"use client";

import {
  ChevronDown,
  ChevronRight,
  Filter,
  Search,
  EllipsisVertical,
  X,
  Eye,
  ClipboardList,
  Vote,
  Check,
  Pin,
} from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { toast } from "react-hot-toast";
import { ReviewSubmission, ReviewerData, FileData } from "@/types/reviewerData";
import { StatusCounts } from "@/types/statusCounter";
import { parseMisUseRange } from "@/utils/parseMisuseRange";
import { getCurrency } from "@/utils/networkCurrency";
import {
  StatusFilter,
  SortDirection,
  SortField,
  SeverityFilter,
} from "@/utils/filterTypes";
import SortIcon from "@/components/sort-icon/SortIcon";
import SeverityInfo from "@/components/severity-change/SeverityInfo";
import StateHandler from "@/components/state-handle/StateHandler";
import { Tooltip } from "@/components/tooltip/Tooltip";

export function Review({
  walletAddress,
  isReviewer,
}: {
  walletAddress?: string;
  isReviewer: boolean;
}) {
  const [reviewData, setReviewData] = useState<ReviewerData | null>(null);
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
  const [bookmarkedSubmissions, setBookmarkedSubmissions] = useState<string[]>(
    []
  );

  const [isVoteModalOpen, setIsVoteModalOpen] = useState(false);
  const [votingSubmission, setVotingSubmission] =
    useState<ReviewSubmission | null>(null);
  const [voteComment, setVoteComment] = useState("");
  const [selectedVote, setSelectedVote] = useState<
    "accepted" | "rejected" | ""
  >("");
  const [selectedVoteSeverity, setSelectedVoteSeverity] = useState("");

  const bookmarkKey = walletAddress
    ? `reviewBookmarks_${walletAddress}`
    : "reviewBookmarks";

  const [selectedSeverity, setSelectedSeverity] =
    useState<SeverityFilter>("ALL");

  useEffect(() => {
    const fetchReviewData = async () => {
      if (!walletAddress) {
        setError("No wallet address provided");
        setLoading(false);
        return;
      }

      try {
        const submissionsResponse = await fetch(
          `/api/reviewer-data?address=${walletAddress}`
        );
        const submissionsData = await submissionsResponse.json();

        if (!submissionsResponse.ok) {
          throw new Error(
            submissionsData.error || "Failed to fetch review submissions"
          );
        }

        setReviewData({
          isReviewer,
          submissions: submissionsData.reviewer.submissions || [],
          bounties: submissionsData.reviewer.bounties || [],
        });
      } catch (error) {
        console.error("Error fetching review data:", error);
        setError(
          error instanceof Error ? error.message : "Failed to fetch review data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchReviewData();
  }, [walletAddress]);

  const hasReviewerVoted = (submission: ReviewSubmission): boolean => {
    if (!walletAddress || !submission.reviewVotes) return false;
    return submission.reviewVotes.some(
      (vote) => vote.reviewerAddress === walletAddress
    );
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

  // Load bookmarks from localStorage on component mount/when wallet changes
  useEffect(() => {
    const savedBookmarks = localStorage.getItem(bookmarkKey);

    if (savedBookmarks) {
      try {
        const parsedBookmarks = JSON.parse(savedBookmarks);
        if (Array.isArray(parsedBookmarks)) {
          setBookmarkedSubmissions(parsedBookmarks);
        } else {
          console.error("Stored bookmarks are not an array:", parsedBookmarks);
          setBookmarkedSubmissions([]);
        }
      } catch (e) {
        console.error("Error parsing bookmarks from localStorage:", e);
        setBookmarkedSubmissions([]);
      }
    } else {
      setBookmarkedSubmissions([]);
    }
  }, [bookmarkKey]);

  // Save bookmarks to localStorage when they change
  useEffect(() => {
    if (bookmarkedSubmissions.length > 0) {
      localStorage.setItem(bookmarkKey, JSON.stringify(bookmarkedSubmissions));
    }
  }, [bookmarkedSubmissions, bookmarkKey]);

  // Function to toggle bookmark status
  const toggleBookmark = (submissionId: string) => {
    setBookmarkedSubmissions((prev) => {
      if (prev.includes(submissionId)) {
        return prev.filter((id) => id !== submissionId);
      } else {
        return [...prev, submissionId];
      }
    });
  };

  // Filter submissions data based on requirement
  const filteredSubmissions = useMemo(() => {
    if (!reviewData?.submissions) return [];

    // First filter the submissions
    let filtered = reviewData.submissions.filter((submission) => {
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

    // Sort submissions
    filtered = filtered.sort((a, b) => {
      // First by bookmark status
      const aBookmarked = bookmarkedSubmissions.includes(a._id);
      const bBookmarked = bookmarkedSubmissions.includes(b._id);

      if (aBookmarked && !bBookmarked) return -1;
      if (!aBookmarked && bBookmarked) return 1;

      // Then by the selected sort field
      if (sortField === "createdAt") {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
      } else if (sortField === "misUseRange") {
        const valueA = parseMisUseRange(a.misUseRange);
        const valueB = parseMisUseRange(b.misUseRange);
        return sortDirection === "asc" ? valueA - valueB : valueB - valueA;
      }

      // Add other sort fields if needed
      return 0;
    });

    return filtered;
  }, [
    reviewData?.submissions,
    searchQuery,
    selectedStatus,
    sortField,
    sortDirection,
    selectedSeverity,
    bookmarkedSubmissions,
  ]);

  const handleUpdateStatus = async (
    submissionId: string,
    vote: "accepted" | "rejected",
    severity?: string,
    comment?: string
  ) => {
    try {
      // Get current reviewer's wallet address from your auth system
      const reviewerAddress = walletAddress; // Replace with your actual auth method
      if (!reviewerAddress) throw new Error("No reviewer address available");

      console.log("Reviewer voting on submission:", {
        submissionId,
        vote,
        severity,
        reviewerAddress,
      });

      const response = await fetch(`/api/submissions/${submissionId}/vote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reviewerAddress,
          vote,
          severity: vote === "accepted" ? severity : undefined,
          comment,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit reviewer vote");
      }

      // Update the submission in the list
      if (reviewData) {
        const updatedSubmissions = reviewData.submissions.map((sub) =>
          sub._id === submissionId ? { ...sub, ...data.submission } : sub
        );
        setReviewData({ ...reviewData, submissions: updatedSubmissions });
      }

      // Show appropriate message based on voting status
      if (data.quorumReached) {
        toast.success(
          `Vote recorded. Quorum reached! Waiting for manager's final decision.`
        );
      } else {
        toast.success(
          `Vote recorded. ${data.voteSummary.totalVotes} votes so far.`
        );
      }

      return data;
    } catch (error) {
      console.error("Error submitting reviewer vote:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to submit vote"
      );
      return null;
    }
  };

  const fetchFileMetadata = async (fileId: string) => {
    try {
      if (!fileId) return;

      // Extract just the file ID from the full path
      const cleanFileId = fileId.split("/").pop();
      console.log("Fetching metadata for file:", {
        originalFileId: fileId,
        cleanFileId,
      });

      if (!cleanFileId) {
        throw new Error("Invalid file ID");
      }

      const response = await fetch(`/api/files/${cleanFileId}/metadata`);

      if (!response.ok) {
        console.error("Failed to fetch metadata:", {
          status: response.status,
          statusText: response.statusText,
          fileId,
          cleanFileId,
        });
        throw new Error(
          `Failed to fetch file metadata: ${response.statusText}`
        );
      }

      const metadata = await response.json();
      console.log("Received metadata:", metadata);

      setFileMetadata((prev) => ({
        ...prev,
        [fileId]: metadata,
      }));
    } catch (error) {
      console.error("Error fetching file metadata:", error);
      toast.error("Failed to fetch file information");
    }
  };

  useEffect(() => {
    if (selectedSubmission?.files) {
      console.log("Selected submission files:", selectedSubmission.files);
      selectedSubmission.files.forEach((fileId) => {
        if (!fileMetadata[fileId]) {
          console.log("Fetching metadata for file ID:", fileId);
          fetchFileMetadata(fileId);
        }
      });
    }
  }, [selectedSubmission]);

  const handleViewFile = async (fileId: string, metadata: FileData) => {
    try {
      // Extract just the file ID from the full path
      const cleanFileId = fileId.split("/").pop();
      console.log("Viewing file:", {
        originalFileId: fileId,
        cleanFileId,
        metadata,
      });

      if (!cleanFileId) {
        throw new Error("Invalid file ID");
      }

      const response = await fetch(`/api/files/${cleanFileId}`);

      if (!response.ok) {
        console.error("Failed to fetch file:", {
          status: response.status,
          statusText: response.statusText,
          fileId,
          cleanFileId,
        });
        throw new Error(`Failed to fetch file: ${response.statusText}`);
      }

      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      setViewingFile({
        url: blobUrl,
        name: metadata.originalName || metadata.filename,
        contentType: metadata.contentType,
      });
    } catch (error) {
      console.error("Error viewing file:", error);
      toast.error("Failed to load file for viewing");
    }
  };

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

  // Add cleanup for blob URLs
  useEffect(() => {
    return () => {
      if (viewingFile) {
        URL.revokeObjectURL(viewingFile.url);
      }
    };
  }, [viewingFile]);

  // Submission count for each status (Accepted, Rejected, Pending, Reviewing)
  const statusCounts: StatusCounts = reviewData?.submissions?.reduce(
    (counts: StatusCounts, submission) => {
      counts[submission.status] = (counts[submission.status] || 0) + 1;
      return counts;
    },
    { all: reviewData?.submissions?.length || 0 }
  ) || { all: 0 };

  return (
    <>
      <StateHandler
        isLoading={loading}
        loadingText="Fetching latest submissions for review"
        error={error}
        errorTitle="Error Loading Review Data"
        notAuthorized={!reviewData?.isReviewer}
        notAuthorizedTitle="Not a Reviewer!"
        notAuthorizedMessage="You are not assigned as a reviewer for any programs."
        isEmpty={
          !reviewData?.submissions || reviewData.submissions.length === 0
        }
        emptyTitle="No submissions to Review"
        emptyMessage="There are no submissions to review at this time."
      >
        <div className="space-y-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl sm:text-2xl font-semibold text-white">
              Review Submissions
            </h2>
          </div>

          {/* Search and status based filter */}
          <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
            {/* Searchbar */}
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

            {/* Buttons for status based submission filter */}
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
                      ? "border-[#99168E] bg-[#99168E]" // Active state
                      : "bg-gray-800 border-transparent hover:border-[#99168E]" // Default & Hover
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)} ({count})
                </button>
              ))}
            </div>

            <div className="relative">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center gap-2 bg-gray-800 text-white rounded-lg px-4 py-2.5 
              hover:bg-gray-700 transition-colors duration-200 border border-gray-700"
              >
                <Filter className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {selectedSeverity === "ALL"
                    ? "All Severities"
                    : selectedSeverity.charAt(0).toUpperCase() +
                      selectedSeverity.slice(1)}
                </span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 
    ${isFilterOpen ? "rotate-180" : ""}`}
                />
              </button>

              {isFilterOpen && (
                <div
                  className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg 
              border border-gray-700 py-1 z-50"
                >
                  <button
                    onClick={() => {
                      setSelectedSeverity("ALL");
                      setIsFilterOpen(false);
                    }}
                    className={`w-full px-4 py-2 text-sm text-left flex items-center gap-2 
                hover:bg-gray-700 transition-colors duration-200
                ${selectedSeverity === "ALL" ? "bg-gray-700" : ""}`}
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
                        className={`w-full px-4 py-2 text-sm text-left flex items-center gap-2 
                    hover:bg-gray-700 transition-colors duration-200
                    ${selectedSeverity === severity ? "bg-gray-700" : ""}`}
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
                      <th className="px-2 py-3">Pin Submission</th>
                      <th className="px-4 py-3">Details | Vote</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSubmissions.map((submission) => {
                      const bounty = reviewData?.bounties.find(
                        (b) => b.networkName === submission.programName
                      );

                      const hasVoted = hasReviewerVoted(submission);

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
                                className={`px-2 py-1 rounded-full text-xs font-medium
                        ${
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
                          <td className="px-2 py-3 text-center">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleBookmark(submission._id);
                              }}
                              className="focus:outline-none"
                            >
                              {bookmarkedSubmissions.includes(
                                submission._id
                              ) ? (
                                <Pin
                                  className="w-5 h-5 text-[#FAFCA3]"
                                  fill="#FAFCA3"
                                />
                              ) : (
                                <Pin className="w-5 h-5" />
                              )}
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
                                  <Tooltip text="Cast your vote">
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
            <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-2 sm:p-4 z-50 backdrop-blur-sm overflow-y-auto">
              <div className="bg-[#00041B] rounded-xl p-3 sm:p-6 max-w-md w-full border border-[#99168E] shadow-xl">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-[#FAFCA3]">
                    Vote on Submission
                  </h3>
                  <button
                    onClick={() => {
                      setIsVoteModalOpen(false);
                      setVotingSubmission(null);
                      setVoteComment("");
                      setSelectedVote("");
                      setSelectedVoteSeverity("");
                    }}
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

                  {selectedVote === "accepted" &&
                    (() => {
                      const bounty = reviewData?.bounties.find(
                        (b) => b.networkName === votingSubmission.programName
                      );
                      if (bounty?.finalSeverity) {
                        return (
                          <div>
                            <label className="text-sm font-medium text-white/80 block mb-2">
                              Severity
                            </label>
                            <select
                              value={selectedVoteSeverity}
                              onChange={(e) =>
                                setSelectedVoteSeverity(e.target.value)
                              }
                              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#99168E]"
                            >
                              <option value="">Select Severity</option>
                              {bounty.initialSeverities?.map((severity) => (
                                <option key={severity} value={severity}>
                                  {severity}
                                </option>
                              ))}
                            </select>
                          </div>
                        );
                      }
                      return null;
                    })()}

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
                      onClick={() => {
                        setIsVoteModalOpen(false);
                        setVotingSubmission(null);
                        setVoteComment("");
                        setSelectedVote("");
                        setSelectedVoteSeverity("");
                      }}
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
                          reviewData?.bounties.find(
                            (b) =>
                              b.networkName === votingSubmission.programName
                          )?.finalSeverity &&
                          !selectedVoteSeverity) ||
                        undefined
                      }
                      className="px-4 py-2 bg-[#99168E] text-[#FAFCA3] rounded-lg hover:bg-[#7A126F] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Submit Vote
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedSubmission && (
            <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-2 sm:p-4 z-50 backdrop-blur-sm overflow-y-auto">
              <div className="bg-[#00041B] rounded-xl p-3 sm:p-6 max-w-2xl w-full max-h-[90vh] border border-[#99168E] shadow-xl my-4">
                <div className="scroll-container overflow-y-auto max-h-[600px] scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-700 scrollbar-thumb-rounded-lg">
                  <div className="flex flex-wrap justify-between gap-4 bg-[#00041B] p-4 rounded-lg sticky top-0 z-10">
                    <h3 className="text-xl sm:text-2xl font-semibold text-[#FAFCA3] mb-1 mt-1 animate-pulse">
                      {selectedSubmission.title}
                    </h3>
                    <button
                      onClick={() => setSelectedSubmission(null)}
                      className="hover:bg-[#99168E] p-1 rounded-xl transition-colors"
                    >
                      <X className="w-6 h-6 text-[#FAFCA3]" />
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2 sm:gap-4 bg-[#00041B] p-2 sm:p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-white/80 mb-1">
                      Description:
                    </h4>
                    <div className="flex items-center space-x-2">
                      {selectedSubmission.description}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 sm:gap-4 bg-[#00041B] p-2 sm:p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-white/80 mb-1">
                      Status :{" "}
                    </h4>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium inline-flex items-center
                    ${
                      selectedSubmission.status === "pending"
                        ? "bg-yellow-500/10 text-yellow-500"
                        : selectedSubmission.status === "reviewing"
                        ? "bg-blue-500/10 text-blue-500"
                        : selectedSubmission.status === "accepted"
                        ? "bg-green-500/10 text-green-500"
                        : "bg-red-500/10 text-red-500"
                    }`}
                    >
                      {selectedSubmission.status.charAt(0).toUpperCase() +
                        selectedSubmission.status.slice(1)}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 sm:gap-4 bg-[#00041B] p-2 sm:p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-white/80 mb-1">
                      Severity :
                    </h4>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium
                      ${
                        selectedSubmission.severityLevel === "critical"
                          ? "bg-red-500/10 text-red-500"
                          : selectedSubmission.severityLevel === "high"
                          ? "bg-orange-500/10 text-orange-500"
                          : selectedSubmission.severityLevel === "medium"
                          ? "bg-yellow-500/10 text-yellow-500"
                          : "bg-blue-500/10 text-blue-500"
                      }`}
                      >
                        {selectedSubmission.severityLevel.toUpperCase()}
                      </span>
                      {selectedSubmission.reviewerSeverity &&
                        selectedSubmission.reviewerSeverity.toLowerCase() !==
                          selectedSubmission.severityLevel.toLowerCase() && (
                          <div className="flex items-center space-x-2">
                            <ChevronRight className="h-4 w-4 text-[#FAFCA3]" />
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium
        ${
          selectedSubmission.reviewerSeverity.toLowerCase() === "critical"
            ? "bg-red-500/10 text-red-500"
            : selectedSubmission.reviewerSeverity.toLowerCase() === "high"
            ? "bg-orange-500/10 text-orange-500"
            : selectedSubmission.reviewerSeverity.toLowerCase() === "medium"
            ? "bg-yellow-500/10 text-yellow-500"
            : "bg-blue-500/10 text-blue-500"
        }`}
                            >
                              {selectedSubmission.reviewerSeverity.toUpperCase()}
                            </span>
                          </div>
                        )}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 sm:gap-4 bg-[#00041B] p-2 sm:p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-white/80 mb-3">
                      Misuse Amount :
                    </h4>
                    <p className="text-white/90 text-sm whitespace-pre-line text-justify">
                      {selectedSubmission.misUseRange
                        ? `${selectedSubmission.misUseRange} ${getCurrency(
                            selectedSubmission.programName
                          )}`
                        : "-"}
                    </p>
                  </div>

                  {selectedSubmission?.files &&
                    selectedSubmission.files.length > 0 && (
                      <div className="gap-2 sm:gap-4 bg-[#00041B] p-2 sm:p-4 rounded-lg">
                        <h4 className="text-sm font-medium text-white/80 mb-3">
                          Attachments
                        </h4>
                        <div className="space-y-2">
                          {selectedSubmission.files.map((fileId) => {
                            const metadata = fileMetadata[fileId];
                            return (
                              <div
                                key={fileId}
                                className="flex items-center justify-between bg-gray-700/50 p-3 rounded-lg hover:bg-gray-700/80 transition-colors"
                              >
                                <div className="flex-1 mr-4">
                                  <div className="text-sm text-white/80 font-medium truncate">
                                    {metadata
                                      ? metadata.originalName ||
                                        metadata.filename
                                      : "Loading..."}
                                  </div>
                                </div>
                                <button
                                  onClick={() =>
                                    handleViewFile(fileId, metadata)
                                  }
                                  className="px-3 py-1.5 text-sm bg-[#FAFCA3] text-white rounded-md transition-colors"
                                >
                                  <Eye className="w-5 h-5 text-[#99168E]" />
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                </div>
              </div>
            </div>
          )}

          {/* File viewer modal */}
          {viewingFile && (
            <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-2 sm:p-4 z-50 backdrop-blur-sm overflow-y-auto">
              <div className="bg-[#00041B] rounded-xl p-3 sm:p-6 max-w-2xl w-full max-h-[90vh] border border-[#99168E] shadow-xl my-4">
                <div className="flex items-center justify-between p-4 border-b border-[#99168E]">
                  <h3 className="text-lg font-medium text-white/80 truncate">
                    {viewingFile.name}
                  </h3>
                  <button
                    onClick={() => {
                      URL.revokeObjectURL(viewingFile.url);
                      setViewingFile(null);
                    }}
                    className="hover:bg-[#99168E] p-1 rounded-xl transition-colors"
                  >
                    <X className="w-6 h-6 text-[#FAFCA3]" />
                  </button>
                </div>
                <div className="flex-1 overflow-auto p-4">
                  {viewingFile.contentType.startsWith("image/") ? (
                    <img
                      src={viewingFile.url}
                      alt={viewingFile.name}
                      className="max-w-full h-auto mx-auto"
                    />
                  ) : viewingFile.contentType === "application/pdf" ? (
                    <iframe
                      src={viewingFile.url}
                      className="w-full h-full min-h-[700px] rounded border border-[#FAFCA3] bg-[#99168E]"
                      title={viewingFile.name}
                    />
                  ) : viewingFile.contentType === "text/plain" ||
                    viewingFile.contentType === "text/markdown" ? (
                    <iframe
                      src={viewingFile.url}
                      className="w-full h-full min-h-[700px] rounded border border-[#FAFCA3] bg-[#99168E]"
                      title={viewingFile.name}
                    />
                  ) : (
                    <div className="bg-gray-900 p-4 rounded">
                      <p className="text-gray-300">
                        This file type ({viewingFile.contentType}) cannot be
                        previewed directly.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </StateHandler>
    </>
  );
}
