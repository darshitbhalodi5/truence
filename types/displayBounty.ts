export type DisplayBountyStatus =
  | "LIVE_SOON"
  | "IN_PROCESS"
  | "CLOSED"
  | "UPCOMING";

export interface DisplayBounty {
  _id: string;
  networkName: string;
  logoUrl: string;
  description: string;
  maxRewards: number;
  totalPaid: number;
  startDate: Date | null;
  endDate: Date | null;
  lastUpdated: Date;
  status: DisplayBountyStatus;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
}

export interface BountyCardProps {
  bounty: DisplayBounty;
}

export interface BountyTableProps {
  bounties: Array<BountyCardProps["bounty"]>;
  featuredBountyId?: string;
}

export type SortField = "rewards" | "startDate" | "endDate";
export type SortDirection = "asc" | "desc";
