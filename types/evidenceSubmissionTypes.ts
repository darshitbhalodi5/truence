export interface UploadedFile {
  url: string;
  filename: string;
  originalName: string;
  size: number;
  type: string;
  uploadedAt: string;
}

export interface FileUploadProgress {
  fileName: string;
  progress: number;
  status: "uploading" | "success" | "error";
  error?: string;
}

export interface BountyDetails {
  networkName: string;
  initialSeverities?: string[];
  misUseRange?: string[];
}

export type SeverityLevel = "critical" | "high" | "medium" | "low";
