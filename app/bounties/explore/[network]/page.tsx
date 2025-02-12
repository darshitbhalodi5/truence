'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { BountyHeader } from '@/components/bounty-header';
import { DisplayBounty } from '@/types/displayBounty';
import { BountyRewards } from '@/components/bounty-rewards';

export interface SeverityDescription {
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  description: string;
}


interface BountyDetails {
  networkName: string;
  criticalReward: number;
  highReward: number;
  mediumReward: number;
  lowReward: number;
  additionalDetails: {
    scope: string;
    eligibility: string;
    rules: string;
    rewards: string;
  };
  severityDescriptions: SeverityDescription[]
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
            {/* Navigation Tabs and Submit Button */}
            <div className="relative mb-8">
              <div className="flex items-center justify-between mb-6 border-b border-gray-700/50">
                <div className="flex space-x-6">
                  {['information', 'scope', 'rewards', 'rules'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className="relative py-4 px-2 text-sm font-medium capitalize transition-all duration-200 group"
                    >
                      <span className={`${
                        activeTab === tab 
                          ? 'text-blue-500' 
                          : 'text-gray-400 hover:text-gray-200'
                      }`}>
                        {tab}
                      </span>
                      {/* Bottom line indicator */}
                      <span className={`absolute bottom-0 left-0 w-full h-0.5 transform transition-all duration-200
                        ${activeTab === tab 
                          ? 'bg-gradient-to-r from-blue-500 to-blue-600 scale-x-100' 
                          : 'bg-blue-500/0 scale-x-0 group-hover:bg-blue-500/50 group-hover:scale-x-75'
                        }`}
                      />
                    </button>
                  ))}
                </div>

                {/* Submit Button */}
                <button 
                  className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 
                    text-white px-6 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 
                    shadow-lg shadow-yellow-500/25 hover:shadow-yellow-500/40"
                  onClick={() => {}}
                >
                  Submit a Bug
                </button>
              </div>
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
                  <BountyRewards 
                    networkName={bountyDetails.networkName}
                    criticalReward={bountyDetails.criticalReward}
                    highReward={bountyDetails.highReward}
                    mediumReward={bountyDetails.mediumReward}
                    lowReward={bountyDetails.lowReward}
                    severityDescriptions={bountyDetails.severityDescriptions}
                  />
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
          </>
        )}
      </div>
    </div>
  );
} 