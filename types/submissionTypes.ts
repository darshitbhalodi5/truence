export type SeverityLevel = 'critical' | 'high' | 'medium' | 'low';

export interface BountySubmission {
  programName: string;
  title: string;
  description: string;
  severityLevel: SeverityLevel;
  files: string[]; // Array of file URLs
  walletAddress: string;
  createdAt: Date;
  updatedAt: Date;
}