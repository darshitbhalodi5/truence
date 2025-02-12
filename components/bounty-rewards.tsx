import { formatRewardNumber, getCurrency } from '@/utils/networkCurrency';

interface SeverityDescription {
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  description: string;
}

interface BountyRewardsProps {
  networkName: string;
  criticalReward: number;
  highReward: number;
  mediumReward: number;
  lowReward: number;
  severityDescriptions?: SeverityDescription[];
}

export function BountyRewards({
  networkName,
  criticalReward,
  highReward,
  mediumReward,
  lowReward,
  severityDescriptions
}: BountyRewardsProps) {

  const getSeverityStyle = (severity: string) => {
    const styles = {
      Critical: {
        border: 'border-pink-500/30',
        bg: 'bg-pink-500/10',
        text: 'text-pink-500',
      },
      High: {
        border: 'border-orange-500/30',
        bg: 'bg-orange-500/10',
        text: 'text-orange-500',
      },
      Medium: {
        border: 'border-blue-500/30',
        bg: 'bg-blue-500/10',
        text: 'text-blue-500',
      },
      Low: {
        border: 'border-green-500/30',
        bg: 'bg-green-500/10',
        text: 'text-green-500',
      }
    };
    return styles[severity as keyof typeof styles];
  };

  // Create reward cards array to ensure consistent order
  const rewardCards = [
    {
      severity: 'Critical',
      reward: criticalReward,
      color: 'bg-pink-500',
      border:'border-pink-700/50',
      hover:'hover:border-pink-700',
      text: 'text-pink-500',
    },
    {
      severity: 'High',
      reward: highReward,
      color: 'bg-orange-500',
      border:'border-orange-700/50',
      hover:'hover:border-orange-700',
      text: 'text-orange-500',
    },
    {
      severity: 'Medium',
      reward: mediumReward,
      color: 'bg-blue-500',
      border:'border-blue-700/50',
      hover:'hover:border-blue-700',
      text: 'text-blue-500',
    },
    {
      severity: 'Low',
      reward: lowReward,
      color: 'bg-green-500',
      border:'border-green-700/50',
      hover:'hover:border-green-700',
      text: 'text-green-500',
    }
  ].filter(card => card.reward > 0);

  return (
    <div className="space-y-6">
      {/* Title Section - Centered with line */}
      <div className="text-center space-y-3">
        <h2 className="text-xl font-semibold bg-gradient-to-r from-yellow-100 via-yellow-200 to-yellow-300 bg-clip-text text-transparent">
          Impact Based Reward Distribution
        </h2>
        <div className="w-full h-px bg-gradient-to-r from-transparent via-[#f2f1ed] to-transparent"></div>
      </div>

      {/* Rewards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
        {rewardCards.map((card) => (
          <div 
            key={card.severity}
            className={`bg-gray-800/40 border ${card.border} rounded-lg p-4 ${card.hover} transition-all duration-200`}
          >
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${card.color}`}></div>
                <span className={`${card.text}`}>{card.severity}</span>
              </div>
              <span className="ml-auto text-xs text-gray-500">{getCurrency(networkName)}</span>
            </div>
            <div className="text-2xl font-bold text-white">
              {formatRewardNumber(card.reward)}
            </div>
          </div>
        ))}
      </div>
      <div>
      <div className="w-full h-px bg-gradient-to-r from-transparent via-[#f2f1ed] to-transparent"></div>
      </div>
       {/* Severity Descriptions */}
       {severityDescriptions && severityDescriptions.length > 0 && (
        <div className="grid grid-cols-1 gap-4 mt-8">
          {severityDescriptions.map((item, index) => {
            const style = getSeverityStyle(item.severity);
            return (
              <div
                key={index}
                className={`${style.bg} border ${style.border} rounded-lg p-4  transition-all duration-200`}
              >
                <div className="flex items-center space-x-2 mb-2">
                  <span className={`${style.text} font-medium`}>{item.severity} Severity Scope</span>
                </div>
                <p className="text-gray-300 ml-4">{item.description}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
} 