export interface SubmissionData {
  _id: string;
  programName: string;
  title: string;
  description: string;
  severityLevel: string;
  reviewerSeverity?: string;
  misUseRange?:string;
  status: string;
  createdAt: string;
  files?: string[];
  fileNames?: string[];
  bountyLogo?: string;
}

export interface FileMetadata {
  filename: string;
  originalName: string;
  contentType: string;
  size: number;
  uploadDate: string;
}
