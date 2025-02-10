'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

interface Bounty {
  _id: string;
  networkName: string;
  maxRewards: number;
  totalPaid: number;
  lastUpdated: string;
  description: string;
  additionalDetails: {
    scope: string;
    eligibility: string;
    rules: string;
    rewards: string;
  };
}

export default function BountyDetails() {
  const router = useRouter();
  const params = useParams();
  const [bounty, setBounty] = useState<Bounty | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBounty = async () => {
      try {
        const response = await fetch(`/api/bounties/${params.id}`);
        if (!response.ok) {
          throw new Error('Bounty not found');
        }
        const data = await response.json();
        setBounty(data);
      } catch (error) {
        console.error('Error fetching bounty:', error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchBounty();
    }
  }, [params.id]);

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

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!bounty) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Bounty not found</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => router.back()}
        className="flex items-center space-x-2 text-gray-400 hover:text-white mb-6"
      >
        <ArrowLeftIcon className="w-5 h-5" />
        <span>Back to Bounties</span>
      </button>

      <div className="bg-gray-800 rounded-lg p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">{bounty.networkName}</h1>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gray-700 p-4 rounded-lg">
              <div className="text-sm text-gray-400">Max Rewards</div>
              <div className="text-xl font-semibold">{formatCurrency(bounty.maxRewards)}</div>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg">
              <div className="text-sm text-gray-400">Total Paid</div>
              <div className="text-xl font-semibold">{formatCurrency(bounty.totalPaid)}</div>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg">
              <div className="text-sm text-gray-400">Last Updated</div>
              <div className="text-xl font-semibold">{formatDate(bounty.lastUpdated)}</div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Description</h2>
            <p className="text-gray-300">{bounty.description}</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Scope</h2>
            <p className="text-gray-300">{bounty.additionalDetails.scope}</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Eligibility</h2>
            <p className="text-gray-300">{bounty.additionalDetails.eligibility}</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Rules</h2>
            <p className="text-gray-300">{bounty.additionalDetails.rules}</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Rewards Structure</h2>
            <p className="text-gray-300">{bounty.additionalDetails.rewards}</p>
          </section>
        </div>
      </div>
    </div>
  );
} 