"use client";

import { useState, useEffect } from "react";

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

  useEffect(() => {
    const fetchReviewData = async () => {
      if (!walletAddress) {
        setError("No wallet address provided");
        setLoading(false);
        return;
      }

      try {
        console.log('Fetching reviewer data for wallet:', walletAddress); // Debug log
        const response = await fetch(`/api/users/${walletAddress}/reports`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch review data');
        }

        console.log('Received reviewer data:', data); // Debug log
        setReviewData(data.reviewer);
      } catch (error) {
        console.error('Error fetching review data:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch review data');
      } finally {
        setLoading(false);
      }
    };

    fetchReviewData();
  }, [walletAddress]);

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
      {reviewData.submissions.map((submission) => (
        <div key={submission._id} className="bg-gray-700 rounded-lg p-6">
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
          <div className="mt-4 flex justify-end space-x-3">
            <button
              onClick={() => {/* Add review functionality */}}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Review
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}