"use client";

import { ChevronDown, ChevronUp, Filter, Search } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { toast } from "react-hot-toast";
import {
  ReviewSubmission,
  ReviewerData,
  FileData,
  StatusCounts,
} from "@/types/reviewerData";
import { parseMisUseRange } from "@/utils/parseMisuseRange";
import { LoadingSpinner } from "@/components/multi-purpose-loader/LoadingSpinner";
import { getCurrency } from "@/utils/networkCurrency";
import { formatFileSize } from "@/utils/fileSizeFormat";
import {
  StatusFilter,
  SortDirection,
  SortField,
  SeverityFilter,
} from "@/utils/filterTypes";
import SortIcon from "@/components/sort-icon/SortIcon";

export function Review({ walletAddress }: { walletAddress?: string }) {
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

  const bookmarkKey = walletAddress ? `reviewBookmarks_${walletAddress}` : null;

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

        // Fetch user role data to get bounties information
        const userDataResponse = await fetch(
          `/api/users/${walletAddress}/reports`
        );
        const userData = await userDataResponse.json();

        if (!userDataResponse.ok) {
          throw new Error(userData.error || "Failed to fetch reviewer data");
        }

        // Debug log for bounty data
        console.log("Fetched review data:", {
          bounties: userData.reviewer.bounties.map((b: any) => ({
            networkName: b.networkName,
            finalSeverity: b.details?.finalSeverity,
            initialSeverities: b.details?.initialSeverities,
          })),
        });

        setReviewData({
          isReviewer: userData.reviewer.isReviewer,
          submissions: submissionsData.submissions || [],
          bounties: userData.reviewer.bounties || [],
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

  useEffect(() => {
    if (!bookmarkKey) {
      setBookmarkedSubmissions([]);
      return;
    }

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
      // Initialize as empty array if nothing is stored
      setBookmarkedSubmissions([]);
    }
  }, [bookmarkKey]);

  useEffect(() => {
    if (bookmarkKey && bookmarkedSubmissions.length > 0) {
      localStorage.setItem(bookmarkKey, JSON.stringify(bookmarkedSubmissions));
    } else if (bookmarkKey && bookmarkedSubmissions.length === 0) {
      // Optionally clear the key when no bookmarks exist
      localStorage.removeItem(bookmarkKey);
    }
  }, [bookmarkedSubmissions, bookmarkKey]);

  // Load bookmarks from localStorage on component mount
  useEffect(() => {
    const savedBookmarks = localStorage.getItem("reviewBookmarks");
    if (savedBookmarks) {
      try {
        setBookmarkedSubmissions(JSON.parse(savedBookmarks));
      } catch (e) {
        console.error("Error loading bookmarks from localStorage:", e);
      }
    }
  }, []);

  // Save bookmarks to localStorage when changed
  useEffect(() => {
    localStorage.setItem(
      "reviewBookmarks",
      JSON.stringify(bookmarkedSubmissions)
    );
  }, [bookmarkedSubmissions]);

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
    newStatus: string,
    reviewerSeverity?: string
  ) => {
    try {
      // Debug log for status update
      console.log("Updating submission status:", {
        submissionId,
        newStatus,
        reviewerSeverity,
        submission: reviewData?.submissions.find((s) => s._id === submissionId),
        bounty: reviewData?.bounties.find(
          (b) =>
            b.networkName ===
            reviewData?.submissions.find((s) => s._id === submissionId)
              ?.programName
        ),
      });

      const response = await fetch(`/api/submissions/${submissionId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus, reviewerSeverity }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update status");
      }

      // Update the submission in the list
      if (reviewData) {
        const updatedSubmissions = reviewData.submissions.map((sub) =>
          sub._id === submissionId
            ? { ...sub, status: newStatus, reviewerSeverity }
            : sub
        );
        setReviewData({ ...reviewData, submissions: updatedSubmissions });

        // Debug log for updated submission
        console.log("Updated submission:", {
          before: reviewData.submissions.find((s) => s._id === submissionId),
          after: updatedSubmissions.find((s) => s._id === submissionId),
        });
      }

      toast.success(`Status updated to ${newStatus}`);
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to update status"
      );
    }
  };

  const renderSeverityInfo = (submission: ReviewSubmission) => {
    if (
      submission.reviewerSeverity &&
      submission.reviewerSeverity !== submission.severityLevel
    ) {
      return (
        <div className="relative group">
          <button className="ml-2 text-blue-500 hover:text-blue-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <div className="absolute z-10 w-64 px-4 py-3 text-sm bg-gray-800 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 -translate-x-1/2 left-1/2 mt-2">
            <p className="text-gray-300">
              Report accepted with severity change
            </p>
            <p className="mt-1">
              <span className="text-gray-400">Original: </span>
              <span className="text-yellow-500">
                {submission.severityLevel.toUpperCase()}
              </span>
            </p>
            <p className="mt-1">
              <span className="text-gray-400">New: </span>
              <span className="text-green-500">
                {submission.reviewerSeverity.toUpperCase()}
              </span>
            </p>
          </div>
        </div>
      );
    }
    return null;
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

  const toggleBookmark = (submissionId: string) => {
    setBookmarkedSubmissions((prev) =>
      prev.includes(submissionId)
        ? prev.filter((id) => id !== submissionId)
        : [...prev, submissionId]
    );
  };

  // Add cleanup for blob URLs
  useEffect(() => {
    return () => {
      if (viewingFile) {
        URL.revokeObjectURL(viewingFile.url);
      }
    };
  }, [viewingFile]);

  // Show loader
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <LoadingSpinner text="Fetching latest submissions for review" />
      </div>
    );
  }

  // Show errors
  if (error) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold text-[#AC350D] mb-2">
          Error Loading Review Data
        </h3>
        <p className="text-[#FAFCA3] text-lg">{error}</p>
      </div>
    );
  }

  // If user is not a reviewer
  if (!reviewData?.isReviewer) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold text-[#FAFCA3] mb-2">
          Not a Reviewer!
        </h3>
        <p className="text-white/80">
          You are not assigned as a reviewer for any programs.
        </p>
      </div>
    );
  }

  // If user is reviewer but submission is not there for review
  if (!reviewData.submissions || reviewData.submissions.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold text-[#FAFCA3] mb-2">
          No submissions to Review
        </h3>
        <p className="text-white/80">
          There are no submissions to review at this time.
        </p>
      </div>
    );
  }

  // Submission count for each status (Accepted, Rejected, Pending, Reviewing)
  const statusCounts: StatusCounts = reviewData?.submissions?.reduce(
    (counts: StatusCounts, submission) => {
      counts[submission.status] = (counts[submission.status] || 0) + 1;
      return counts;
    },
    { all: reviewData?.submissions?.length || 0 }
  );

  return (
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
                    <span className={`w-2 h-2 rounded-full ${config.color}`} />
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
                  <th className="px-4 py-3 hidden md:table-cell">Program</th>
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">Submission Address</th>
                  <th className="px-4 py-3 hidden sm:table-cell">Severity</th>
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
                  <th className="px-2 py-3 w-10">Bookmark</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSubmissions.map((submission) => {
                  const bounty = reviewData.bounties.find(
                    (b) => b.networkName === submission.programName
                  );
                  const showSeveritySelection =
                    bounty?.details?.finalSeverity &&
                    submission.status === "reviewing";

                  return (
                    <tr
                      key={submission._id}
                      className="bg-gray-800 border-b border-gray-700 hover:bg-gray-700"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center space-x-3">
                          {submission.bountyLogo ? (
                            <div className="w-8 h-8 relative flex-shrink-0">
                              <img
                                src={submission.bountyLogo}
                                alt={`${submission.programName} Logo`}
                                className="w-8 h-8 rounded-full object-cover"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src = "/default-bounty-logo.png";
                                }}
                              />
                            </div>
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center flex-shrink-0">
                              <span className="text-xs text-gray-300">
                                {submission.programName.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          )}
                          <span className="text-sm text-gray-300 truncate">
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
                            className={`px-2 py-1 rounded text-xs font-medium
                        ${
                          submission.severityLevel === "critical"
                            ? "bg-red-500/20 text-red-500"
                            : submission.severityLevel === "high"
                            ? "bg-orange-500/20 text-orange-500"
                            : submission.severityLevel === "medium"
                            ? "bg-yellow-500/20 text-yellow-500"
                            : "bg-blue-500/20 text-blue-500"
                        }`}
                          >
                            {submission.severityLevel.toUpperCase()}
                          </span>
                          {renderSeverityInfo(submission)}
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
                        {new Date(submission.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-2 py-3 text-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleBookmark(submission._id);
                          }}
                          className="focus:outline-none"
                        >
                          {bookmarkedSubmissions.includes(submission._id) ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 text-yellow-500 fill-current"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ) : (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 text-gray-400 hover:text-yellow-500"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                              />
                            </svg>
                          )}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => setSelectedSubmission(submission)}
                            className="text-blue-500 hover:text-blue-400"
                          >
                            View
                          </button>
                          {submission.status === "pending" && (
                            <button
                              onClick={() =>
                                handleUpdateStatus(submission._id, "reviewing")
                              }
                              className="text-yellow-500 hover:text-yellow-400 ml-2"
                            >
                              Review
                            </button>
                          )}
                          {submission.status === "reviewing" && (
                            <>
                              {showSeveritySelection ? (
                                <div className="flex items-center space-x-2">
                                  <select
                                    className="px-2 py-1 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    onChange={(e) =>
                                      handleUpdateStatus(
                                        submission._id,
                                        "accepted",
                                        e.target.value
                                      )
                                    }
                                  >
                                    <option value="">Select Severity</option>
                                    {bounty?.details?.initialSeverities?.map(
                                      (severity) => (
                                        <option key={severity} value={severity}>
                                          {severity}
                                        </option>
                                      )
                                    )}
                                  </select>
                                  <button
                                    onClick={() =>
                                      handleUpdateStatus(
                                        submission._id,
                                        "rejected"
                                      )
                                    }
                                    className="px-3 py-1 bg-red-500/20 text-red-500 rounded hover:bg-red-500/30"
                                  >
                                    Reject
                                  </button>
                                </div>
                              ) : (
                                <>
                                  <button
                                    onClick={() =>
                                      handleUpdateStatus(
                                        submission._id,
                                        "accepted"
                                      )
                                    }
                                    className="px-3 py-1 bg-green-500/20 text-green-500 rounded hover:bg-green-500/30"
                                  >
                                    Accept
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleUpdateStatus(
                                        submission._id,
                                        "rejected"
                                      )
                                    }
                                    className="px-3 py-1 bg-red-500/20 text-red-500 rounded hover:bg-red-500/30"
                                  >
                                    Reject
                                  </button>
                                </>
                              )}
                            </>
                          )}
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

      {selectedSubmission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-xl font-semibold text-white">
                {selectedSubmission.title}
              </h3>
              <button
                onClick={() => setSelectedSubmission(null)}
                className="text-gray-400 hover:text-white"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-1">
                  Description
                </h4>
                <p className="text-white whitespace-pre-wrap">
                  {selectedSubmission.description}
                </p>
              </div>

              <div className="flex space-x-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-1">
                    Status
                  </h4>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium
                    ${
                      selectedSubmission.status === "pending"
                        ? "bg-yellow-500/20 text-yellow-500"
                        : selectedSubmission.status === "reviewing"
                        ? "bg-blue-500/20 text-blue-500"
                        : selectedSubmission.status === "accepted"
                        ? "bg-green-500/20 text-green-500"
                        : "bg-red-500/20 text-red-500"
                    }`}
                  >
                    {selectedSubmission.status.charAt(0).toUpperCase() +
                      selectedSubmission.status.slice(1)}
                  </span>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-1">
                    Severity
                  </h4>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium
                      ${
                        selectedSubmission.severityLevel === "critical"
                          ? "bg-red-500/20 text-red-500"
                          : selectedSubmission.severityLevel === "high"
                          ? "bg-orange-500/20 text-orange-500"
                          : selectedSubmission.severityLevel === "medium"
                          ? "bg-yellow-500/20 text-yellow-500"
                          : "bg-blue-500/20 text-blue-500"
                      }`}
                    >
                      {selectedSubmission.severityLevel.toUpperCase()}
                    </span>
                    {selectedSubmission.reviewerSeverity &&
                      selectedSubmission.reviewerSeverity !==
                        selectedSubmission.severityLevel && (
                        <div className="flex items-center space-x-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 text-gray-400"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium
                          ${
                            selectedSubmission.reviewerSeverity.toLowerCase() ===
                            "critical"
                              ? "bg-red-500/20 text-red-500"
                              : selectedSubmission.reviewerSeverity.toLowerCase() ===
                                "high"
                              ? "bg-orange-500/20 text-orange-500"
                              : selectedSubmission.reviewerSeverity.toLowerCase() ===
                                "medium"
                              ? "bg-yellow-500/20 text-yellow-500"
                              : "bg-blue-500/20 text-blue-500"
                          }`}
                          >
                            {selectedSubmission.reviewerSeverity.toUpperCase()}
                          </span>
                        </div>
                      )}
                  </div>
                </div>
              </div>

              {selectedSubmission?.files &&
                selectedSubmission.files.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-2">
                      Attachments
                    </h4>
                    <div className="space-y-2">
                      {selectedSubmission.files.map((fileId) => {
                        const metadata = fileMetadata[fileId];
                        return (
                          <div
                            key={fileId}
                            className="flex items-center justify-between bg-gray-700 p-3 rounded"
                          >
                            <div className="flex-1 mr-4">
                              <div className="text-sm text-white font-medium truncate">
                                {metadata
                                  ? metadata.originalName || metadata.filename
                                  : "Loading..."}
                              </div>
                              {metadata && (
                                <div className="text-xs text-gray-400 mt-1">
                                  {metadata.contentType} •{" "}
                                  {formatFileSize(metadata.size)}
                                </div>
                              )}
                            </div>
                            {metadata && (
                              <button
                                onClick={() => handleViewFile(fileId, metadata)}
                                className="px-3 py-1.5 bg-blue-500/20 text-blue-400 rounded hover:bg-blue-500/30 transition-colors"
                              >
                                View File
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

              {selectedSubmission.status === "reviewing" && (
                <div className="flex justify-end space-x-4 mt-6">
                  <button
                    onClick={() => {
                      handleUpdateStatus(selectedSubmission._id, "rejected");
                      setSelectedSubmission(null);
                    }}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  >
                    Reject
                  </button>
                  {(() => {
                    const bounty = reviewData?.bounties.find(
                      (b) => b.networkName === selectedSubmission.programName
                    );
                    if (bounty?.details?.finalSeverity) {
                      return (
                        <div className="flex items-center space-x-2">
                          <select
                            className="px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onChange={(e) => {
                              if (e.target.value) {
                                handleUpdateStatus(
                                  selectedSubmission._id,
                                  "accepted",
                                  e.target.value
                                );
                                setSelectedSubmission(null);
                              }
                            }}
                            defaultValue=""
                          >
                            <option value="" disabled>
                              Select Severity
                            </option>
                            {bounty.details.initialSeverities?.map(
                              (severity) => (
                                <option key={severity} value={severity}>
                                  {severity}
                                </option>
                              )
                            )}
                          </select>
                        </div>
                      );
                    }
                    return (
                      <button
                        onClick={() => {
                          handleUpdateStatus(
                            selectedSubmission._id,
                            "accepted"
                          );
                          setSelectedSubmission(null);
                        }}
                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                      >
                        Accept
                      </button>
                    );
                  })()}
                </div>
              )}
              {selectedSubmission.status === "pending" && (
                <div className="flex justify-end mt-6">
                  <button
                    onClick={() => {
                      handleUpdateStatus(selectedSubmission._id, "reviewing");
                      setSelectedSubmission(null);
                    }}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    Start Review
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* File viewer modal */}
      {viewingFile && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg w-full max-w-5xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              <h3 className="text-lg font-medium text-white truncate">
                {viewingFile.name}
              </h3>
              <button
                onClick={() => {
                  URL.revokeObjectURL(viewingFile.url);
                  setViewingFile(null);
                }}
                className="text-gray-400 hover:text-white"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
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
                  className="w-full h-full min-h-[500px] rounded border border-gray-700"
                  title={viewingFile.name}
                />
              ) : viewingFile.contentType === "text/plain" ||
                viewingFile.contentType === "text/markdown" ? (
                <pre className="bg-gray-900 p-4 rounded text-gray-300 whitespace-pre-wrap">
                  <code>{viewingFile.url}</code>
                </pre>
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
  );
}
