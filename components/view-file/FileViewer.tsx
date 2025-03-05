// components/file-viewer-modal/FileViewerModal.tsx
import { X } from "lucide-react";

interface FileViewerModalProps {
  isOpen: boolean;
  file: {
    url: string;
    name: string;
    contentType: string;
  } | null;
  onClose: () => void;
}

export function FileViewer({ isOpen, file, onClose }: FileViewerModalProps) {
  if (!isOpen || !file) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-2 sm:p-4 z-50 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#00041B] rounded-xl p-3 sm:p-6 max-w-2xl w-full max-h-[90vh] border border-[#99168E] shadow-xl my-4">
        <div className="flex items-center justify-between p-4 border-b border-[#99168E]">
          <h3 className="text-lg font-medium text-white/80 truncate">
            {file.name}
          </h3>
          <button
            onClick={onClose}
            className="hover:bg-[#99168E] p-1 rounded-xl transition-colors"
          >
            <X className="w-6 h-6 text-[#FAFCA3]" />
          </button>
        </div>
        <div className="flex-1 overflow-auto p-4">
          {file.contentType.startsWith("image/") ? (
            <img
              src={file.url}
              alt={file.name}
              className="max-w-full h-auto mx-auto"
            />
          ) : file.contentType === "application/pdf" ? (
            <iframe
              src={file.url}
              className="w-full h-full min-h-[700px] rounded border border-[#FAFCA3] bg-[#99168E]"
              title={file.name}
            />
          ) : file.contentType === "text/plain" ||
            file.contentType === "text/markdown" ? (
            <iframe
              src={file.url}
              className="w-full h-full min-h-[700px] rounded border border-[#FAFCA3] bg-[#99168E]"
              title={file.name}
            />
          ) : (
            <div className="bg-gray-900 p-4 rounded">
              <p className="text-gray-300">
                This file type ({file.contentType}) cannot be previewed
                directly.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
