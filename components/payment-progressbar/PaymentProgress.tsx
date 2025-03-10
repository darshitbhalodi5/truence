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
      name: "Verify KYC",
      buttonText: "Verify KYC",
      onClick: onVerifyKYC,
      visible: isSubmitter && !isReviewer, // Only submitter can verify KYC
      disabled: submission.progressStatus?.kycVerified === true,
      completed: submission.progressStatus?.kycVerified === true,
    },
    {
      id: 2,
      name: "Program Reward",
      buttonText: "Confirm Payment",
      onClick: onConfirmPayment,
      visible: !isSubmitter && !isReviewer, // Only manager can confirm payment
      disabled:
        submission.progressStatus?.kycVerified !== true ||
        submission.progressStatus?.paymentConfirmed === true,
      completed:
        submission.progressStatus?.paymentConfirmed === true ||
        submission.progressStatus?.additionalPaymentConfirmed === true,
    },
  ];

  // Only add the third step if additionalPaymentRequired is true
  if (paymentField()) {
    steps.push({
      id: 3,
      name: "Extra Program Reward",
      buttonText: "Confirm Additional Payment",
      onClick: onAdditionalPaymentConfirm,
      visible: !isSubmitter && !isReviewer, // Only manager can confirm additional payment
      disabled:
        submission.progressStatus?.paymentConfirmed !== true ||
        submission.progressStatus?.additionalPaymentConfirmed === true,
      completed: submission.progressStatus?.additionalPaymentConfirmed === true,
    });
  }

  // Define a container width based on the number of steps
  // const containerWidth = steps.length === 2 ? "max-w-md" : "max-w-5xl";

  // Define a container width based on the number of steps
  const containerWidth = steps.length === 2 ? "max-w-md" : "max-w-5xl";

  // Determine if we have 2 or 3 steps
  const hasThreeSteps = steps.length === 3;

  return (
    <div className="relative py-6 px-4 sm:px-6 lg:px-8 w-full">
      <div className={`${containerWidth} mx-auto`}>
        <nav aria-label="Payment Progress" className="overflow-hidden">
          {/* connecting lines for whole progress bar */}
          <div className="relative">
            <div
              className="absolute top-4 left-0 w-full h-0.5 bg-[#99168E]/30 z-0"
              style={{ transform: "translateY(-50%)" }}
            ></div>
          </div>
          <ol
            className={`relative z-10 flex items-center ${
              hasThreeSteps ? "justify-between" : "justify-between"
            }`}
          >
            {steps.map((step, stepIdx) => {
              // Position calculation based on number of steps
              let positionClass = "";

              if (hasThreeSteps) {
                // For 3 steps: left, center, right
                if (stepIdx === 0) {
                  positionClass = "justify-start";
                } else if (stepIdx === 1) {
                  positionClass = "justify-center";
                } else {
                  positionClass = "justify-end";
                }
              } else {
                // For 2 steps: left and right
                positionClass = stepIdx === 0 ? "justify-start" : "justify-end";
              }

              return (
                <li
                  key={step.name}
                  className={`flex flex-col items-center relative ${
                    hasThreeSteps ? "w-1/3" : "w-1/2"
                  } ${positionClass}`}
                >
                  <div className="relative flex items-center justify-center z-10">
                    {/* Step circle */}
                    <div
                      className={`${
                        step.completed
                          ? "bg-[#99168E] border-[#FAFCA3]"
                          : currentStep === step.id
                          ? "bg-[#99168E] border-[#FAFCA3] animate-pulse"
                          : "bg-gray-100 border-gray-300"
                      } w-8 h-8 rounded-full flex items-center justify-center
                        border-2 transition-colors duration-300 shadow-md`}
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
                  <div className="mt-3 flex flex-col items-center space-y-2">
                    <span
                      className={`text-center font-medium whitespace-normal px-1
                        text-sm transition-colors duration-300 ${
                          step.completed
                            ? "text-[#FAFCA3]"
                            : currentStep === step.id
                            ? "text-[#FAFCA3]"
                            : "text-white/80"
                        }`}
                    >
                      {step.name}
                    </span>

                    {/* Only show button if it's visible for this user role */}
                    {step.visible && !step.completed ? (
                      <button
                        type="button"
                        onClick={step.onClick}
                        className={`mt-1 px-3 py-1.5 rounded-md text-xs
        font-medium transition-all duration-300 transform
        hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#99168E] ${
          step.disabled
            ? "bg-gray-300 text-gray-700 cursor-not-allowed opacity-70"
            : "bg-[#99168E] text-[#FAFCA3] hover:bg-[#820c78] shadow-lg"
        }`}
                        disabled={step.disabled}
                      >
                        {step.buttonText}
                      </button>
                    ) : step.completed ? (
                      <div className="mt-1 px-3 py-1.5 rounded-md text-xs font-medium bg-[#99168E]/80 text-[#FAFCA3]">
                        Completed
                      </div>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ol>
        </nav>
      </div>
    </div>
  );
}
