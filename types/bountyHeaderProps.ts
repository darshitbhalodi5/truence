export interface BountyHeaderProps {
  networkName: string;
  logoUrl: string;
  description: string;
  maxRewards: number;
  totalPaid: number;
  startDate: Date | null;
  endDate: Date | null;
  lastUpdated: Date;
}
