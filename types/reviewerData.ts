export interface FileData {
  _id: string;
  filename: string;
  originalName: string;
  contentType: string;
  size: number;
  uploadDate: string;
}

export interface ReviewSubmission {
  _id: string;
  programName: string;
  title: string;
  description: string;
  severityLevel: string;
  reviewerSeverity?: string;
  status: string;
  misUseRange?: string;
  createdAt: string;
  walletAddress: string;
  files?: string[]; // This is an array of file IDs
  bountyLogo?: string;
}

export interface BountyDetails {
  finalSeverity: boolean;
  initialSeverities?: string[];
}

export interface ReviewerData {
  isReviewer: boolean;
  submissions: ReviewSubmission[];
  bounties: Array<{
    networkName: string;
    logoUrl: string;
    finalSeverity?: boolean;
    initialSeverities?: string[];
  }>;
}
