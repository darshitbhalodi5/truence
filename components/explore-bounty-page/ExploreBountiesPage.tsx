'use client';

import { useEffect, useState } from 'react';
import { DisplayBounty } from '@/types/displayBounty';
import { BountyCard } from '@/components/bounty-card';
import { Navbar } from '@/components/navbar/Navbar';

export default function ExploreBountiesPage() {
  const [bounties, setBounties] = useState<DisplayBounty[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBounties = async () => {
      try {
        const response = await fetch('/api/display-bounties');
        if (!response.ok) {
          throw new Error('Failed to fetch bounties');
        }
        const data = await response.json();
        setBounties(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load bounties');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBounties();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 p-4 md:p-6">
        <div className="max-w-6xl mx-auto">
          <div className="h-32 mb-6" /> {/* Space for future content */}
          <div className="animate-pulse space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-28 bg-gray-800 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 p-4 md:p-6">
        <div className="max-w-6xl mx-auto">
          <div className="h-32 mb-6" /> {/* Space for future content */}
          <div className="bg-red-500/10 text-red-500 p-4 rounded-lg">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
        {/* <div className="h-32 mb-6"> Space for future content */}
          <p className="text-gray-400 text-sm md:text-base">
            Discover and participate in bounties from various blockchain networks
          </p>
        </div>

        <div className="space-y-3">
          {bounties.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400">No bounties available at the moment</p>
            </div>
          ) : (
            bounties.map((bounty) => (
              <BountyCard key={bounty._id} bounty={bounty} />
            ))
          )}
        </div>
      </div>
    </div>
  );
} 