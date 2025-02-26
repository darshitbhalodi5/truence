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
        className={`flex flex-col shadow-lg rounded-lg`}
        style={{
          border: `1px solid ${borderColor}`,
          backgroundColor: bgColor,
          color: textColor,
          minWidth: "250px",
        }}
      >
        <div className="flex items-center p-4">
          {icon}
          <span className="ml-3">{message || text}</span>
          <div className="border-l border-[#99168E] h-6 mx-3"></div>
          {/* Close Button */}
          <button
            onClick={() => toast.dismiss(t.id)}
            className="ml-auto p-1 hover:bg-[#99168E] hover:text-white rounded"
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
