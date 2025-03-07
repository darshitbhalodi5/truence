import React from "react";

interface PaymentProgressProps {
  currentStep: number;
}

export default function PaymentProgress({ currentStep }: PaymentProgressProps) {
  const steps = [
    { id: 1, name: "KYC Verification" },
    { id: 2, name: "Payment Confirmation" },
    { id: 3, name: "Additional Payment Confirmation" },
  ];

  return (
    <div className="relative py-6">
      <div className="max-w-3xl mx-auto px-4">
        <nav aria-label="Progress">
          <ol className="flex items-center">
            {steps.map((step, stepIdx) => (
              <li
                key={step.name}
                className={`relative ${
                  stepIdx !== steps.length - 1 ? "pr-8 sm:pr-20 w-full" : ""
                }`}
              >
                <div className="flex items-center">
                  {/* Step circle */}
                  <div
                    className={`${
                      step.id <= currentStep ? "bg-[#99168E]" : "bg-gray-300"
                    } h-5 w-5 rounded-full flex items-center justify-center`}
                  >
                    {step.id < currentStep ? (
                      <svg
                        className="h-5 w-5 text-[#FAFCA3]"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      <span
                        className={`${
                          step.id === currentStep
                            ? "text-[#FAFCA3]"
                            : "text-gray-700"
                        } text-sm font-medium`}
                      >
                        {step.id}
                      </span>
                    )}
                  </div>
                </div>
                {/* Step name */}
                <div
                  className={`flex items-center mt-2 text-sm font-medium ${
                    step.id <= currentStep ? "text-[#FAFCA3]" : "text-white/80"
                  }`}
                >
                  {step.name}
                </div>
              </li>
            ))}
          </ol>
        </nav>
      </div>
    </div>
  );
}
