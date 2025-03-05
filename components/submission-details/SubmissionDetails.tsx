import { X, ChevronRight, Eye } from "lucide-react";
import { ReviewSubmission } from "@/types/reviewerData";
import { getCurrency } from "@/utils/networkCurrency";

interface SubmissionDetailsProps {
  submission: ReviewSubmission;
  fileMetadata: Record<
    string,
    { originalName?: string; filename: string; contentType: string }
  >;
  onClose: () => void;
  onViewFile: (fileId: string, metadata: any) => void;
}

export function SubmissionDetails({
  submission,
  fileMetadata,
  onClose,
  onViewFile,
}: SubmissionDetailsProps) {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-2 sm:p-4 z-50 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#00041B] rounded-xl p-3 sm:p-6 max-w-2xl w-full max-h-[90vh] border border-[#99168E] shadow-xl my-4">
        <div className="scroll-container overflow-y-auto max-h-[600px] scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-700 scrollbar-thumb-rounded-lg">
          <div className="flex flex-wrap justify-between gap-4 bg-[#00041B] p-4 rounded-lg sticky top-0 z-10">
            <h3 className="text-xl sm:text-2xl font-semibold text-[#FAFCA3] mb-1 mt-1 animate-pulse">
              {submission.title}
            </h3>
            <button
              onClick={onClose}
              className="hover:bg-[#99168E] p-1 rounded-xl transition-colors"
            >
              <X className="w-6 h-6 text-[#FAFCA3]" />
            </button>
          </div>

          <div className="flex flex-wrap gap-2 sm:gap-4 bg-[#00041B] p-2 sm:p-4 rounded-lg">
            <h4 className="text-sm font-medium text-white/80 mb-1">
              Description:
            </h4>
            <div className="flex items-center space-x-2">
              {submission.description}
            </div>
          </div>

          <div className="flex flex-wrap gap-2 sm:gap-4 bg-[#00041B] p-2 sm:p-4 rounded-lg">
            <h4 className="text-sm font-medium text-white/80 mb-1">
              Status :{" "}
            </h4>
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium inline-flex items-center
                    ${
                      submission.status === "pending"
                        ? "bg-yellow-500/10 text-yellow-500"
                        : submission.status === "reviewing"
                        ? "bg-blue-500/10 text-blue-500"
                        : submission.status === "accepted"
                        ? "bg-green-500/10 text-green-500"
                        : "bg-red-500/10 text-red-500"
                    }`}
            >
              {submission.status.charAt(0).toUpperCase() +
                submission.status.slice(1)}
            </span>
          </div>

          <div className="flex flex-wrap gap-2 sm:gap-4 bg-[#00041B] p-2 sm:p-4 rounded-lg">
            <h4 className="text-sm font-medium text-white/80 mb-1">
              Severity :
            </h4>
            <div className="flex items-center space-x-2">
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium
                      ${
                        submission.severityLevel === "critical"
                          ? "bg-red-500/10 text-red-500"
                          : submission.severityLevel === "high"
                          ? "bg-orange-500/10 text-orange-500"
                          : submission.severityLevel === "medium"
                          ? "bg-yellow-500/10 text-yellow-500"
                          : "bg-blue-500/10 text-blue-500"
                      }`}
              >
                {submission.severityLevel.toUpperCase()}
              </span>
              {submission.reviewerSeverity &&
                submission.reviewerSeverity.toLowerCase() !==
                  submission.severityLevel.toLowerCase() && (
                  <div className="flex items-center space-x-2">
                    <ChevronRight className="h-4 w-4 text-[#FAFCA3]" />
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium
        ${
          submission.reviewerSeverity.toLowerCase() === "critical"
            ? "bg-red-500/10 text-red-500"
            : submission.reviewerSeverity.toLowerCase() === "high"
            ? "bg-orange-500/10 text-orange-500"
            : submission.reviewerSeverity.toLowerCase() === "medium"
            ? "bg-yellow-500/10 text-yellow-500"
            : "bg-blue-500/10 text-blue-500"
        }`}
                    >
                      {submission.reviewerSeverity.toUpperCase()}
                    </span>
                  </div>
                )}
            </div>
          </div>

          <div className="flex flex-wrap gap-2 sm:gap-4 bg-[#00041B] p-2 sm:p-4 rounded-lg">
            <h4 className="text-sm font-medium text-white/80 mb-3">
              Misuse Amount :
            </h4>
            <p className="text-white/90 text-sm whitespace-pre-line text-justify">
              {submission.misUseRange
                ? `${submission.misUseRange} ${getCurrency(
                    submission.programName
                  )}`
                : "-"}
            </p>
          </div>

          {submission?.files && submission.files.length > 0 && (
            <div className="gap-2 sm:gap-4 bg-[#00041B] p-2 sm:p-4 rounded-lg">
              <h4 className="text-sm font-medium text-white/80 mb-3">
                Attachments
              </h4>
              <div className="space-y-2">
                {submission.files.map((fileId) => {
                  const metadata = fileMetadata[fileId];
                  return (
                    <div
                      key={fileId}
                      className="flex items-center justify-between bg-gray-700/50 p-3 rounded-lg hover:bg-gray-700/80 transition-colors"
                    >
                      <div className="flex-1 mr-4">
                        <div className="text-sm text-white/80 font-medium truncate">
                          {metadata
                            ? metadata.originalName || metadata.filename
                            : "Loading..."}
                        </div>
                      </div>
                      <button
                        onClick={() => onViewFile(fileId, metadata)}
                        className="px-3 py-1.5 text-sm bg-[#FAFCA3] text-white rounded-md transition-colors"
                      >
                        <Eye className="w-5 h-5 text-[#99168E]" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
