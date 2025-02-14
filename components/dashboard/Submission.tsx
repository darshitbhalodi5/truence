"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

interface SubmissionData {
  _id: string;
  programName: string;
  title: string;
  description: string;
  severityLevel: string;
  status: string;
  createdAt: string;
  files?: string[];
}

interface SubmitterData {
  isSubmitter: boolean;
  submissions: SubmissionData[];
}

interface FileMetadata {
  filename: string;
  originalName: string;
  contentType: string;
  size: number;
  uploadDate: string;
}

export function Submission({ walletAddress }: { walletAddress?: string }) {
  const [submitterData, setSubmitterData] = useState<SubmitterData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSubmission, setSelectedSubmission] = useState<SubmissionData | null>(null);
  const [fileMetadata, setFileMetadata] = useState<Record<string, FileMetadata>>({});
  const [downloadingFiles, setDownloadingFiles] = useState<Record<string, boolean>>({});
  const router = useRouter();

  useEffect(() => {
    const fetchSubmissions = async () => {
      if (!walletAddress) {
        setError("No wallet address provided");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/users/${walletAddress}/reports`);
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch submissions');
        }

        console.log('Submission data:', data.submitter);
        setSubmitterData(data.submitter);
      } catch (error) {
        console.error('Error fetching submissions:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch submissions');
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [walletAddress]);

  const fetchFileMetadata = async (fileUrl: string) => {
    try {
      const fileId = fileUrl.split('/').pop();
      if (!fileId) return null;

      const response = await fetch(`/api/files/${fileId}/metadata`);
      if (!response.ok) {
        throw new Error('Failed to fetch file metadata');
      }

      const metadata = await response.json();
      setFileMetadata(prev => ({
        ...prev,
        [fileUrl]: metadata
      }));
    } catch (error) {
      console.error('Error fetching file metadata:', error);
    }
  };

  useEffect(() => {
    if (selectedSubmission?.files) {
      selectedSubmission.files.forEach(fileUrl => {
        if (!fileMetadata[fileUrl]) {
          fetchFileMetadata(fileUrl);
        }
      });
    }
  }, [selectedSubmission]);

  const handleDownloadFile = async (fileUrl: string) => {
    try {
      console.log('File URL to download:', fileUrl);
      
      // Set downloading state for this file
      setDownloadingFiles(prev => ({ ...prev, [fileUrl]: true }));
      
      const response = await fetch(fileUrl);
      if (!response.ok) {
        throw new Error('Failed to download file');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Use the original filename from metadata if available
      const metadata = fileMetadata[fileUrl];
      const fileName = metadata?.originalName || fileUrl.split('/').pop() || 'downloaded-file';
      link.download = fileName;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success('File download started');
    } catch (error) {
      console.error('Error downloading file:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to download file');
    } finally {
      // Reset downloading state for this file
      setDownloadingFiles(prev => ({ ...prev, [fileUrl]: false }));
    }
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
        <h3 className="text-xl font-semibold text-red-400 mb-2">Error Loading Reports</h3>
        <p className="text-gray-500">{error}</p>
      </div>
    );
  }

  if (!submitterData?.submissions || submitterData.submissions.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold text-gray-400 mb-2">No Reports Submitted</h3>
        <p className="text-gray-500">You haven't submitted any bug reports yet.</p>
        <button
          onClick={() => router.push('/submission')}
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
          onClick={() => router.push('/submission')}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Submit a Bug
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={`space-y-4 ${selectedSubmission ? 'lg:col-span-1' : 'lg:col-span-2'}`}>
          {submitterData.submissions.map((submission) => (
            <div
              key={submission._id}
              onClick={() => setSelectedSubmission(submission)}
              className={`bg-gray-700 rounded-lg p-6 cursor-pointer transition-all duration-200 hover:bg-gray-600 
                ${selectedSubmission?._id === submission._id ? 'ring-2 ring-blue-500' : ''}`}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">{submission.title}</h3>
                  <p className="text-sm text-gray-400">{submission.programName}</p>
                </div>
                <div className="flex flex-col items-end">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium
                    ${submission.status === 'pending' ? 'bg-yellow-500/20 text-yellow-500' :
                      submission.status === 'reviewing' ? 'bg-blue-500/20 text-blue-500' :
                      submission.status === 'accepted' ? 'bg-green-500/20 text-green-500' :
                      'bg-red-500/20 text-red-500'}`}>
                    {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                  </span>
                  <span className="text-xs text-gray-400 mt-1">
                    {new Date(submission.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span className={`px-2 py-1 rounded text-xs font-medium
                  ${submission.severityLevel === 'critical' ? 'bg-red-500/20 text-red-500' :
                    submission.severityLevel === 'high' ? 'bg-orange-500/20 text-orange-500' :
                    submission.severityLevel === 'medium' ? 'bg-yellow-500/20 text-yellow-500' :
                    'bg-blue-500/20 text-blue-500'}`}>
                  {submission.severityLevel.toUpperCase()}
                </span>
                {submission.files && submission.files.length > 0 && (
                  <span className="text-xs text-gray-400">
                    {submission.files.length} file{submission.files.length !== 1 ? 's' : ''} attached
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {selectedSubmission && (
          <div className="lg:col-span-1">
            <div className="bg-gray-700 rounded-lg p-6 sticky top-4">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-xl font-semibold text-white">{selectedSubmission.title}</h3>
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

              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-2">Program</h4>
                  <p className="text-white">{selectedSubmission.programName}</p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-2">Description</h4>
                  <p className="text-white whitespace-pre-wrap">{selectedSubmission.description}</p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-2">Status</h4>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium
                    ${selectedSubmission.status === 'pending' ? 'bg-yellow-500/20 text-yellow-500' :
                      selectedSubmission.status === 'reviewing' ? 'bg-blue-500/20 text-blue-500' :
                      selectedSubmission.status === 'accepted' ? 'bg-green-500/20 text-green-500' :
                      'bg-red-500/20 text-red-500'}`}>
                    {selectedSubmission.status.charAt(0).toUpperCase() + selectedSubmission.status.slice(1)}
                  </span>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-2">Severity Level</h4>
                  <span className={`px-2 py-1 rounded text-xs font-medium
                    ${selectedSubmission.severityLevel === 'critical' ? 'bg-red-500/20 text-red-500' :
                      selectedSubmission.severityLevel === 'high' ? 'bg-orange-500/20 text-orange-500' :
                      selectedSubmission.severityLevel === 'medium' ? 'bg-yellow-500/20 text-yellow-500' :
                      'bg-blue-500/20 text-blue-500'}`}>
                    {selectedSubmission.severityLevel.toUpperCase()}
                  </span>
                </div>

                {selectedSubmission.files && selectedSubmission.files.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-2">Attached Files</h4>
                    <div className="space-y-2">
                      {selectedSubmission.files.map((fileUrl, index) => {
                        const metadata = fileMetadata[fileUrl];
                        const isDownloading = downloadingFiles[fileUrl];
                        return (
                          <div
                            key={index}
                            className="flex items-center justify-between bg-gray-600 rounded-lg p-3"
                          >
                            <div className="flex flex-col flex-grow mr-4 min-w-0">
                              <span className="text-sm text-white truncate">
                                {metadata ? metadata.originalName : `File ${index + 1}`}
                              </span>
                              {metadata && (
                                <span className="text-xs text-gray-400">
                                  {(metadata.size / 1024).toFixed(1)} KB
                                </span>
                              )}
                            </div>
                            <button
                              onClick={() => handleDownloadFile(fileUrl)}
                              disabled={isDownloading}
                              className={`text-blue-400 hover:text-blue-300 transition-colors flex-shrink-0 w-5 h-5 ${
                                isDownloading ? 'cursor-not-allowed opacity-50' : ''
                              }`}
                            >
                              {isDownloading ? (
                                <svg 
                                  className="animate-spin" 
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                  />
                                </svg>
                              ) : (
                                <svg
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                                  />
                                </svg>
                              )}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-2">Submitted On</h4>
                  <p className="text-white">
                    {new Date(selectedSubmission.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}