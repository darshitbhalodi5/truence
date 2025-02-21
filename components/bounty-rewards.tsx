import { formatRewardNumber, getCurrency } from "@/utils/networkCurrency";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  EqualIcon,
  ScaleIcon,
  ShieldAlertIcon,
} from "lucide-react";
import { BountyRewardsProps } from "@/types/bountyRewardProps";

export function BountyRewards({
  networkName,
  criticalReward,
  highReward,
  mediumReward,
  lowReward,
  severityDescriptions,
}: BountyRewardsProps) {
  // Create reward cards array to ensure consistent order
  const rewardCards = [
    {
      severity: "Critical",
      reward: criticalReward,
      bg: "bg-[#000108]",
      border: "border-[#694770]",
      borderLeft: "border-l-[#D6188A]",
      text: "text-[#D6188A]",
      icon: <ShieldAlertIcon className="h-6 w-6 text-[#D6188A]" />,
    },
    {
      severity: "High",
      reward: highReward,
      bg: "bg-[#000108]",
      border: "border-[#663A2B]",
      borderLeft: "border-l-[#AC350D]",
      text: "text-[#AC350D]",
      icon: <ArrowUpIcon className="h-6 w-6 text-[#AC350D]" />,
    },
    {
      severity: "Medium",
      reward: mediumReward,
      bg: "bg-[#000108]",
      border: "border-[#576933]",
      borderLeft: "border-l-[#A4DB3C]",
      text: "text-[#A4DB3C]",
      icon: <EqualIcon className="h-6 w-6 text-[#A4DB3C]" />,
    },
    {
      severity: "Low",
      reward: lowReward,
      bg: "bg-[#000108]",
      border: "border-[#31695A]",
      borderLeft: "border-l-[#33C59E]",
      text: "text-[#33C59E]",
      icon: <ArrowDownIcon className="h-6 w-6 text-[#33C59E]" />,
    },
  ].filter((card) => card.reward > 0);

  // Create a map for quick lookup by severity
  const severityStyleMap: Record<
    string,
    { text: string; icon: React.ReactNode }
  > = rewardCards.reduce((map, card) => {
    map[card.severity] = {
      text: card.text,
      icon: card.icon,
    };
    return map;
  }, {} as Record<string, { text: string; icon: React.ReactNode }>);

  return (
    <div className="space-y-12">
      <div className="bg-[#000317] p-6 mt-6 group hover:bg-[#0A0F29] hover:shadow-lg transition-all duration-300">
        {/* Main title */}
        <div className="flex items-center space-x-3 mb-6">
          <ScaleIcon className="w-6 h-6 text-[#FAFCA3]" />
          <h2 className="text-xl font-semibold text-[#FAFCA3]">
            Impact Based Reward Distribution
          </h2>
        </div>

        {/* Reward Structure */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {rewardCards.map((card) => (
            <div
              key={card.severity}
              className={`${card.bg} rounded-lg p-6 sm:p-4 border ${card.border} border-l-4 ${card.borderLeft} w-full flex flex-col`}
            >
              <div className="flex items-center space-x-2 mb-4">
                {card.icon}
                <h3 className={`text-xl font-medium ${card.text}`}>
                  {card.severity} Severity
                </h3>
              </div>
              <div className="pl-8">
                <div className="text-2xl font-bold text-white">
                  {card.reward} <span>{getCurrency(networkName)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Severity Descriptions */}
      <div className="bg-[#000317] p-6 mt-6 group hover:bg-[#0A0F29] hover:shadow-lg transition-all duration-300">
        {severityDescriptions && severityDescriptions.length > 0 && (
          <div className="bg-[#000108] grid grid-cols-1 gap-4 mt-8">
            {severityDescriptions.map((item, index) => {
              const style = severityStyleMap[item.severity] || {
                text: "text-white",
              };
              return (
                <div
                  key={index}
                  className={`bg-[#000108] border border-[#694770] rounded-lg p-4  transition-all duration-200`}
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <span className={`${style.text} text-xl font-semibold`}>
                      {item.severity} Severity Scope
                    </span>
                  </div>
                  <ul className="list-disc pl-8 space-y-2">
                    {item.description.map((desc, i) => (
                      <li key={i} className="text-[#8E8E8E]">
                        {desc}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
