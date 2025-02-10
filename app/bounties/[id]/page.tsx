'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeftIcon, ShieldCheckIcon, DocumentCheckIcon, ClockIcon } from '@heroicons/react/24/outline';

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
  const [activeTab, setActiveTab] = useState('information');

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
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (!bounty) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-300">Bounty not found</h2>
          <button
            onClick={() => router.push('/bounties')}
            className="mt-4 text-blue-500 hover:text-blue-400"
          >
            Return to bounties
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center space-x-2 text-gray-400 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            <span>Back to Bounties</span>
          </button>

          <div className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-lg p-8">
            <h1 className="text-4xl font-bold mb-4">{bounty.networkName}</h1>
            <p className="text-gray-300 mb-6">{bounty.description}</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Stats Cards */}
              <div className="bg-gray-800/50 rounded-lg p-6 backdrop-blur-sm">
                <div className="text-sm text-gray-400 mb-2">Maximum Reward</div>
                <div className="text-2xl font-bold text-green-400">
                  {formatCurrency(bounty.maxRewards)}
                </div>
              </div>

              <div className="bg-gray-800/50 rounded-lg p-6 backdrop-blur-sm">
                <div className="text-sm text-gray-400 mb-2">Total Paid</div>
                <div className="text-2xl font-bold text-blue-400">
                  {formatCurrency(bounty.totalPaid)}
                </div>
              </div>

              <div className="bg-gray-800/50 rounded-lg p-6 backdrop-blur-sm">
                <div className="text-sm text-gray-400 mb-2">Last Updated</div>
                <div className="text-2xl font-bold text-purple-400">
                  {formatDate(bounty.lastUpdated)}
                </div>
              </div>
            </div>

            {/* Requirements Badges */}
            <div className="flex flex-wrap gap-4 mt-6">
              <div className="flex items-center space-x-2 bg-gray-800/30 px-4 py-2 rounded-full">
                <ShieldCheckIcon className="w-5 h-5 text-green-400" />
                <span className="text-sm">PoC Required</span>
              </div>
              <div className="flex items-center space-x-2 bg-gray-800/30 px-4 py-2 rounded-full">
                <DocumentCheckIcon className="w-5 h-5 text-yellow-400" />
                <span className="text-sm">KYC Required</span>
              </div>
              <div className="flex items-center space-x-2 bg-gray-800/30 px-4 py-2 rounded-full">
                <ClockIcon className="w-5 h-5 text-blue-400" />
                <span className="text-sm">Active Program</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-6 bg-gray-800 p-1 rounded-lg">
          {['information', 'scope', 'rewards', 'rules'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 px-6 rounded-md text-sm font-medium capitalize transition-colors
                ${activeTab === tab 
                  ? 'bg-blue-500 text-white' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content Sections */}
        <div className="bg-gray-800 rounded-lg p-6">
          {activeTab === 'information' && (
            <div className="space-y-6">
              <section>
                <h2 className="text-2xl font-semibold mb-4">About the Program</h2>
                <p className="text-gray-300">{bounty.description}</p>
              </section>
              
              <section>
                <h2 className="text-2xl font-semibold mb-4">Eligibility</h2>
                <p className="text-gray-300">{bounty.additionalDetails.eligibility}</p>
              </section>
            </div>
          )}

          {activeTab === 'scope' && (
            <div className="space-y-6">
              <section>
                <h2 className="text-2xl font-semibold mb-4">Scope</h2>
                <div className="bg-gray-700/50 rounded-lg p-6">
                  <p className="text-gray-300">{bounty.additionalDetails.scope}</p>
                </div>
              </section>
            </div>
          )}

          {activeTab === 'rewards' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Critical */}
                <div className="bg-pink-500/10 border border-pink-500/20 rounded-lg p-6">
                  <div className="text-pink-500 font-semibold mb-2">Critical</div>
                  <div className="text-2xl font-bold">$50k - $1M</div>
                </div>
                
                {/* High */}
                <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-6">
                  <div className="text-orange-500 font-semibold mb-2">High</div>
                  <div className="text-2xl font-bold">$30k</div>
                </div>
                
                {/* Medium */}
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-6">
                  <div className="text-blue-500 font-semibold mb-2">Medium</div>
                  <div className="text-2xl font-bold">$10k</div>
                </div>
                
                {/* Low */}
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-6">
                  <div className="text-green-500 font-semibold mb-2">Low</div>
                  <div className="text-2xl font-bold">$1.5k</div>
                </div>
              </div>

              <section>
                <h3 className="text-xl font-semibold mb-4">Reward Details</h3>
                <p className="text-gray-300">{bounty.additionalDetails.rewards}</p>
              </section>
            </div>
          )}

          {activeTab === 'rules' && (
            <div className="space-y-6">
              <section>
                <h2 className="text-2xl font-semibold mb-4">Program Rules</h2>
                <div className="bg-gray-700/50 rounded-lg p-6">
                  <p className="text-gray-300">{bounty.additionalDetails.rules}</p>
                </div>
              </section>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="mt-8 flex justify-center">
          <button 
            className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
            onClick={() => {/* Add submission logic */}}
          >
            Submit a Bug
          </button>
        </div>
      </div>
    </div>
  );
} 