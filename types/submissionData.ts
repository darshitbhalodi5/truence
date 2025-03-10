export interface SubmissionData {
  _id: string;
  programName: string;
  title: string;
  description: string;
  severityLevel: string;
  reviewerSeverity?: string;
  misUseRange?: string;
  status: string;
  createdAt: string;
  files?: string[];
  fileNames?: string[];
  bountyLogo?: string;
  additionalPaymentRequired?: boolean;
  progressStatus?: {
    kycVerified?: boolean;
    paymentConfirmed?: boolean;
    additionalPaymentConfirmed?: boolean;
  };
  bountyInfo?: {
    additionalPaymentRequired?: boolean;
  };
  managerVote?: {
    vote: "accepted" | "rejected";
    comment?: string;
  };
}

export interface FileMetadata {
  filename: string;
  originalName: string;
  contentType: string;
  size: number;
  uploadDate: string;
}
