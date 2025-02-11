'use client';

import { useEffect, useState } from 'react';
import { DisplayBounty } from '@/types/displayBounty';
import { BountyCard } from '@/components/bounty-card';

export default function ExploreBounties() {
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
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <div className="container mx-auto">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-40 bg-gray-800 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <div className="container mx-auto">
          <div className="bg-red-500/10 text-red-500 p-4 rounded-xl">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="container mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Explore Bounties</h1>
          <p className="text-gray-400">
            Discover and participate in bounties from various blockchain networks
          </p>
        </div>

        <div className="space-y-4">
          {bounties.length === 0 ? (
            <div className="text-center py-12">
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