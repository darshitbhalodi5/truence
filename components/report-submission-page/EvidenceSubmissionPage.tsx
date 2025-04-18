"use client";

import { Navbar } from "@/components/navbar/Navbar";
import { DisplayBounty } from "@/types/displayBounty";
import { useState, useEffect, useCallback } from "react";
import { getCurrency } from "@/utils/networkCurrency";
import Image from "next/image";
import {
  Loader2,
  X,
  Upload,
  AlertCircle,
  CheckCircle2,
  File,
} from "lucide-react";
import { showCustomToast } from "@/components/custom-toast/CustomToast";
import { usePrivy } from "@privy-io/react-auth";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import {
  UploadedFile,
  FileUploadProgress,
  BountyDetails,
  SeverityLevel,
} from "@/types/evidenceSubmissionTypes";
import {
  MAX_FILES,
  ALLOWED_FILE_TYPES,
  MAX_FILE_SIZE,
} from "@/utils/fileConfig";

const steps = ["Select Program", "Report Details", "Wallet Info"];

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
        showCustomToast("error", "Failed to fetch program list");
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
      showCustomToast("error", "Failes to fetch program parameters");
    } finally {
      setIsLoadingBountyDetails(false);
    }
  };

  useEffect(() => {
    if (bounty) {
      setSelectedBounty(bounty);
    }
  }, [bounty]);

  useEffect(() => {
    if (selectedBounty) {
      fetchBountyDetails(selectedBounty);
    }
  }, [selectedBounty]);

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
      showCustomToast("error", `Maximum ${MAX_FILES} files allowed`);
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
      invalidFiles.forEach((error) => showCustomToast("error", `${error}`));
    }

    // Upload valid files
    for (const file of validFiles) {
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
        // Ensure the file is properly appended with the correct filename
        formData.append("file", file, file.name);

        // Log the form data for debugging
        console.log(
          `Uploading file: ${file.name}, size: ${file.size}, type: ${file.type}`
        );

        const response = await fetch("/api/upload", {
          method: "POST",
          // Don't set Content-Type header, let the browser set it with the boundary
          body: formData,
        });

        // Log response status for debugging
        console.log(`Upload response status: ${response.status}`);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error("Upload error response:", errorData);
          throw new Error(errorData.details || `Failed to upload ${file.name}`);
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
          showCustomToast("success", `Successfully uploaded ${file.name}`);
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
        showCustomToast("error", `Failed to upload ${file.name}`);
      }
    }
  };

  const verifyWalletOwnership = async () => {
    if (!user?.wallet) {
      showCustomToast(
        "error",
        "Please connect your wallet to verify ownership"
      );
      return false;
    }

    try {
      setIsWalletVerified(true);
      return true;
    } catch (err) {
      console.error("Verification error:", err);
      showCustomToast("error", "Failed to verify wallet ownership");
      return false;
    }
  };

  const removeFile = (fileUrl: string) => {
    setUploadedFiles((prev) => prev.filter((file) => file.url !== fileUrl));

    const removedFileName = uploadedFiles.find(
      (file) => file.url === fileUrl
    )?.originalName;
    if (removedFileName) {
      setUploadProgress((prev) =>
        prev.filter((p) => p.fileName !== removedFileName)
      );
    }
  };

  const handleSubmit = async () => {
    if (currentStep !== 2) {
      // Validate current step before proceeding
      if (currentStep === 0 && !selectedBounty) {
        showCustomToast("error", "Please select a program for submission");
        return;
      }
      if (currentStep === 1) {
        if (!title.trim()) {
          showCustomToast("error", "Please enter a title for submission");
          return;
        }
        if (!description.trim()) {
          showCustomToast("error", "Please enter a description for submission");
          return;
        }
        if (
          bountyDetails?.misUseRange &&
          bountyDetails.misUseRange.length > 0 &&
          !selectedMisUse
        ) {
          showCustomToast("error", "Please select a misuse range");
          return;
        }
      }
      setCurrentStep((prev) => prev + 1);
      return;
    }

    if (!authenticated) {
      showCustomToast("error", "Please connect your wallet first");
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
          misUseCategory: selectedMisUse,
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
    } catch (err) {
      console.error("Submission error:", err);
      showCustomToast(
        "error",
        "Failed to submit your efforts. Please try again!"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderFileUploadSection = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-lg font-medium text-[#FAFCA3]">
          Upload Files ({uploadedFiles.length}/{MAX_FILES})
        </label>
        <span className="text-sm text-white/80">
          Max {MAX_FILES} files, Total upload size 4 MB
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
          className={`flex items-center justify-center w-full h-32 px-4 transition bg-[#000108] border-2 border-white/40 border-dashed rounded-lg appearance-none cursor-pointer hover:border-white/60 focus:outline-none ${
            uploadedFiles.length >= MAX_FILES
              ? "opacity-50 cursor-not-allowed"
              : ""
          }`}
        >
          <div className="flex flex-col items-center space-y-2">
            <Upload className="w-8 h-8 text-[#99168E]" />
            <span className="text-sm text-white/80">
              {uploadedFiles.length >= MAX_FILES ? (
                "Maximum files reached"
              ) : (
                <div className="text-center">
                  <span> Click here to upload</span>
                  <div>Supported File Types: .jpeg, .png, .pdf, .txt</div>
                </div>
              )}
            </span>
          </div>
        </label>
      </div>

      {/* Upload Progress */}
      {uploadProgress.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-white/80">Upload Status</h4>
          {uploadProgress.map((progress, index) => (
            <div
              key={index}
              className="bg-[#000108] border-[#FAFCA3] border-b-2 rounded-b-none rounded-lg p-3"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-white/80 truncate">
                  {progress.fileName}
                </span>
                <div className="flex items-center space-x-2">
                  {progress.status === "uploading" && (
                    <Loader2 className="w-4 h-4 text-[#99168E] animate-spin" />
                  )}
                  {progress.status === "success" && (
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                  )}
                  {progress.status === "error" && (
                    <AlertCircle className="w-4 h-4 text-red-500" />
                  )}
                </div>
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
          <h4 className="text-sm font-medium text-white/80">Uploaded Files</h4>
          {uploadedFiles.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between bg-[#000625] rounded-lg p-3"
            >
              <div className="flex items-center space-x-3">
                <File size={24} className="text-[#FAFCA3]" />
                <div>
                  <p className="text-sm text-white/80 truncate">
                    {file.originalName}
                  </p>
                  <p className="text-xs text-white/80">
                    {(file.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              </div>
              <button
                onClick={() => removeFile(file.url)}
                className="p-1 hover:bg-[#99168E] rounded-full transition-colors"
              >
                <X className="w-4 h-4 text-[#FAFCA3]" />
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
              <label className="block text-lg font-medium text-[#FAFCA3] mb-2">
                Select a Program
              </label>
              <div className="relative">
                <select
                  value={selectedBounty}
                  onChange={(e) => setSelectedBounty(e.target.value)}
                  className="appearance-none w-full p-3 bg-[#000108] text-white/80 border border-[#99168E] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#99168E] focus:border-[#99168E] transition-all duration-200 pl-4 pr-10"
                >
                  <option value="" disabled>
                    -- Choose a program --
                  </option>
                  {bounties.map((bounty) => (
                    <option key={bounty.networkName} value={bounty.networkName}>
                      {bounty.networkName}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[#FAFCA3]">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    ></path>
                  </svg>
                </div>
              </div>
            </div>

            {isLoadingBountyDetails && (
              <div className="flex justify-center p-4">
                <Loader2 className="w-6 h-6 text-[#99168E] animate-spin" />
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
                    <span className="text-lg text-white/80">
                      {selectedBounty}
                    </span>
                  </div>
                </div>
              )}
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-lg font-medium text-[#FAFCA3] mb-2">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={100}
                className="w-full p-3 bg-[#000108] text-white/80 border border-white/60 rounded-lg"
                placeholder="Enter suitable title"
              />
              <p className="mt-1 text-sm text-[#DBDBDB]">
                {title.length}/100 characters
              </p>
            </div>

            <div>
              <label className="block text-lg font-medium text-[#FAFCA3] mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={6}
                maxLength={2500}
                className="w-full p-3 bg-[#000108] text-white/80 border border-white/60 rounded-lg"
                placeholder="Describe your submission purpose in detail"
              />
              <p className="mt-1 text-sm text-[#DBDBDB]">
                {description.split(/\s+/).filter(Boolean).length}/500 words
              </p>
            </div>

            {bountyDetails?.misUseRange &&
              bountyDetails.misUseRange.length > 0 && (
                <div>
                  <label className="block text-lg font-medium text-[#FAFCA3] mb-2">
                    Estimated Misuse Amount Range (In{" "}
                    {getCurrency(bountyDetails.networkName)})
                  </label>
                  <div className="relative">
                    <select
                      value={selectedMisUse}
                      onChange={(e) => setSelectedMisUse(e.target.value)}
                      className="appearance-none w-full p-3 bg-[#000108] text-white/80 border border-[#99168E] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#99168E] focus:border-[#99168E] transition-all duration-200 pl-4 pr-10"
                    >
                      <option value="" disabled>
                        -- Select a Misuse Range --
                      </option>
                      {bountyDetails.misUseRange.map((category, index) => (
                        <option key={index} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[#FAFCA3]">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        ></path>
                      </svg>
                    </div>
                  </div>
                </div>
              )}

            <div>
              <label className="block text-lg font-medium text-[#FAFCA3] mb-2">
                Severity Level
              </label>
              <div className="relative">
                <select
                  value={severityLevel}
                  onChange={(e) =>
                    setSeverityLevel(e.target.value as SeverityLevel)
                  }
                  className="appearance-none w-full p-3 bg-[#000108] text-white/80 border border-[#99168E] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#99168E] focus:border-[#99168E] transition-all duration-200 pl-4 pr-10"
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
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[#FAFCA3]">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    ></path>
                  </svg>
                </div>
              </div>
            </div>

            {renderFileUploadSection()}
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            {authenticated ? (
              <>
                <div>
                  <label className="block text-lg font-medium text-[#FAFCA3] mb-2">
                    Wallet Address
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={walletAddress}
                      onChange={(e) => setWalletAddress(e.target.value)}
                      className="w-full p-3 bg-[#000108] text-white/80 border border-white/60 rounded-lg"
                      readOnly
                    />
                  </div>
                  <p className="mt-1 text-sm text-green-500 flex items-center">
                    <CheckCircle2 className="w-4 h-4 mr-1" />
                    Wallet connected and verified
                  </p>
                </div>
                <div className="bg-[#000625] rounded-lg p-4">
                  <h3 className="text-lg font-medium text-[#FAFCA3] mb-4">
                    Submission Summary
                  </h3>
                  <dl className="space-y-3">
                    <div>
                      <dt className="text-sm text-white/60">Program</dt>
                      <dd className="text-white/90">{selectedBounty}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-white/60">Title</dt>
                      <dd className="text-white/90">{title}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-white/60">Severity</dt>
                      <dd className="text-white/90 capitalize">
                        {severityLevel}
                      </dd>
                    </div>
                    {selectedMisUse && (
                      <div>
                        <dt className="text-sm text-white/60">Misuse Range</dt>
                        <dd className="text-white/90">
                          {selectedMisUse}{" "}
                          {getCurrency(bountyDetails!.networkName)}
                        </dd>
                      </div>
                    )}
                    <div>
                      <dt className="text-sm text-white/60">Files</dt>
                      <dd className="text-white/90">
                        {uploadedFiles.length} attached
                      </dd>
                    </div>
                  </dl>
                </div>
              </>
            ) : (
              <div className="bg-[#000625] rounded-lg p-4">
                <h3 className="text-lg font-medium text-[#FAFCA3] mb-4">
                  Submission Summary
                </h3>
                <dl className="space-y-3">
                  <div>
                    <dt className="text-sm text-white/60">Program</dt>
                    <dd className="text-white/90">{selectedBounty}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-white/60">Title</dt>
                    <dd className="text-white/90">{title}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-white/60">Severity</dt>
                    <dd className="text-white/90 capitalize">
                      {severityLevel}
                    </dd>
                  </div>
                  {selectedMisUse && (
                    <div>
                      <dt className="text-sm text-white/60">Category</dt>
                      <dd className="text-white/90">{selectedMisUse}</dd>
                    </div>
                  )}
                  <div>
                    <dt className="text-sm text-white/60">Files</dt>
                    <dd className="text-white/90">
                      {uploadedFiles.length} attached
                    </dd>
                  </div>
                </dl>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#000108]">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Progress Steps */}
          <div className="mb-8 overflow-x-auto">
            <div className="flex items-center justify-between min-w-max px-2">
              {steps.map((step, index) => (
                <div key={index} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                        index <= currentStep
                          ? "border-[#99168E] text-[#99168E]"
                          : "border-white/50 text-white/50"
                      }`}
                    >
                      {index + 1}
                    </div>
                    <span
                      className={`mt-1 text-xs text-center sm:hidden ${
                        index <= currentStep ? "text-white" : "text-white/50"
                      }`}
                    >
                      {step}
                    </span>
                    <span
                      className={`mt-2 ml-2 text-sm hidden sm:inline ${
                        index <= currentStep ? "text-white" : "text-white/50"
                      }`}
                    >
                      {step}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`w-6 sm:w-16 h-px mx-2 sm:mx-4 hidden sm:block ${
                        index < currentStep ? "bg-[#99168E]" : "bg-white/50"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <div className="bg-[#3A6EA5]/10 rounded-lg p-4 sm:p-6 border border-gray-800">
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
                    className="px-4 sm:px-6 py-2 text-white bg-gray-800 rounded-lg"
                  >
                    Back
                  </button>
                )}
                {currentStep === steps.length - 1 ? (
                  authenticated ? (
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="ml-auto px-4 sm:px-6 py-2 text-white bg-gradient-to-r from from-[#990F62] via-[#99168E] to-[#991DB5] rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center space-x-2">
                          <Loader2 className="animate-spin" />
                          <span>Submitting...</span>
                        </div>
                      ) : (
                        "Submit Evidence"
                      )}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => login()}
                      className="ml-auto px-4 sm:px-6 py-2 text-white bg-gradient-to-r from from-[#990F62] via-[#99168E] to-[#991DB5] rounded-lg"
                    >
                      Connect
                    </button>
                  )
                ) : (
                  <button
                    type="submit"
                    className="ml-auto px-4 sm:px-6 py-2 text-white bg-gradient-to-r from from-[#990F62] via-[#99168E] to-[#991DB5] rounded-lg"
                  >
                    Next
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
