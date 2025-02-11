'use client';

import Image from 'next/image';
import { DisplayBounty } from '@/types/displayBounty';

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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getTagColor = (tag: string) => {
    const colors = {
      'security': 'bg-red-500/10 text-red-500 border-red-500/20',
      'smart-contracts': 'bg-blue-500/10 text-blue-500 border-blue-500/20',
      'bug-bounty': 'bg-green-500/10 text-green-500 border-green-500/20',
      'defi': 'bg-purple-500/10 text-purple-500 border-purple-500/20',
      'staking': 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
      'default': 'bg-gray-500/10 text-gray-500 border-gray-500/20'
    };
    return colors[tag.toLowerCase() as keyof typeof colors] || colors.default;
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
              {formatCurrency(bounty.maxRewards)}
            </div>
          </div>
        )}

        {bounty.totalPaid > 0 && (
          <div className="bg-gray-800/50 rounded-lg p-4">
            <div className="text-sm text-gray-400 mb-1">Total Paid</div>
            <div className="text-lg font-semibold text-blue-400">
              {formatCurrency(bounty.totalPaid)}
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

      {/* Tags */}
      {bounty.tags && bounty.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {bounty.tags.slice(0, 5).map((tag, index) => (
            <div
              key={index}
              className={`px-3 py-1 rounded-full text-sm font-medium border ${getTagColor(tag)}`}
            >
              {tag}
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 