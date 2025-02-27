"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { SubmissionData } from "@/types/submissionData";
import { LoadingSpinner } from "@/components/multi-purpose-loader/LoadingSpinner";
import { ChevronUp, ChevronDown, Filter, Search } from "lucide-react";

// Define sorting types
type SortField = "status" | "createdAt";
type SortDirection = "asc" | "desc";
type StatusFilter = "pending" | "reviewing" | "accepted" | "rejected" | "ALL";

export function Submission({ walletAddress }: { walletAddress?: string }) {
  const [submissions, setSubmissions] = useState<SubmissionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSubmission, setSelectedSubmission] =
    useState<SubmissionData | null>(null);
  const [downloadingFiles, setDownloadingFiles] = useState<
    Record<string, boolean>
  >({});
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const router = useRouter();

  // Status configuration similar to the bounty table
  const statusConfig = {
    pending: { color: "bg-yellow-500", tooltip: "Pending" },
    reviewing: { color: "bg-blue-500", tooltip: "Reviewing" },
    accepted: { color: "bg-green-500", tooltip: "Accepted" },
    rejected: { color: "bg-red-500", tooltip: "Rejected" },
    ALL: { color: "", tooltip: "All Statuses" },
  };

  // Status dot component for the filter dropdown
  const StatusDot = ({ status }: { status: string }) => {
    if (status === "ALL") return null;
    return (
      <div className="relative group">
        <div
          className={`w-3 h-3 rounded-full ${
            statusConfig[status as keyof typeof statusConfig].color
          }`}
        />
        <div className="hidden group-hover:block absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-xs text-white rounded whitespace-nowrap">
          {statusConfig[status as keyof typeof statusConfig].tooltip}
        </div>
      </div>
    );
  };

  useEffect(() => {
    // Function to fetch the submisison data of connected address
    const fetchSubmissions = async () => {
      if (!walletAddress) {
        setError("No wallet address provided to fetch submissions.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `/api/submitter-data?address=${walletAddress}`
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch submissions");
        }

        setSubmissions(data.submissions || []);
      } catch (error) {
        console.error("Error fetching submissions:", error);
        setError(
          error instanceof Error ? error.message : "Failed to fetch submissions"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [walletAddress]);

  // Sort submissions based on current sort field and direction
  const sortedAndFilteredSubmissions = useMemo(() => {
    return [...submissions]
      .filter((submission) => {
        // Apply status filter
        if (statusFilter !== "ALL" && submission.status !== statusFilter) {
          return false;
        }

        // Apply search filter
        if (
          searchQuery &&
          !submission.title.toLowerCase().includes(searchQuery.toLowerCase())
        ) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        const direction = sortDirection === "asc" ? 1 : -1;

        switch (sortField) {
          case "status":
            return a.status.localeCompare(b.status) * direction;
          case "createdAt":
            return (
              (new Date(a.createdAt).getTime() -
                new Date(b.createdAt).getTime()) *
              direction
            );
          default:
            return 0;
        }
      });
  }, [submissions, sortField, sortDirection, statusFilter, searchQuery]);

  // Handle sorting
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  // Sort icon component
  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field)
      return <ChevronUp className="h-4 w-4 text-gray-400" />;
    return sortDirection === "asc" ? (
      <ChevronUp className="h-4 w-4 text-[#99168E]" />
    ) : (
      <ChevronDown className="h-4 w-4 text-[#99168E]" />
    );
  };

  // Function to handle file download
  const handleDownloadFile = async (fileUrl: string) => {
    try {
      // Set downloading state for this file
      setDownloadingFiles((prev) => ({ ...prev, [fileUrl]: true }));

      // Get file ID
      const fileId = fileUrl.split("/").pop();
      if (!fileId) throw new Error("Invalid file URL");

      // Fetch metadata inline when needed
      const fileIndex =
        selectedSubmission?.files?.findIndex((f) => f === fileUrl) || -1;
      const fileName =
        selectedSubmission?.fileNames?.[fileIndex] ||
        fileUrl.split("/").pop() ||
        "downloaded-file";

      const response = await fetch(fileUrl);
      if (!response.ok) {
        throw new Error("Failed to download file");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("File download started");
    } catch (error) {
      console.error("Error downloading file:", error);
      toast.error("Failed to download file");
    } finally {
      // Reset downloading state for this file
      setDownloadingFiles((prev) => ({ ...prev, [fileUrl]: false }));
    }
  };

  // Show infomarmation when diffrent severity level of reviewer and submitter
  const renderSeverityInfo = (submission: SubmissionData) => {
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
            <p className="text-gray-300">Severity changed by reviewer</p>
            <p className="mt-1">
              <span className="text-gray-400">Your assessment: </span>
              <span className="text-yellow-500">
                {submission.severityLevel.toUpperCase()}
              </span>
            </p>
            <p className="mt-1">
              <span className="text-gray-400">Reviewer's assessment: </span>
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <LoadingSpinner text="Fetching latest data for your submission" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold text-[#AC350D] mb-2">
          Error Loading Submissions
        </h3>
        <p className="text-[#FAFCA3] text-lg">{error}</p>
      </div>
    );
  }

  if (!submissions || submissions.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold text-[#FAFCA3] mb-2">
          No submissions found.
        </h3>
        <p className="text-white/80">
          You haven't submitted any submissions yet.
        </p>
        <button
          onClick={() =>
            router.push("/submission?bountyName=Arbitrum%20Watchdog")
          }
          className="mt-4 px-4 py-2 bg-gradient-to-r from-[#990F62] via-[#99168E] to-[#991DB5] hover:from-[#b02579] hover:via-[#a12796] hover:to-[#9e2eb8] text-white rounded-lg transition-colors"
        >
          Submit Evidence
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-white">Your Submissions</h2>
        <button
          onClick={() =>
            router.push("/submission?bountyName=Arbitrum%20Watchdog")
          }
          className="px-4 py-2 text-white rounded-lg bg-gradient-to-r from-[#990F62] via-[#99168E] to-[#991DB5] hover:from-[#b02579] hover:via-[#a12796] hover:to-[#9e2eb8] transition-colors"
        >
          Submit Evidence
        </button>
      </div>

      <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
        <div className="relative flex-grow max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-white" />
          </div>
          <input
            type="text"
            placeholder="Search by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 w-full bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#99168E] focus:border-transparent"
          />
        </div>

        <div className="relative">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center gap-2 bg-gray-800 text-white rounded-lg px-4 py-2.5 
                     hover:bg-gray-700 transition-colors duration-200 border border-gray-700"
          >
            <Filter className="w-4 h-4" />
            <span className="text-sm font-medium">
              {statusFilter === "ALL"
                ? "All Statuses"
                : statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
            </span>
            {statusFilter !== "ALL" && (
              <span className="md:hidden">
                <StatusDot status={statusFilter} />
              </span>
            )}
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
                  setStatusFilter("ALL");
                  setIsFilterOpen(false);
                }}
                className={`w-full px-4 py-2 text-sm text-left flex items-center gap-2 
                         hover:bg-gray-700 transition-colors duration-200
                         ${statusFilter === "ALL" ? "bg-gray-700" : ""}`}
              >
                All Statuses
              </button>
              {Object.entries(statusConfig)
                .filter(([key]) => key !== "ALL")
                .map(([status, config]) => (
                  <button
                    key={status}
                    onClick={() => {
                      setStatusFilter(status as StatusFilter);
                      setIsFilterOpen(false);
                    }}
                    className={`w-full px-4 py-2 text-sm text-left flex items-center gap-2 
                           hover:bg-gray-700 transition-colors duration-200
                           ${statusFilter === status ? "bg-gray-700" : ""}`}
                  >
                    <span className={`w-2 h-2 rounded-full ${config.color}`} />
                    {config.tooltip}
                  </button>
                ))}
            </div>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="scroll-container overflow-y-auto max-h-[600px] scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-700 scrollbar-thumb-rounded-lg">
          <table className="w-full text-sm text-left text-gray-400">
            <thead className="text-sm text-gray-400 sticky top-0 bg-gray-900 z-10">
              <tr>
                <th className="px-4 py-3">Program</th>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Severity</th>
                <th className="px-4 py-3">Files</th>
                <th
                  className="px-4 py-3 cursor-pointer"
                  onClick={() => handleSort("createdAt")}
                >
                  <div className="flex items-center space-x-1">
                    <span>Submission Date</span>
                    <SortIcon field="createdAt" />
                  </div>
                </th>
                <th className="px-4 py-3">View Details</th>
              </tr>
            </thead>
            <tbody>
              {sortedAndFilteredSubmissions.map((submission) => (
                <tr
                  key={submission._id}
                  className="hover:bg-gray-800/50 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 relative flex-shrink-0">
                        <img
                          src={submission.bountyLogo}
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
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded-full uppercase text-xs font-medium
                    ${
                      submission.status === "pending"
                        ? "bg-yellow-500/20 text-yellow-500"
                        : submission.status === "reviewing"
                        ? "bg-blue-500/20 text-blue-500"
                        : submission.status === "accepted"
                        ? "bg-green-500/20 text-green-500"
                        : "bg-red-500/20 text-red-500"
                    }`}
                    >
                      {submission.status.charAt(0).toUpperCase() +
                        submission.status.slice(1)}
                    </span>
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
                  <td className="px-4 py-3">
                    {submission.files?.length || 0} file(s)
                  </td>
                  <td className="px-4 py-3 text-gray-400">
                    {new Date(submission.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => setSelectedSubmission(submission)}
                      className="text-blue-500 hover:text-blue-400"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
                <p className="text-white">{selectedSubmission.description}</p>
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

              {selectedSubmission.files &&
                selectedSubmission.files.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-2">
                      Attachments
                    </h4>
                    <div className="space-y-2">
                      {selectedSubmission.files.map((fileUrl, index) => {
                        const isDownloading = downloadingFiles[fileUrl];
                        const fileName =
                          selectedSubmission.fileNames?.[index] ||
                          fileUrl.split("/").pop();
                        return (
                          <div
                            key={fileUrl}
                            className="flex items-center justify-between bg-gray-700 p-2 rounded"
                          >
                            <span className="text-sm text-white truncate">
                              {fileName}
                            </span>
                            <button
                              onClick={() => handleDownloadFile(fileUrl)}
                              disabled={isDownloading}
                              className="ml-2 text-blue-500 hover:text-blue-400 disabled:text-gray-500"
                            >
                              {isDownloading ? "Downloading..." : "Download"}
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
    </div>
  );
}
