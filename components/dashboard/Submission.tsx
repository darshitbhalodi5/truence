"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { SubmissionData } from "@/types/submissionData";
interface FileMetadata {
  filename: string;
  originalName: string;
  contentType: string;
  size: number;
  uploadDate: string;
}

export function Submission({ walletAddress }: { walletAddress?: string }) {
  const [submissions, setSubmissions] = useState<SubmissionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSubmission, setSelectedSubmission] =
    useState<SubmissionData | null>(null);
  const [fileMetadata, setFileMetadata] = useState<
    Record<string, FileMetadata>
  >({});
  const [downloadingFiles, setDownloadingFiles] = useState<
    Record<string, boolean>
  >({});
  const router = useRouter();

  useEffect(() => {
    // Function to fetch the submisison data of connected address
    const fetchSubmissions = async () => {
      if (!walletAddress) {
        setError("No wallet address provided");
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

  const fetchFileMetadata = async (fileUrl: string) => {
    try {
      const fileId = fileUrl.split("/").pop();
      if (!fileId) return null;

      const response = await fetch(`/api/files/${fileId}/metadata`);
      if (!response.ok) {
        throw new Error("Failed to fetch file metadata");
      }

      const metadata = await response.json();
      setFileMetadata((prev) => ({
        ...prev,
        [fileUrl]: metadata,
      }));
    } catch (error) {
      console.error("Error fetching file metadata:", error);
    }
  };

  useEffect(() => {
    if (selectedSubmission?.files) {
      selectedSubmission.files.forEach((fileUrl) => {
        if (!fileMetadata[fileUrl]) {
          fetchFileMetadata(fileUrl);
        }
      });
    }
  }, [selectedSubmission]);

  // Function to handle file download
  const handleDownloadFile = async (fileUrl: string) => {
    try {
      // Set downloading state for this file
      setDownloadingFiles((prev) => ({ ...prev, [fileUrl]: true }));

      const response = await fetch(fileUrl);
      if (!response.ok) {
        throw new Error("Failed to download file");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;

      // Use the original filename from metadata if available
      const metadata = fileMetadata[fileUrl];
      const fileIndex = selectedSubmission?.files?.indexOf(fileUrl) || -1;
      const fileName =
        selectedSubmission?.fileNames?.[fileIndex] ||
        metadata?.originalName ||
        fileUrl.split("/").pop() ||
        "downloaded-file";

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
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold text-red-400 mb-2">
          Error Loading Reports
        </h3>
        <p className="text-gray-500">{error}</p>
      </div>
    );
  }

  if (!submissions || submissions.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold text-gray-400 mb-2">
          No Reports Submitted
        </h3>
        <p className="text-gray-500">
          You haven't submitted any bug reports yet.
        </p>
        <button
          onClick={() => router.push("/submission")}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Submit a Bug
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-white">Your Submissions</h2>
        <button
          onClick={() => router.push("/submission")}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Submit a Bug
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-300">
          <thead className="text-xs uppercase bg-gray-700 text-gray-300">
            <tr>
              <th className="px-4 py-3">Bounty</th>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Severity</th>
              <th className="px-4 py-3">Files</th>
              <th className="px-4 py-3">Submission Date</th>
              <th className="px-4 py-3">View Details</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((submission) => (
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
                            target.src = "/default-bounty-logo.png"; // Fallback image
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
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium
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
                        const metadata = fileMetadata[fileUrl];
                        const isDownloading = downloadingFiles[fileUrl];
                        const fileName =
                          selectedSubmission.fileNames?.[index] ||
                          metadata?.originalName ||
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
