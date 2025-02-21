interface SeverityDescription {
  severity: "Critical" | "High" | "Medium" | "Low";
  description: string[];
}

export interface BountyRewardsProps {
  networkName: string;
  criticalReward: number;
  highReward: number;
  mediumReward: number;
  lowReward: number;
  severityDescriptions?: SeverityDescription[];
}
