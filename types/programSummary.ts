import { StatusCounts } from "@/types/statusCounter";

export interface ReviewerAddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  networkName: string;
  reviewerAddresses: string[];
}

export interface Bounty {
  networkName: string;
  reviewerAddresses?: string[];
  logoUrl?: string;
  statusCounts: StatusCounts;
}

export interface NetwrokItemProps {
  key: number;
  bounty: Bounty;
  statusCounts?: StatusCounts;
}

export interface NetwrokListProps {
  bounties: Bounty[];
  statusCounts?: StatusCounts;
}
