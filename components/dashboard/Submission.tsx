"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { SubmissionData } from "@/types/submissionData";
import { LoadingSpinner } from "@/components/multi-purpose-loader/LoadingSpinner";
import {
  ChevronDown,
  ChevronRight,
  Filter,
  Search,
  Download,
  Loader2,
  X,
} from "lucide-react";
import { getCurrency } from "@/utils/networkCurrency";
import { SortField, SortDirection, StatusFilter } from "@/types/filterTypes";
import SortIcon from "@/components/sort-icon/SortIcon";
import SeverityInfo from "@/components/severity-change/SeverityInfo";
import Chat from "@/components/dashboard/Chat";
import PaymentProgress from "@/components/payment-progressbar/PaymentProgress";
import { showCustomToast } from "@/components/custom-toast/CustomToast";

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

        const chats: typeof availableChats = [];

        data.submissions.forEach((submission: any) => {
          chats.push({
            reportId: submission._id,
            bountyName: submission.programName,
            reportTitle: submission.title,
          });
        });
        setAvailableChats(chats);
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

  const handleVerifyKYC = async () => {
    if (selectedSubmission?.progressStatus?.kycVerified === true) {
      showCustomToast("information", "KYC verification already done");
      return;
    }

    try {
      const VerificationResponse = await fetch(
        `/api/submissions/${selectedSubmission?._id}/verify-kyc`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            submitterAddress: walletAddress,
          }),
        }
      );

      const VerificationData = await VerificationResponse.json();

      if (!VerificationResponse.ok) {
        throw new Error(VerificationData.error || "Failed to verify KYC");
      }

      setSelectedSubmission((prevSubmission) => {
        if (!prevSubmission) return prevSubmission;
        return {
          ...prevSubmission,
          progressStatus: {
            ...prevSubmission.progressStatus,
            kycVerified: true,
          },
        };
      });

      showCustomToast("success", "KYC verification done");
    } catch (error) {
      console.error("Error in verifying KYC:", error);
    }
  };

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

      showCustomToast("success", "File download started");
    } catch (error) {
      console.error("Error downloading file:", error);
      showCustomToast("error", "Failed to download file");
    } finally {
      // Reset downloading state for this file
      setDownloadingFiles((prev) => ({ ...prev, [fileUrl]: false }));
    }
  };

  // Handle row click to open submission details
  const handleRowClick = (submission: SubmissionData) => {
    setSelectedSubmission(submission);
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-xl sm:text-2xl font-semibold text-white">
          Your Submissions
        </h2>
        <button
          onClick={() =>
            router.push("/submission?bountyName=Arbitrum%20Watchdog")
          }
          className="px-4 py-2 text-white rounded-lg bg-gradient-to-r from-[#990F62] via-[#99168E] to-[#991DB5] hover:from-[#b02579] hover:via-[#a12796] hover:to-[#9e2eb8] transition-colors whitespace-nowrap"
        >
          Submit Evidence
        </button>
      </div>

      {submissions.length > 8 && (
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
          <div className="relative flex-grow max-w-full sm:max-w-md">
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
                  : statusFilter.charAt(0).toUpperCase() +
                    statusFilter.slice(1)}
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
      )}

      <div className="overflow-x-auto -mx-4 sm:mx-0">
        <div className="inline-block min-w-full align-middle">
          <div className="scroll-container overflow-y-auto max-h-[600px] scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-700 scrollbar-thumb-rounded-lg">
            <table className="w-full text-sm text-left text-gray-400">
              <thead className="text-sm text-gray-400 sticky top-0 bg-gray-900 z-10">
                <tr>
                  <th className="px-4 py-3 hidden md:table-cell">Program</th>
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 hidden sm:table-cell">Severity</th>
                  <th className="px-4 py-3 hidden lg:table-cell">
                    Misuse Amt.
                  </th>
                  <th className="px-4 py-3 hidden md:table-cell">Files</th>
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
                </tr>
              </thead>
              <tbody>
                {sortedAndFilteredSubmissions.map((submission) => (
                  <tr
                    key={submission._id}
                    className="hover:bg-gray-800/50 transition-colors cursor-pointer"
                    onClick={() => handleRowClick(submission)}
                  >
                    <td className="px-4 py-3 hidden md:table-cell">
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
                        ? "bg-yellow-500/10 text-yellow-500"
                        : submission.status === "reviewing"
                        ? "bg-blue-500/10 text-blue-500"
                        : submission.status === "accepted"
                        ? "bg-green-500/10 text-green-500"
                        : "bg-red-500/10 text-red-500"
                    }`}
                      >
                        {submission.status.charAt(0).toUpperCase() +
                          submission.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <div className="flex items-center space-x-2">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full
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
                    <td className="px-4 py-3 hidden md:table-cell">
                      {submission.files?.length || 0} Files
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell text-gray-400">
                      {new Date(submission.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {selectedSubmission && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-2 sm:p-4 z-50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#00041B] rounded-xl p-3 sm:p-6 max-w-2xl w-full max-h-[90vh] border border-[#99168E] shadow-xl my-4">
            <div className="scroll-container overflow-y-auto max-h-[600px] scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-700 scrollbar-thumb-rounded-lg">
              <div className="flex flex-wrap justify-between gap-4 bg-[#00041B] p-4 rounded-lg sticky top-0 z-10">
                <div>
                  <h3 className="text-xl sm:text-2xl font-semibold text-[#FAFCA3] mb-1 mt-1 animate-pulse">
                    {selectedSubmission.title}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedSubmission(null)}
                  className=" hover:bg-[#99168E] p-1 rounded-xl transition-colors"
                >
                  <X className="w-6 h-6 text-[#FAFCA3]" />
                </button>
              </div>

              {selectedSubmission.managerVote &&
                selectedSubmission.managerVote.vote === "accepted" && (
                  <div className="flex flex-wrap gap-2 sm:gap-4 bg-[#00041B] p-2 sm:p-4 rounded-lg">
                    <PaymentProgress
                      submission={selectedSubmission}
                      isSubmitter={true}
                      userAddress={walletAddress || ""}
                      onVerifyKYC={() => handleVerifyKYC()}
                    />
                  </div>
                )}

              <div className="flex flex-wrap gap-2 sm:gap-4 bg-[#00041B] p-2 sm:p-4 rounded-lg">
                <h4 className="text-sm font-medium text-white/80 mb-1">
                  Program :
                </h4>
                <div className="flex items-center space-x-2">
                  <img
                    src={selectedSubmission.bountyLogo}
                    alt={`${selectedSubmission.programName} Logo`}
                    className="w-5 h-5 rounded-full"
                  />
                  <span className="text-white text-sm">
                    {selectedSubmission.programName}
                  </span>
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

              <div className="flex flex-wrap gap-2 sm:gap-4 bg-[#00041B] p-2 sm:p-4 rounded-lg">
                <h4 className="text-sm font-medium text-white/80 mb-3">
                  Description :
                </h4>
                <p className="text-white/90 text-xs sm:text-sm whitespace-pre-line text-justify">
                  {selectedSubmission.description}
                </p>
              </div>

              {selectedSubmission.files &&
                selectedSubmission.files.length > 0 && (
                  <div className="gap-2 sm:gap-4 bg-[#00041B] p-2 sm:p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-white/80 mb-3">
                      Attachments :
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
                            className="flex items-center justify-between bg-gray-700/50 p-3 rounded-lg hover:bg-gray-700/80 transition-colors"
                          >
                            <span className="text-sm text-white truncate">
                              {fileName}
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDownloadFile(fileUrl);
                              }}
                              disabled={isDownloading}
                              className="ml-2 flex items-center gap-2 px-3 py-2 text-sm bg-[#FAFCA3] text-white rounded-md disabled:bg-gray-600 disabled:text-gray-400 transition-colors"
                            >
                              {isDownloading ? (
                                <Loader2 className="animate-spin w-4 h-4 text-[#99168E]" />
                              ) : (
                                <Download className="w-4 h-4 text-[#99168E]" />
                              )}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

              <div className="flex flex-wrap gap-4 bg-[#00041B] p-4 rounded-lg">
                <h4 className="text-sm font-medium text-white/80 mb-1">
                  Submission Date :
                </h4>
                <p className="text-sm text-white">
                  {new Date(selectedSubmission.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-4 md:mt-6">
        <Chat
          reportId={selectedChat?.reportId}
          onSelectChat={(reportId) => setSelectedChat({ reportId })}
          availableChats={availableChats}
        />
      </div>
    </div>
  );
}
