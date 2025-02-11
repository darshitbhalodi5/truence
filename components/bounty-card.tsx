'use client';

import Image from 'next/image';
import Link from 'next/link';
import { DisplayBounty, DisplayBountyStatus } from '@/types/displayBounty';

interface BountyCardProps {
  bounty: DisplayBounty;
}

const NETWORK_CURRENCIES: { [key: string]: string } = {
  'Arbitrum': 'ARB',
  'Optimism': 'OP',
  'Ethereum': 'ETH',
  'Polygon': 'MATIC',
  'Base': 'ETH',
  'Default': 'USDC'
};

export function BountyCard({ bounty }: BountyCardProps) {
  const formatDate = (date: Date | undefined) => {
    if (!date) return 'TBA';
    return new Date(date).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
      timeZone: 'UTC'
    }).replace(',', '');
  };

  const getStatusColor = (status: DisplayBountyStatus) => {
    switch (status) {
      case 'LIVE_SOON':
        return 'bg-yellow-500/10 text-yellow-500';
      case 'IN_PROCESS':
        return 'bg-green-500/10 text-green-500';
      case 'CLOSED':
        return 'bg-red-500/10 text-red-500';
      case 'UPCOMING':
        return 'bg-blue-500/10 text-blue-500';
      default:
        return 'bg-gray-500/10 text-gray-500';
    }
  };

  // Calculate status if it's not provided
  const calculateStatus = (): DisplayBountyStatus => {
    const now = new Date();
    
    // If no start date, it's LIVE_SOON
    if (!bounty.startDate) {
      return 'LIVE_SOON';
    }

    const currentTime = now.getTime();
    const startTime = new Date(bounty.startDate).getTime();
    const endTime = bounty.endDate ? new Date(bounty.endDate).getTime() : null;

    // If end date exists and current time is past end date, it's CLOSED
    if (endTime && currentTime >= endTime) {
      return 'CLOSED';
    }

    // If current time is before start date, it's UPCOMING
    if (currentTime < startTime) {
      return 'UPCOMING';
    }

    // If we're between start and end date (or no end date), it's IN_PROCESS
    return 'IN_PROCESS';
  };

  const status = calculateStatus();
  const displayStatus = status.replace('_', ' ');

  // Get the native currency for the network
  const getCurrency = (networkName: string) => {
    return NETWORK_CURRENCIES[networkName] || NETWORK_CURRENCIES.Default;
  };

  const isClosed = status === 'CLOSED';

  return (
    <Link href={`/bounties/${bounty._id}`} className={`block transition-all duration-300 ${isClosed ? 'opacity-60 hover:opacity-80' : 'opacity-100'}`}>
      <div className={`bg-gray-800/50 backdrop-blur rounded-xl p-6 hover:bg-gray-800/70 transition-all duration-200 ${isClosed ? 'grayscale' : ''}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="relative w-10 h-10">
              <Image
                src={bounty.logoUrl}
                alt={bounty.networkName}
                fill
                className={`object-contain ${isClosed ? 'filter grayscale' : ''}`}
              />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">{bounty.networkName}</h3>
              <p className="text-sm text-gray-400 line-clamp-1">{bounty.description}</p>
            </div>
          </div>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(status)}`}>
            {displayStatus}
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-gray-400">Max Rewards</p>
            <p className="text-white font-semibold">
              {bounty.maxRewards.toLocaleString()} {getCurrency(bounty.networkName)}
            </p>
          </div>
          <div>
            <p className="text-gray-400">Start Date</p>
            <p className="text-white font-semibold">{formatDate(bounty.startDate)}</p>
          </div>
          <div>
            <p className="text-gray-400">End Date</p>
            <p className="text-white font-semibold">{formatDate(bounty.endDate)}</p>
          </div>
        </div>
      </div>
    </Link>
  );
} 