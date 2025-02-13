// app/submit/page.tsx
"use client";

import { Navbar } from "@/components/navbar/Navbar";
import { DisplayBounty } from "@/types/displayBounty";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Loader2 } from "lucide-react";

type SeverityLevel = 'critical' | 'high' | 'medium' | 'low';

interface UploadedFile {
  url: string;
  filename: string;
  size: number;
  type: string;
}

const steps = ["Select Program", "Report Details", "Wallet Info"];

export default function SubmissionPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [bounties, setBounties] = useState<DisplayBounty[]>([]);
  const [selectedBounty, setSelectedBounty] = useState<string>("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [severityLevel, setSeverityLevel] = useState<SeverityLevel>("medium");
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [walletAddress, setWalletAddress] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBounties = async () => {
      try {
        const response = await fetch("/api/submitter-form-selection");
        if (!response.ok) throw new Error("Failed to fetch bounties");
        const data = await response.json();
        setBounties(data);
      } catch (err) {
        console.error("Error fetching bounties:", err);
        setError("Failed to load bounties");
      }
    };

    fetchBounties();
    setWalletAddress("0x123...789"); // Replace with actual wallet connection
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    if (uploadedFiles.length + files.length > 5) {
      setError("Maximum 5 files allowed");
      return;
    }

    setIsUploading(true);
    setError("");

    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`Failed to upload ${file.name}`);
        }

        return await response.json();
      });

      const newFiles = await Promise.all(uploadPromises);
      setUploadedFiles([...uploadedFiles, ...newFiles]);
    } catch (err) {
      setError("Failed to upload files");
      console.error("Upload error:", err);
    } finally {
      setIsUploading(false);
    }
  };

  const removeFile = (fileUrl: string) => {
    setUploadedFiles(uploadedFiles.filter(file => file.url !== fileUrl));
  };

  const handleSubmit = async () => {
    if (currentStep !== 2) {
      // Validate current step before proceeding
      if (currentStep === 0 && !selectedBounty) {
        setError("Please select a bounty program");
        return;
      }
      if (currentStep === 1) {
        if (!title.trim()) {
          setError("Please enter a title");
          return;
        }
        if (!description.trim()) {
          setError("Please enter a description");
          return;
        }
      }
      setCurrentStep(prev => prev + 1);
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
          files: uploadedFiles.map(file => file.url),
          walletAddress,
        }),
      });

      if (!response.ok) {
        throw new Error("Submission failed");
      }

      // Reset form
      setSelectedBounty("");
      setTitle("");
      setDescription("");
      setSeverityLevel("medium");
      setUploadedFiles([]);
      setCurrentStep(0);
      alert("Report submitted successfully!");
    } catch (err) {
      setError("Failed to submit report");
      console.error("Submission error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

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

            {selectedBounty && bounties.find(b => b.networkName === selectedBounty)?.logoUrl && (
              <div className="mt-4 p-4 bg-gray-800 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12">
                    <Image
                      src={bounties.find(b => b.networkName === selectedBounty)?.logoUrl || ''}
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

            <div>
              <label className="block text-lg font-medium text-white mb-2">
                Severity Level
              </label>
              <select
                value={severityLevel}
                onChange={(e) => setSeverityLevel(e.target.value as SeverityLevel)}
                className="w-full p-3 bg-gray-800 text-white border border-gray-600 rounded-lg"
              >
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            <div>
              <label className="block text-lg font-medium text-white mb-2">
                Upload Files
              </label>
              <input
                type="file"
                onChange={handleFileUpload}
                multiple
                disabled={isUploading}
                className="w-full p-3 bg-gray-800 text-white border border-gray-600 rounded-lg"
              />
              <p className="mt-1 text-sm text-gray-400">
                {uploadedFiles.length}/5 files uploaded
              </p>

              {uploadedFiles.length > 0 && (
                <div className="mt-4 space-y-2">
                  {uploadedFiles.map((file) => (
                    <div
                      key={file.url}
                      className="flex items-center justify-between p-2 bg-gray-700 rounded"
                    >
                      <span className="text-sm text-white">{file.filename}</span>
                      <button
                        onClick={() => removeFile(file.url)}
                        className="text-red-400 hover:text-red-300"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-lg font-medium text-white mb-2">
                Connected Wallet
              </label>
              <input
                type="text"
                value={walletAddress}
                disabled
                className="w-full p-3 bg-gray-800 text-white border border-gray-600 rounded-lg"
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-white">Review Your Submission</h3>
              <div className="p-4 bg-gray-800 rounded-lg space-y-3">
                <p><span className="text-gray-400">Program:</span> {selectedBounty}</p>
                <p><span className="text-gray-400">Title:</span> {title}</p>
                <p><span className="text-gray-400">Severity:</span> {severityLevel}</p>
                <p><span className="text-gray-400">Files:</span> {uploadedFiles.length} attached</p>
              </div>
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
        {/* Progress bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="flex justify-between mb-2">
            {steps.map((step, index) => (
              <span
                key={step}
                className={`text-sm ${
                  index <= currentStep ? "text-blue-500" : "text-gray-500"
                }`}
              >
                {step}
              </span>
            ))}
          </div>
          <div className="h-2 bg-gray-700 rounded-full">
            <div
              className="h-full bg-blue-500 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Form */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-gray-800 rounded-lg p-6">
            {renderStep()}

            {/* Navigation buttons */}
            <div className="mt-8 flex justify-between">
              <button
                onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
                disabled={currentStep === 0 || isSubmitting}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50"
              >
                Previous
              </button>

              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : currentStep === 2 ? (
                  "Submit Report"
                ) : (
                  "Next"
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-500 bg-opacity-10 border border-red-500 rounded-lg text-red-500">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}