"use client";

import { Navbar } from "@/components/navbar/Navbar";
import { DisplayBounty } from "@/types/displayBounty";
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Loader2, X, Upload, AlertCircle, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";
import { usePrivy } from "@privy-io/react-auth";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

type SeverityLevel = "critical" | "high" | "medium" | "low";

interface UploadedFile {
  url: string;
  filename: string;
  originalName: string;
  size: number;
  type: string;
  uploadedAt: string;
}

interface FileUploadProgress {
  fileName: string;
  progress: number;
  status: "uploading" | "success" | "error";
  error?: string;
}

interface BountyDetails {
  networkName: string;
  initialSeverities?: string[];
  misUseRange?: string[];
}

const steps = ["Select Program", "Report Details", "Wallet Info"];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_FILES = 5;
const ALLOWED_FILE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
  "application/json",
  "application/zip",
  "application/x-zip-compressed",
];

export default function EvidenceSubmissionPage() {
  const { user, ready, authenticated, login } = usePrivy();

  const router = useRouter();
  const searchParams = useSearchParams();
  const bounty = searchParams.get("bountyName") || "";

  const [currentStep, setCurrentStep] = useState(0);
  const [bounties, setBounties] = useState<DisplayBounty[]>([]);
  const [selectedBounty, setSelectedBounty] = useState<string>("");

  const [bountyDetails, setBountyDetails] = useState<BountyDetails | null>(
    null
  );
  const [selectedMisUse, setSelectedMisUse] = useState<string>("");
  const [isLoadingBountyDetails, setIsLoadingBountyDetails] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [severityLevel, setSeverityLevel] = useState<SeverityLevel>("medium");
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [uploadProgress, setUploadProgress] = useState<FileUploadProgress[]>(
    []
  );
  const [walletAddress, setWalletAddress] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isWalletVerified, setIsWalletVerified] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const address: string | undefined = user?.wallet?.address;
    const fetchBounties = async () => {
      try {
        const response = await fetch("/api/submitter-form-selection");
        if (!response.ok) throw new Error("Failed to fetch bounties");
        const data = await response.json();
        setBounties(data);
      } catch (err) {
        console.error("Error fetching bounties:", err);
        toast.error("Failed to load bounties");
      }
    };

    fetchBounties();
    if (address) {
      setWalletAddress(address);
      setIsWalletVerified(true);
    }
  }, [user?.wallet?.address]);

  const fetchBountyDetails = async (networkName: string) => {
    if (!networkName) return;

    setIsLoadingBountyDetails(true);
    try {
      const response = await fetch(
        `/api/bounties/form-data?networkName=${networkName}`
      );
      if (!response.ok) throw new Error("Failed to fetch bounty details");

      const { success, data } = await response.json();
      if (success && data) {
        setBountyDetails(data);

        // Set default severity if initialSeverities exists
        if (data.initialSeverities && data.initialSeverities.length > 0) {
          // Find the first severity that matches our enum (case insensitive)
          const defaultSeverity = data.initialSeverities
            .find((sev: any) => sev.toLowerCase() as SeverityLevel)
            ?.toLowerCase() as SeverityLevel;

          if (defaultSeverity) {
            setSeverityLevel(defaultSeverity);
          }
        }
      }
    } catch (err) {
      console.error("Error fetching bounty details:", err);
      toast.error("Failed to load bounty details");
    } finally {
      setIsLoadingBountyDetails(false);
    }
  };

  useEffect(() => {
    if (bounty) {
      setSelectedBounty(bounty);
      fetchBountyDetails(bounty);
    }
  }, [bounty]);

  const validateFile = useCallback((file: File): string | null => {
    if (file.size > MAX_FILE_SIZE) {
      return `File ${file.name} is too large. Maximum size is ${
        MAX_FILE_SIZE / (1024 * 1024)
      }MB`;
    }

    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return `File type ${file.type} not allowed`;
    }

    return null;
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    if (uploadedFiles.length + files.length > MAX_FILES) {
      toast.error(`Maximum ${MAX_FILES} files allowed`);
      return;
    }

    setError("");

    // Convert FileList to array and filter out invalid files
    const fileArray = Array.from(files);
    const validFiles: File[] = [];
    const invalidFiles: string[] = [];

    fileArray.forEach((file) => {
      const error = validateFile(file);
      if (error) {
        invalidFiles.push(`${file.name}: ${error}`);
      } else {
        validFiles.push(file);
      }
    });

    // Show errors for invalid files
    if (invalidFiles.length > 0) {
      invalidFiles.forEach((error) => toast.error(error));
    }

    // Upload valid files
    validFiles.forEach(async (file) => {
      // Add file to progress tracking
      setUploadProgress((prev) => [
        ...prev,
        {
          fileName: file.name,
          progress: 0,
          status: "uploading",
        },
      ]);

      try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`Failed to upload ${file.name}`);
        }

        const data = await response.json();

        if (data.success) {
          setUploadedFiles((prev) => [...prev, data.file]);
          setUploadProgress((prev) =>
            prev.map((p) =>
              p.fileName === file.name
                ? { ...p, progress: 100, status: "success" }
                : p
            )
          );
          toast.success(`Successfully uploaded ${file.name}`);
        } else {
          throw new Error(data.error || "Upload failed");
        }
      } catch (err) {
        console.error("Upload error:", err);
        setUploadProgress((prev) =>
          prev.map((p) =>
            p.fileName === file.name
              ? {
                  ...p,
                  status: "error",
                  error: err instanceof Error ? err.message : "Upload failed",
                }
              : p
          )
        );
        toast.error(`Failed to upload ${file.name}`);
      }
    });
  };

  const verifyWalletOwnership = async () => {
    if (!user?.wallet) {
      toast.error("No wallet connected");
      return false;
    }

    try {
      setIsWalletVerified(true);
      return true;
    } catch (err) {
      console.error("Verification error:", err);
      toast.error("Failed to verify wallet ownership");
      return false;
    }
  };

  const removeFile = (fileUrl: string) => {
    setUploadedFiles((prev) => prev.filter((file) => file.url !== fileUrl));
    toast.success("File removed");
  };

  const handleSubmit = async () => {
    if (currentStep !== 2) {
      // Validate current step before proceeding
      if (currentStep === 0 && !selectedBounty) {
        toast.error("Please select a bounty program");
        return;
      }
      if (currentStep === 1) {
        if (!title.trim()) {
          toast.error("Please enter a title");
          return;
        }
        if (!description.trim()) {
          toast.error("Please enter a description");
          return;
        }
        if (
          bountyDetails?.misUseRange &&
          bountyDetails.misUseRange.length > 0 &&
          !selectedMisUse
        ) {
          toast.error("Please select a category");
          return;
        }
      }
      setCurrentStep((prev) => prev + 1);
      return;
    }

    if (!authenticated) {
      toast.error("Please connect your wallet first");
      login();
      return;
    }

    // Verify wallet ownership before submission
    const isVerified = await verifyWalletOwnership();
    if (!isVerified) {
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/submissions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          programName: selectedBounty,
          title,
          description,
          severityLevel,
          files: uploadedFiles.map((file) => file.url),
          walletAddress,
          verified: isWalletVerified,
          ...(selectedMisUse && { misUseCategory: selectedMisUse }),
        }),
      });

      if (!response.ok) {
        throw new Error("Submission failed");
      }

      router.push("dashboard");
      // Reset form
      setSelectedBounty("");
      setTitle("");
      setDescription("");
      setSeverityLevel("medium");
      setUploadedFiles([]);
      setCurrentStep(0);
      setIsWalletVerified(false);
      toast.success("Report submitted successfully!");
    } catch (err) {
      console.error("Submission error:", err);
      toast.error("Failed to submit report");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderFileUploadSection = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-lg font-medium text-white">
          Upload Files ({uploadedFiles.length}/{MAX_FILES})
        </label>
        <span className="text-sm text-gray-400">
          Max {MAX_FILES} files, {MAX_FILE_SIZE / (1024 * 1024)}MB each
        </span>
      </div>

      {/* File Input */}
      <div className="relative">
        <input
          type="file"
          onChange={handleFileUpload}
          multiple
          accept={ALLOWED_FILE_TYPES.join(",")}
          className="hidden"
          id="file-upload"
          disabled={uploadedFiles.length >= MAX_FILES}
        />
        <label
          htmlFor="file-upload"
          className={`flex items-center justify-center w-full h-32 px-4 transition bg-gray-800 border-2 border-gray-600 border-dashed rounded-lg appearance-none cursor-pointer hover:border-gray-500 focus:outline-none ${
            uploadedFiles.length >= MAX_FILES
              ? "opacity-50 cursor-not-allowed"
              : ""
          }`}
        >
          <div className="flex flex-col items-center space-y-2">
            <Upload className="w-8 h-8 text-gray-400" />
            <span className="text-sm text-gray-400">
              {uploadedFiles.length >= MAX_FILES
                ? "Maximum files reached"
                : "Drop files here or click to upload"}
            </span>
          </div>
        </label>
      </div>

      {/* Upload Progress */}
      {uploadProgress.length > 0 && (
        <div className="space-y-2">
          {uploadProgress.map((progress, index) => (
            <div key={index} className="bg-gray-800 rounded-lg p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-white truncate">
                  {progress.fileName}
                </span>
                <div className="flex items-center space-x-2">
                  {progress.status === "uploading" && (
                    <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
                  )}
                  {progress.status === "success" && (
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                  )}
                  {progress.status === "error" && (
                    <AlertCircle className="w-4 h-4 text-red-500" />
                  )}
                </div>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-1.5">
                <div
                  className={`h-1.5 rounded-full ${
                    progress.status === "error" ? "bg-red-500" : "bg-blue-500"
                  }`}
                  style={{ width: `${progress.progress}%` }}
                />
              </div>
              {progress.error && (
                <p className="text-xs text-red-500 mt-1">{progress.error}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Uploaded Files List */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          {uploadedFiles.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between bg-gray-800 rounded-lg p-3"
            >
              <div className="flex items-center space-x-3">
                <Image
                  src="/file.svg"
                  alt="File icon"
                  width={24}
                  height={24}
                  className="text-gray-400"
                />
                <div>
                  <p className="text-sm text-white truncate">
                    {file.originalName}
                  </p>
                  <p className="text-xs text-gray-400">
                    {(file.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              </div>
              <button
                onClick={() => removeFile(file.url)}
                className="p-1 hover:bg-gray-700 rounded-full transition-colors"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-lg font-medium text-white mb-2">
                Select a Bounty Program
              </label>
              <select
                value={selectedBounty}
                onChange={(e) => setSelectedBounty(e.target.value)}
                className="w-full p-3 bg-gray-800 text-white border border-gray-600 rounded-lg"
              >
                <option value="">-- Choose a program --</option>
                {bounties.map((bounty) => (
                  <option key={bounty.networkName} value={bounty.networkName}>
                    {bounty.networkName}
                  </option>
                ))}
              </select>
            </div>

            {isLoadingBountyDetails && (
              <div className="flex justify-center p-4">
                <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
              </div>
            )}

            {selectedBounty &&
              bounties.find((b) => b.networkName === selectedBounty)
                ?.logoUrl && (
                <div className="mt-4 p-4 bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12">
                      <Image
                        src={
                          bounties.find((b) => b.networkName === selectedBounty)
                            ?.logoUrl || ""
                        }
                        alt={selectedBounty}
                        fill
                        className="object-contain rounded-full"
                      />
                    </div>
                    <span className="text-lg text-white">{selectedBounty}</span>
                  </div>
                </div>
              )}
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-lg font-medium text-white mb-2">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={100}
                className="w-full p-3 bg-gray-800 text-white border border-gray-600 rounded-lg"
                placeholder="Enter report title"
              />
              <p className="mt-1 text-sm text-gray-400">
                {title.length}/100 characters
              </p>
            </div>

            <div>
              <label className="block text-lg font-medium text-white mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={6}
                maxLength={2500}
                className="w-full p-3 bg-gray-800 text-white border border-gray-600 rounded-lg"
                placeholder="Describe the vulnerability in detail"
              />
              <p className="mt-1 text-sm text-gray-400">
                {description.split(/\s+/).filter(Boolean).length}/500 words
              </p>
            </div>

            {bountyDetails?.misUseRange &&
              bountyDetails.misUseRange.length > 0 && (
                <div>
                  <label className="block text-lg font-medium text-white mb-2">
                    Category
                  </label>
                  <select
                    value={selectedMisUse}
                    onChange={(e) => setSelectedMisUse(e.target.value)}
                    className="w-full p-3 bg-gray-800 text-white border border-gray-600 rounded-lg"
                  >
                    <option value="">-- Select a Misuse Range --</option>
                    {bountyDetails.misUseRange.map((category, index) => (
                      <option key={index} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              )}

            <div>
              <label className="block text-lg font-medium text-white mb-2">
                Severity Level
              </label>
              <select
                value={severityLevel}
                onChange={(e) =>
                  setSeverityLevel(e.target.value as SeverityLevel)
                }
                className="w-full p-3 bg-gray-800 text-white border border-gray-600 rounded-lg"
              >
                {/* Show options based on initialSeverities if available, otherwise show default options */}
                {bountyDetails?.initialSeverities &&
                bountyDetails.initialSeverities.length > 0 ? (
                  bountyDetails.initialSeverities.map((severity, index) => (
                    <option key={index} value={severity.toLowerCase()}>
                      {severity}
                    </option>
                  ))
                ) : (
                  <>
                    <option value="critical">Critical</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </>
                )}
              </select>
            </div>

            {renderFileUploadSection()}
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-lg font-medium text-white mb-2">
                Wallet Address
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  className="w-full p-3 bg-gray-800 text-white border border-gray-600 rounded-lg"
                  readOnly
                />
                {!authenticated && (
                  <button
                    type="button"
                    onClick={() => login()}
                    className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Connect
                  </button>
                )}
              </div>
              {authenticated && (
                <p className="mt-1 text-sm text-green-500 flex items-center">
                  <CheckCircle2 className="w-4 h-4 mr-1" />
                  Wallet connected and verified
                </p>
              )}
            </div>

            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="text-lg font-medium text-white mb-4">
                Submission Summary
              </h3>
              <dl className="space-y-3">
                <div>
                  <dt className="text-sm text-gray-400">Program</dt>
                  <dd className="text-white">{selectedBounty}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-400">Title</dt>
                  <dd className="text-white">{title}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-400">Severity</dt>
                  <dd className="text-white capitalize">{severityLevel}</dd>
                </div>
                {selectedMisUse && (
                  <div>
                    <dt className="text-sm text-gray-400">Category</dt>
                    <dd className="text-white">{selectedMisUse}</dd>
                  </div>
                )}
                <div>
                  <dt className="text-sm text-gray-400">Files</dt>
                  <dd className="text-white">
                    {uploadedFiles.length} attached
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={index} className="flex items-center">
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                      index <= currentStep
                        ? "border-blue-500 text-blue-500"
                        : "border-gray-600 text-gray-600"
                    }`}
                  >
                    {index + 1}
                  </div>
                  <span
                    className={`ml-2 text-sm ${
                      index <= currentStep ? "text-white" : "text-gray-600"
                    }`}
                  >
                    {step}
                  </span>
                  {index < steps.length - 1 && (
                    <div
                      className={`w-16 h-px mx-4 ${
                        index < currentStep ? "bg-blue-500" : "bg-gray-600"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
            >
              {renderStep()}

              {error && (
                <div className="mt-4 p-3 bg-red-900/50 border border-red-500/50 rounded-lg text-red-500">
                  {error}
                </div>
              )}

              <div className="mt-8 flex justify-between">
                {currentStep > 0 && (
                  <button
                    type="button"
                    onClick={() => setCurrentStep((prev) => prev - 1)}
                    className="px-6 py-2 text-white bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Back
                  </button>
                )}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="ml-auto px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="flex items-center space-x-2">
                      <Loader2 className="animate-spin" />
                      <span>Submitting...</span>
                    </div>
                  ) : currentStep === steps.length - 1 ? (
                    "Submit Report"
                  ) : (
                    "Next"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
