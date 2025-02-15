"use client";

import { useState, useEffect } from "react";

interface BountyStats {
  networkName: string;
  logoUrl: string;
  submissionCount: number;
}

export function BountyStats() {
  const [stats, setStats] = useState<BountyStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/bounty-stats');
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch bounty stats');
        }

        setStats(data.stats);
      } catch (error) {
        console.error('Error fetching bounty stats:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch bounty stats');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

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
        <h3 className="text-xl font-semibold text-red-400 mb-2">Error Loading Stats</h3>
        <p className="text-gray-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold text-white mb-6">Bounty Submission Statistics</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-300">
          <thead className="text-xs uppercase bg-gray-700 text-gray-300">
            <tr>
              <th className="px-4 py-3">Bounty</th>
              <th className="px-4 py-3">Total Submissions</th>
            </tr>
          </thead>
          <tbody>
            {stats.map((bounty) => (
              <tr key={bounty.networkName} className="bg-gray-800 border-b border-gray-700">
                <td className="px-4 py-3">
                  <div className="flex items-center space-x-3">
                    {bounty.logoUrl ? (
                      <div className="w-8 h-8 relative flex-shrink-0">
                        <img 
                          src={bounty.logoUrl} 
                          alt={`${bounty.networkName} Logo`}
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
                          {bounty.networkName.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <span className="text-sm text-gray-300">
                      {bounty.networkName}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  {bounty.submissionCount} submission(s)
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 