import { formatRewardNumber, getCurrency } from '@/utils/networkCurrency';

interface BountyRewardsProps {
  networkName: string;
  criticalReward: number;
  highReward: number;
  mediumReward: number;
  lowReward: number;
  rewardDetails?: string;
}

export function BountyRewards({
  networkName,
  criticalReward,
  highReward,
  mediumReward,
  lowReward,
  rewardDetails
}: BountyRewardsProps) {
  return (
    <div className="space-y-6">
      {/* Title Section - Centered with line */}
      <div className="text-center space-y-3">
        <h2 className="text-xl font-semibold bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 bg-clip-text text-transparent">
          Impact Based Reward Distribution
        </h2>
        <div className="w-full h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
      </div>

      {/* Rewards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {highReward > 0 && (
          <div className="bg-gray-800/40 border border-orange-500/20 rounded-lg p-4 hover:border-orange-500/30 transition-all duration-200">
            <div className="flex justify-between items-center mb-2">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-orange-500"></div>
              <span className="text-orange-400 text-sm">High</span>
              </div>
              <span className="ml-auto text-xs text-gray-500">{getCurrency(networkName)}</span>
            </div>
            <div className="text-2xl font-bold text-white">
              {formatRewardNumber(highReward)}
            </div>
          </div>
        )}
        
        {mediumReward > 0 && (
          <div className="bg-gray-800/40 border border-blue-500/20 rounded-lg p-4 hover:border-blue-500/30 transition-all duration-200">
            <div className="flex justify-between items-center mb-2">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              <span className="text-blue-400 text-sm">Medium</span>
              </div>
              <span className="ml-auto text-xs text-gray-500">{getCurrency(networkName)}</span>
            </div>
            <div className="text-2xl font-bold text-white">
              {formatRewardNumber(mediumReward)}
            </div>
          </div>
        )}
        
        {lowReward > 0 && (
          <div className="bg-gray-800/40 border border-green-500/20 rounded-lg p-4 hover:border-green-500/30 transition-all duration-200">
            <div className="flex justify-between items-center mb-2">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span className="text-green-400 text-sm">Low</span>
              </div>
              <span className="ml-auto text-xs text-gray-500">{getCurrency(networkName)}</span>
            </div>
            <div className="text-2xl font-bold text-white">
              {formatRewardNumber(lowReward)}
            </div>
          </div>
        )}

        {criticalReward > 0 && (
          <div className="bg-gray-800/40 border border-pink-500/20 rounded-lg p-4 hover:border-pink-500/30 transition-all duration-200">
            <div className="flex justify-between items-center mb-2">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-pink-500"></div>
              <span className="text-pink-400 text-sm">Critical</span>
              </div>
              <span className="ml-auto text-xs text-gray-500">{getCurrency(networkName)}</span>
            </div>
            <div className="text-2xl font-bold text-white">
              {formatRewardNumber(criticalReward)}
            </div>
          </div>
        )}
      </div>

      {rewardDetails && (
        <section className="bg-gray-800/40 border border-gray-700/50 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-3 text-gray-200">
            Reward Details
          </h3>
          <p className="text-gray-300 leading-relaxed text-sm">{rewardDetails}</p>
        </section>
      )}
    </div>
  );
} 