import React from "react";
import { ReviewSubmission } from "@/types/reviewerData";
import { SubmissionData } from "@/types/submissionData";
interface PaymentProgressProps {
  submission: ReviewSubmission | SubmissionData;
  isSubmitter: boolean;
  isReviewer?: boolean;
  userAddress: string;
  onVerifyKYC?: () => void;
  onConfirmPayment?: () => void;
  onAdditionalPaymentConfirm?: () => void;
}

export default function PaymentProgress({
  submission,
  isSubmitter,
  isReviewer,
  userAddress,
  onVerifyKYC,
  onConfirmPayment,
  onAdditionalPaymentConfirm,
}: PaymentProgressProps) {
  const paymentField = () => {
    if (isSubmitter) {
      return submission.additionalPaymentRequired;
    } else {
      return submission?.bountyInfo?.additionalPaymentRequired;
    }
  };

  // Calculate current step based on progress status
  const calculateCurrentStep = () => {
    const { progressStatus } = submission;

    if (!progressStatus?.kycVerified) {
      return 1;
    } else if (!progressStatus?.paymentConfirmed) {
      return 2;
    } else if (paymentField() && !progressStatus?.additionalPaymentConfirmed) {
      return 3;
    } else {
      return paymentField() ? 4 : 3;
    }
  };

  const currentStep = calculateCurrentStep();

  // Define steps with visibility and disabled conditions
  const steps = [
    {
      id: 1,
      name: "KYC Verification",
      buttonText: "Verify KYC",
      onClick: onVerifyKYC,
      visible: isSubmitter && !isReviewer, // Only submitter can verify KYC
      disabled: submission.progressStatus?.kycVerified === true,
      completed: submission.progressStatus?.kycVerified === true,
    },
    {
      id: 2,
      name: "Payment Confirmation",
      buttonText: "Confirm Payment",
      onClick: onConfirmPayment,
      visible: !isSubmitter && !isReviewer, // Only manager can confirm payment
      disabled:
        submission.progressStatus?.kycVerified !== true ||
        submission.progressStatus?.paymentConfirmed === true,
      completed: submission.progressStatus?.paymentConfirmed === true,
    },
  ];

  // Only add the third step if additionalPaymentRequired is true
  if (paymentField()) {
    steps.push({
      id: 3,
      name: "Additional Payment Confirmation",
      buttonText: "Confirm Additional Payment",
      onClick: onAdditionalPaymentConfirm,
      visible: !isSubmitter && !isReviewer, // Only manager can confirm additional payment
      disabled:
        submission.progressStatus?.paymentConfirmed !== true ||
        submission.progressStatus?.additionalPaymentConfirmed === true,
      completed: submission.progressStatus?.additionalPaymentConfirmed === true,
    });
  }

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
                      step.completed
                        ? "bg-[#99168E]"
                        : currentStep === step.id
                        ? "bg-[#99168E]"
                        : "bg-gray-300"
                    } h-5 w-5 rounded-full flex items-center justify-center`}
                  >
                    {step.completed ? (
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
                          currentStep === step.id
                            ? "text-[#FAFCA3]"
                            : "text-gray-700"
                        } text-sm font-medium`}
                      >
                        {step.id}
                      </span>
                    )}
                  </div>
                </div>

                {/* Step name and button */}
                <div className="flex flex-col mt-2">
                  <span
                    className={`text-sm font-medium ${
                      step.completed || currentStep === step.id
                        ? "text-[#FAFCA3]"
                        : "text-white/80"
                    }`}
                  >
                    {step.name}
                  </span>

                  {/* Only show button if it's visible for this user role */}
                  {step.visible && (
                    <button
                      type="button"
                      onClick={step.onClick}
                      className={`mt-2 px-3 py-1 text-xs rounded-md ${
                        step.disabled
                          ? "bg-gray-300 text-gray-700 cursor-not-allowed opacity-70"
                          : "bg-[#99168E] text-[#FAFCA3] hover:bg-[#820c78]"
                      } transition-colors duration-200`}
                      disabled={step.disabled}
                    >
                      {step.completed ? "Completed" : step.buttonText}
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </nav>
      </div>
    </div>
  );
}
