import toast from "react-hot-toast";
import { InfoIcon, CircleAlert, Ban, CheckCheck, X } from "lucide-react";
import { useEffect, useState } from "react";
import { ToastType, ToastConfig } from "@/types/toastConfig";

const toastConfig: Record<ToastType, ToastConfig> = {
  success: {
    text: "Operation Successful!",
    icon: <CheckCheck className="w-5 h-5 text-[#075540]" />,
    borderColor: "#000108",
    textColor: "#075540",
    bgColor: "#E6F4EA",
  },
  error: {
    text: "Something went wrong!",
    icon: <Ban className="w-5 h-5 text-[#AC350D]" />,
    borderColor: "#000108",
    textColor: "#AC350D",
    bgColor: "#FEE2E2",
  },
  warning: {
    text: "Warning created!",
    icon: <CircleAlert className="w-5 h-5 text-[#EAB308]" />,
    borderColor: "#000108",
    textColor: "#EAB308",
    bgColor: "#FEF9C3",
  },
  information: {
    text: "Information arrived!",
    icon: <InfoIcon className="w-5 h-5 text-[#2E022E]" />,
    borderColor: "#000108",
    textColor: "#2E022E",
    bgColor: "#F3E8FF",
  },
};

// Progress bar component
const ProgressBar = ({ duration }: { duration: number }) => {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => (prev > 0 ? prev - 2 : 0));
    }, duration / 50);

    return () => clearInterval(interval);
  }, [duration]);

  return (
    <div className="h-1 w-full bg-[#99168E] rounded-b-lg overflow-hidden">
      <div
        className="h-full bg-[#FAFCA3] transition-all"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

export const showCustomToast = (type: ToastType, message?: string) => {
  const { text, icon, borderColor, textColor, bgColor } = toastConfig[type];
  const duration = 2000;

  toast.custom(
    (t) => (
      <div
        className="flex flex-col shadow-lg rounded-lg p-3 text-sm md:text-base"
        style={{
          border: `1px solid ${borderColor}`,
          backgroundColor: bgColor,
          color: textColor,
          minWidth: "250px",
          maxWidth: "90vw", // Ensures responsiveness on smaller screens
        }}
      >
        <div className="flex items-center p-2 gap-2 flex-wrap">
          {icon}
          <span className="flex-1 truncate">{message || text}</span>
          {/* Close Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toast.dismiss(t.id);
            }}
            className="p-1 rounded hover:bg-[#99168E] hover:text-white transition"
            aria-label="Close toast"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <ProgressBar duration={duration} />
      </div>
    ),
    { duration }
  );
};
