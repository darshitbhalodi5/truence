export type DisplayBountyStatus = 'LIVE_SOON' | 'IN_PROCESS' | 'CLOSED' | 'UPCOMING';

export interface DisplayBounty {
  _id: string;
  networkName: string;
  logoUrl: string;
  description: string;
  maxRewards: number;
  startDate?: Date;
  endDate?: Date;
  lastUpdated: Date;
  status: DisplayBountyStatus;
  createdAt: Date;
  updatedAt: Date;
} 