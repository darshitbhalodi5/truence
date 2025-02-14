"use client";

import { useState, useEffect, useMemo } from "react";

interface ReviewSubmission {
  _id: string;
  programName: string;
  title: string;
  description: string;
  severityLevel: string;
  status: string;
  createdAt: string;
  walletAddress: string;
  files?: { url: string; originalName: string }[];
}

interface ReviewerData {
  isReviewer: boolean;
  submissions: ReviewSubmission[];
}

export function Review({ walletAddress }: { walletAddress?: string }) {
  const [reviewData, setReviewData] = useState<ReviewerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<"all" | "pending" | "reviewing" | "accepted" | "rejected">("all");
  const [selectedSubmission, setSelectedSubmission] = useState<ReviewSubmission | null>(null);

  useEffect(() => {
    const fetchReviewData = async () => {
      if (!walletAddress) {
        setError("No wallet address provided");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/users/${walletAddress}/reports`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch review data');
        }

        setReviewData(data.reviewer);
      } catch (error) {
        console.error('Error fetching review data:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch review data');
      } finally {
        setLoading(false);
      }
    };

    fetchReviewData();
  }, []);

  // Filter submissions based on search query and status
  const filteredSubmissions = useMemo(() => {
    if (!reviewData?.submissions) return [];
    
    return reviewData.submissions.filter(submission => {
      const matchesSearch = submission.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = selectedStatus === "all" || submission.status === selectedStatus;
      return matchesSearch && matchesStatus;
    });
  }, [reviewData?.submissions, searchQuery, selectedStatus]);

  const handleSubmissionClick = (submission: ReviewSubmission) => {
    setSelectedSubmission(submission);
  };

  const handleCloseDetails = () => {
    setSelectedSubmission(null);
  };

  const handleUpdateStatus = async (newStatus: string) => {
    if (!selectedSubmission) return;

    try {
      const response = await fetch(`/api/submissions/${selectedSubmission._id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      // Refresh the data
      const updatedSubmission = { ...selectedSubmission, status: newStatus };
      setSelectedSubmission(updatedSubmission);
      
      // Update the submission in the list
      if (reviewData) {
        const updatedSubmissions = reviewData.submissions.map(sub =>
          sub._id === selectedSubmission._id ? updatedSubmission : sub
        );
        setReviewData({ ...reviewData, submissions: updatedSubmissions });
      }
    } catch (error) {
      console.error('Error updating status:', error);
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
        <h3 className="text-xl font-semibold text-red-400 mb-2">Error Loading Review Data</h3>
        <p className="text-gray-500">{error}</p>
      </div>
    );
  }

  if (!reviewData?.isReviewer) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold text-gray-400 mb-2">Not a Reviewer</h3>
        <p className="text-gray-500">You are not assigned as a reviewer for any bounties.</p>
        <p className="text-xs text-gray-600 mt-2">Wallet Address: {walletAddress}</p>
      </div>
    );
  }

  if (!reviewData.submissions || reviewData.submissions.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold text-gray-400 mb-2">No Reports to Review</h3>
        <p className="text-gray-500">There are no submissions to review at this time.</p>
        <p className="text-xs text-gray-600 mt-2">Wallet Address: {walletAddress}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {selectedSubmission ? (
        // Report Details View
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-white">{selectedSubmission.title}</h2>
                <button
                  onClick={handleCloseDetails}
                  className="text-gray-400 hover:text-white"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-6">
                {/* Program Info */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-300 mb-2">Program Information</h3>
                  <p className="text-gray-400">{selectedSubmission.programName}</p>
                </div>

                {/* Submission Details */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-300 mb-2">Description</h3>
                  <p className="text-gray-400 whitespace-pre-wrap">{selectedSubmission.description}</p>
                </div>

                {/* Status and Severity */}
                <div className="flex gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-300 mb-2">Status</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium
                      ${selectedSubmission.status === 'pending' ? 'bg-yellow-500/20 text-yellow-500' :
                        selectedSubmission.status === 'reviewing' ? 'bg-blue-500/20 text-blue-500' :
                        selectedSubmission.status === 'accepted' ? 'bg-green-500/20 text-green-500' :
                        'bg-red-500/20 text-red-500'}`}>
                      {selectedSubmission.status.charAt(0).toUpperCase() + selectedSubmission.status.slice(1)}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-300 mb-2">Severity Level</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium
                      ${selectedSubmission.severityLevel === 'critical' ? 'bg-red-500/20 text-red-500' :
                        selectedSubmission.severityLevel === 'high' ? 'bg-orange-500/20 text-orange-500' :
                        selectedSubmission.severityLevel === 'medium' ? 'bg-yellow-500/20 text-yellow-500' :
                        'bg-blue-500/20 text-blue-500'}`}>
                      {selectedSubmission.severityLevel.toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Attached Files */}
                {selectedSubmission.files && selectedSubmission.files.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-300 mb-2">Attached Files</h3>
                    <div className="space-y-2">
                      {selectedSubmission.files.map((file, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <a
                            href={file.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300 flex items-center gap-2"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                            {file.originalName}
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-end gap-4 mt-8">
                  {selectedSubmission.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleUpdateStatus('reviewing')}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                      >
                        Start Review
                      </button>
                    </>
                  )}
                  {selectedSubmission.status === 'reviewing' && (
                    <>
                      <button
                        onClick={() => handleUpdateStatus('rejected')}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => handleUpdateStatus('accepted')}
                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                      >
                        Accept
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Search and Filter Controls */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search by title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
              />
            </div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as any)}
              className="px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="reviewing">Reviewing</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          {/* Submissions List */}
          <div className="grid gap-4">
            {filteredSubmissions.map((submission) => (
              <div
                key={submission._id}
                className="bg-gray-700 rounded-lg p-6 hover:bg-gray-600 transition-colors cursor-pointer"
                onClick={() => handleSubmissionClick(submission)}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">{submission.title}</h3>
                    <p className="text-sm text-gray-400">{submission.programName}</p>
                    <p className="text-xs text-gray-500 mt-1">Submitted by: {submission.walletAddress}</p>
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

            {filteredSubmissions.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-400">
                  No reports found {searchQuery && `matching "${searchQuery}"`}
                  {selectedStatus !== "all" && ` with status "${selectedStatus}"`}
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}