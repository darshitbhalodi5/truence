"use client";

import { useState, useEffect, useMemo } from "react";
import { toast } from "react-hot-toast";

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
  bountyLogo?: string;
}

interface ReviewerData {
  isReviewer: boolean;
  submissions: ReviewSubmission[];
  bounties: Array<{
    networkName: string;
    logoUrl: string;
  }>;
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

        // Create a map of program names to logo URLs
        const logoMap = data.reviewer.bounties.reduce((map: Record<string, string>, bounty: any) => {
          map[bounty.networkName] = bounty.logoUrl;
          return map;
        }, {});

        // Add logo URLs to submissions
        const submissionsWithLogos = data.reviewer.submissions.map((submission: ReviewSubmission) => ({
          ...submission,
          bountyLogo: logoMap[submission.programName]
        }));

        setReviewData({
          ...data.reviewer,
          submissions: submissionsWithLogos
        });
      } catch (error) {
        console.error('Error fetching review data:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch review data');
      } finally {
        setLoading(false);
      }
    };

    fetchReviewData();
  }, [walletAddress]);

  // Filter submissions based on search query and status
  const filteredSubmissions = useMemo(() => {
    if (!reviewData?.submissions) return [];
    
    return reviewData.submissions.filter(submission => {
      const matchesSearch = submission.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          submission.programName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = selectedStatus === "all" || submission.status === selectedStatus;
      return matchesSearch && matchesStatus;
    });
  }, [reviewData?.submissions, searchQuery, selectedStatus]);

  const handleUpdateStatus = async (submissionId: string, newStatus: string) => {
    try {
      console.log('Updating status for submission:', submissionId, 'to:', newStatus);
      
      const response = await fetch(`/api/submissions/${submissionId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update status');
      }

      // Update the submission in the list
      if (reviewData) {
        const updatedSubmissions = reviewData.submissions.map(sub =>
          sub._id === submissionId ? { ...sub, status: newStatus } : sub
        );
        setReviewData({ ...reviewData, submissions: updatedSubmissions });
      }

      toast.success(`Status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update status');
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
      </div>
    );
  }

  if (!reviewData.submissions || reviewData.submissions.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold text-gray-400 mb-2">No Reports to Review</h3>
        <p className="text-gray-500">There are no submissions to review at this time.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-white">Review Submissions</h2>
        <div className="flex items-center space-x-4">
          <input
            type="text"
            placeholder="Search submissions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as any)}
            className="px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="reviewing">Reviewing</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
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
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredSubmissions.map((submission) => (
              <tr key={submission._id} className="bg-gray-800 border-b border-gray-700 hover:bg-gray-700">
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
                            target.src = '/default-bounty-logo.png';
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
                  <span className={`px-2 py-1 rounded-full text-xs font-medium
                    ${submission.status === 'pending' ? 'bg-yellow-500/20 text-yellow-500' :
                      submission.status === 'reviewing' ? 'bg-blue-500/20 text-blue-500' :
                      submission.status === 'accepted' ? 'bg-green-500/20 text-green-500' :
                      'bg-red-500/20 text-red-500'}`}>
                    {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded text-xs font-medium
                    ${submission.severityLevel === 'critical' ? 'bg-red-500/20 text-red-500' :
                      submission.severityLevel === 'high' ? 'bg-orange-500/20 text-orange-500' :
                      submission.severityLevel === 'medium' ? 'bg-yellow-500/20 text-yellow-500' :
                      'bg-blue-500/20 text-blue-500'}`}>
                    {submission.severityLevel.toUpperCase()}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {submission.files?.length || 0} file(s)
                </td>
                <td className="px-4 py-3 text-gray-400">
                  {new Date(submission.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setSelectedSubmission(submission)}
                      className="text-blue-500 hover:text-blue-400"
                    >
                      View
                    </button>
                    {submission.status === 'pending' && (
                      <button
                        onClick={() => handleUpdateStatus(submission._id, 'reviewing')}
                        className="text-yellow-500 hover:text-yellow-400 ml-2"
                      >
                        Review
                      </button>
                    )}
                    {submission.status === 'reviewing' && (
                      <>
                        <button
                          onClick={() => handleUpdateStatus(submission._id, 'accepted')}
                          className="text-green-500 hover:text-green-400 ml-2"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(submission._id, 'rejected')}
                          className="text-red-500 hover:text-red-400 ml-2"
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </div>
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

            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-1">Description</h4>
                <p className="text-white whitespace-pre-wrap">{selectedSubmission.description}</p>
              </div>

              <div className="flex space-x-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-1">Status</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium
                    ${selectedSubmission.status === 'pending' ? 'bg-yellow-500/20 text-yellow-500' :
                      selectedSubmission.status === 'reviewing' ? 'bg-blue-500/20 text-blue-500' :
                      selectedSubmission.status === 'accepted' ? 'bg-green-500/20 text-green-500' :
                      'bg-red-500/20 text-red-500'}`}>
                    {selectedSubmission.status.charAt(0).toUpperCase() + selectedSubmission.status.slice(1)}
                  </span>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-1">Severity</h4>
                  <span className={`px-2 py-1 rounded text-xs font-medium
                    ${selectedSubmission.severityLevel === 'critical' ? 'bg-red-500/20 text-red-500' :
                      selectedSubmission.severityLevel === 'high' ? 'bg-orange-500/20 text-orange-500' :
                      selectedSubmission.severityLevel === 'medium' ? 'bg-yellow-500/20 text-yellow-500' :
                      'bg-blue-500/20 text-blue-500'}`}>
                    {selectedSubmission.severityLevel.toUpperCase()}
                  </span>
                </div>
              </div>

              {selectedSubmission.files && selectedSubmission.files.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-2">Attachments</h4>
                  <div className="space-y-2">
                    {selectedSubmission.files.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-700 p-2 rounded">
                        <span className="text-sm text-white truncate">
                          {file.originalName}
                        </span>
                        <a
                          href={file.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-2 text-blue-500 hover:text-blue-400"
                        >
                          Download
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedSubmission.status === 'reviewing' && (
                <div className="flex justify-end space-x-4 mt-6">
                  <button
                    onClick={() => {
                      handleUpdateStatus(selectedSubmission._id, 'rejected');
                      setSelectedSubmission(null);
                    }}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => {
                      handleUpdateStatus(selectedSubmission._id, 'accepted');
                      setSelectedSubmission(null);
                    }}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                  >
                    Accept
                  </button>
                </div>
              )}
              {selectedSubmission.status === 'pending' && (
                <div className="flex justify-end mt-6">
                  <button
                    onClick={() => {
                      handleUpdateStatus(selectedSubmission._id, 'reviewing');
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
    </div>
  );
}