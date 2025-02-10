'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronRightIcon } from '@heroicons/react/24/outline';

interface Bounty {
  _id: string;
  networkName: string;
  maxRewards: number;
  totalPaid: number;
  lastUpdated: string;
}

export default function ExploreBounties() {
  const router = useRouter();
  const [bounties, setBounties] = useState<Bounty[]>([]);

  useEffect(() => {
    const fetchBounties = async () => {
      try {
        const response = await fetch('/api/bounties');
        const data = await response.json();
        setBounties(data);
      } catch (error) {
        console.error('Error fetching bounties:', error);
      }
    };

    fetchBounties();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Explore Bounties</h1>
      <div className="space-y-4">
        {bounties.map((bounty) => (
          <div 
            key={bounty._id} 
            className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-700 transition-colors cursor-pointer"
            onClick={() => router.push(`/bounties/${bounty._id}`)}
          >
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="font-semibold">{bounty.networkName}</span>
              </div>
              <div className="flex items-center space-x-8">
                <div className="text-right">
                  <div className="text-sm text-gray-400">Max Rewards</div>
                  <div>{formatCurrency(bounty.maxRewards)}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-400">Total Paid</div>
                  <div>{formatCurrency(bounty.totalPaid)}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-400">Last Updated</div>
                  <div>{formatDate(bounty.lastUpdated)}</div>
                </div>
                <ChevronRightIcon className="w-6 h-6 text-gray-400" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 