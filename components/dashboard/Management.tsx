"use client";

import { useState, useEffect } from "react";

interface ManagerData {
  isManager: boolean;
}

export function Management({ walletAddress }: { walletAddress?: string }) {
  const [managerData, setManagerData] = useState<ManagerData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchManagerData = async () => {
      if (!walletAddress) return;

      try {
        const response = await fetch(`/api/users/${walletAddress}/reports`);
        if (!response.ok) throw new Error('Failed to fetch manager data');
        const data = await response.json();
        setManagerData(data.manager);
      } catch (error) {
        console.error('Error fetching manager data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchManagerData();
  }, [walletAddress]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!managerData?.isManager) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold text-gray-400 mb-2">Not a Manager</h3>
        <p className="text-gray-500">You are not assigned as a manager for any bounties.</p>
      </div>
    );
  }

  return (
    <div className="text-center py-12">
      <h3 className="text-xl font-semibold text-gray-400 mb-2">Manager Dashboard</h3>
      <p className="text-gray-500">Manager functionality coming soon.</p>
    </div>
  );
}