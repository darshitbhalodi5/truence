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
}

export interface NetwrokItemProps {
  bounty: Bounty;
  statusCounts: StatusCounts;
}

export interface NetwrokListProps {
  bounties: Bounty[];
  statusCounts: StatusCounts;
}
