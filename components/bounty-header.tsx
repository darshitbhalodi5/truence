'use client';

import Image from 'next/image';
import { DisplayBounty } from '@/types/displayBounty';
import { formatRewardNumber, getCurrency } from '@/utils/networkCurrency';

interface BountyHeaderProps {
  bounty: DisplayBounty;
}

export function BountyHeader({ bounty }: BountyHeaderProps) {
  const formatDate = (date: Date | null) => {
    if (!date) return 'TBA';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Network Info */}
      <div className="flex items-start gap-4">
        <div className="relative w-12 h-12 flex-shrink-0">
          <Image
            src={bounty.logoUrl}
            alt={bounty.networkName}
            fill
            className="object-contain"
          />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">{bounty.networkName}</h1>
          <p className="text-gray-300">{bounty.description}</p>
        </div>
      </div>

      <hr className="border-gray-800" />

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {bounty.maxRewards > 0 && (
          <div className="bg-gray-800/50 rounded-lg p-4">
            <div className="text-sm text-gray-400 mb-1">Maximum Bounty</div>
            <div className="text-lg font-semibold text-green-400">
            {formatRewardNumber(bounty.maxRewards)} {getCurrency(bounty.networkName)}
            </div>
          </div>
        )}

        {bounty.totalPaid > 0 && (
          <div className="bg-gray-800/50 rounded-lg p-4">
            <div className="text-sm text-gray-400 mb-1">Total Paid</div>
            <div className="text-lg font-semibold text-blue-400">
            {formatRewardNumber(bounty.totalPaid)} {getCurrency(bounty.networkName)}
            </div>
          </div>
        )}

        {bounty.startDate && (
          <div className="bg-gray-800/50 rounded-lg p-4">
            <div className="text-sm text-gray-400 mb-1">Live Since</div>
            <div className="text-lg font-semibold text-white">
              {formatDate(bounty.startDate)}
            </div>
          </div>
        )}

        {bounty.endDate && (
          <div className="bg-gray-800/50 rounded-lg p-4">
            <div className="text-sm text-gray-400 mb-1">End Date</div>
            <div className="text-lg font-semibold text-white">
              {formatDate(bounty.endDate)}
            </div>
          </div>
        )}

        <div className="bg-gray-800/50 rounded-lg p-4">
          <div className="text-sm text-gray-400 mb-1">Last Updated</div>
          <div className="text-lg font-semibold text-purple-400">
            {formatDate(bounty.lastUpdated)}
          </div>
        </div>
      </div>
    </div>
  );
} 