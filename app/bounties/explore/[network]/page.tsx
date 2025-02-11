'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { BountyHeader } from '@/components/bounty-header';
import { DisplayBounty } from '@/types/displayBounty';

interface BountyDetails {
  networkName: string;
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
  const [displayBounty, setDisplayBounty] = useState<DisplayBounty | null>(null);
  const [bountyDetails, setBountyDetails] = useState<BountyDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('information');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch display bounty data
        const displayResponse = await fetch(`/api/display-bounties/${params.network}`);
        const displayData = await displayResponse.json();
        setDisplayBounty(displayData);

        // Try to fetch additional details if available
        try {
          const detailsResponse = await fetch(`/api/bounties/${params.network}`);
          if (detailsResponse.ok) {
            const detailsData = await detailsResponse.json();
            setBountyDetails(detailsData);
          }
        } catch (error) {
          console.error('Additional details not found:', error);
        }
      } catch (error) {
        console.error('Error fetching bounty:', error);
      } finally {
        setLoading(false);
      }
    };

    if (params.network) {
      fetchData();
    }
  }, [params.network]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (!displayBounty) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-300">Bounty not found</h2>
          <button
            onClick={() => router.push('/bounties/explore')}
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
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center space-x-2 text-gray-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          <span>Back to Bounties</span>
        </button>

        {/* Bounty Header */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-lg p-8 mb-8">
          <BountyHeader bounty={displayBounty} />
        </div>

        {/* Only show tabs and content sections if additional details are available */}
        {bountyDetails && (
          <>
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
                    <p className="text-gray-300">{displayBounty.description}</p>
                  </section>
                  
                  <section>
                    <h2 className="text-2xl font-semibold mb-4">Eligibility</h2>
                    <p className="text-gray-300">{bountyDetails.additionalDetails.eligibility}</p>
                  </section>
                </div>
              )}

              {activeTab === 'scope' && (
                <div className="space-y-6">
                  <section>
                    <h2 className="text-2xl font-semibold mb-4">Scope</h2>
                    <div className="bg-gray-700/50 rounded-lg p-6">
                      <p className="text-gray-300">{bountyDetails.additionalDetails.scope}</p>
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
                    <p className="text-gray-300">{bountyDetails.additionalDetails.rewards}</p>
                  </section>
                </div>
              )}

              {activeTab === 'rules' && (
                <div className="space-y-6">
                  <section>
                    <h2 className="text-2xl font-semibold mb-4">Program Rules</h2>
                    <div className="bg-gray-700/50 rounded-lg p-6">
                      <p className="text-gray-300">{bountyDetails.additionalDetails.rules}</p>
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
          </>
        )}
      </div>
    </div>
  );
} 