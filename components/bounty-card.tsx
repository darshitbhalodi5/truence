'use client';

import Image from 'next/image';
import Link from 'next/link';
import { DisplayBounty, DisplayBountyStatus } from '@/types/displayBounty';

interface BountyCardProps {
  bounty: DisplayBounty;
}

const NETWORK_CURRENCIES: { [key: string]: string } = {
  'Arbitrum': 'ARB',
  'Arbitrum Watchdog': 'ARB',
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

  const calculateStatus = (): DisplayBountyStatus => {
    const now = new Date();
    
    if (!bounty.startDate) {
      return 'LIVE_SOON';
    }

    const currentTime = now.getTime();
    const startTime = new Date(bounty.startDate).getTime();
    const endTime = bounty.endDate ? new Date(bounty.endDate).getTime() : null;

    if (endTime && currentTime >= endTime) {
      return 'CLOSED';
    }

    if (currentTime < startTime) {
      return 'UPCOMING';
    }

    return 'IN_PROCESS';
  };

  const getCurrency = (networkName: string) => {
    return NETWORK_CURRENCIES[networkName] || NETWORK_CURRENCIES.Default;
  };

  const formatNetworkForUrl = (networkName: string) => {
    return networkName.toLowerCase().replace(/\s+/g, '-');
  };

  const status = calculateStatus();
  const displayStatus = status.replace('_', ' ');
  const isClosed = status === 'CLOSED';

  return (
    <Link href={`/bounties/explore/${formatNetworkForUrl(bounty.networkName)}`} className={`block transition-all duration-300 ${isClosed ? 'opacity-60 hover:opacity-80' : 'opacity-100'}`}>
      <div className={`bg-gray-800/50 backdrop-blur rounded-lg p-4 hover:bg-gray-800/70 transition-all duration-200 ${isClosed ? 'grayscale' : ''}`}>
        <div className="flex items-center gap-3 mb-3">
          <div className="relative w-8 h-8 flex-shrink-0">
            <Image
              src={bounty.logoUrl}
              alt={bounty.networkName}
              fill
              className={`object-contain ${isClosed ? 'filter grayscale' : ''}`}
            />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-base font-semibold text-white truncate">{bounty.networkName}</h3>
              <div className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
                {displayStatus}
              </div>
            </div>
            <p className="text-xs text-gray-400 line-clamp-1 mt-0.5">{bounty.description}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-3 text-xs">
          <div>
            <p className="text-gray-400 mb-0.5">Max Rewards</p>
            <p className="text-white font-medium">
              {bounty.maxRewards.toLocaleString()} {getCurrency(bounty.networkName)}
            </p>
          </div>
          <div>
            <p className="text-gray-400 mb-0.5">Start Date</p>
            <p className="text-white font-medium">{formatDate(bounty.startDate)}</p>
          </div>
          <div>
            <p className="text-gray-400 mb-0.5">End Date</p>
            <p className="text-white font-medium">{formatDate(bounty.endDate)}</p>
          </div>
        </div>
      </div>
    </Link>
  );
} 