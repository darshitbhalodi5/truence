import React from "react";
import { LoadingSpinner } from "@/components/multi-purpose-loader/LoadingSpinner";
import { StateHandlerProps } from "@/types/StateHandlerProps";

/**
 * A reusable component for handling common UI states
 * like loading, errors, and empty data conditions
 */

const StateHandler: React.FC<StateHandlerProps> = ({
  // Required props
  isLoading,
  children,

  // Optional defaults props for every condition (loading, error, empty, notAuthorized)
  loadingSpinner = null,
  loadingText = "Loading data...",

  error = null,
  errorTitle = "Error Loading Data",

  isEmpty = false,
  emptyTitle = "No Data Available",
  emptyMessage = "There is no data to display at this time.",

  notAuthorized = false,
  notAuthorizedTitle = "Not Authorized",
  notAuthorizedMessage = "You don't have permission to view this content.",
}) => {
  // Custom loading spinner or default loading UI
  if (isLoading) {
    return (
      loadingSpinner || (
        <div className="flex items-center justify-center min-h-[200px]">
          {typeof LoadingSpinner !== "undefined" ? (
            <LoadingSpinner text={loadingText} />
          ) : (
            <div className="text-center">
              <div className="animate-spin h-8 w-8 border-4 border-t-transparent border-[#FAFCA3] rounded-full mx-auto mb-2"></div>
              <p>{loadingText}</p>
            </div>
          )}
        </div>
      )
    );
  }

  // Error state
  if (error) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold text-[#AC350D] mb-2">
          {errorTitle}
        </h3>
        <p className="text-[#FAFCA3] text-lg">{error}</p>
      </div>
    );
  }

  // Not authorized state
  if (notAuthorized) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold text-[#FAFCA3] mb-2">
          {notAuthorizedTitle}
        </h3>
        <p className="text-white/80">{notAuthorizedMessage}</p>
      </div>
    );
  }

  // Empty data state
  if (isEmpty) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold text-[#FAFCA3] mb-2">
          {emptyTitle}
        </h3>
        <p className="text-white/80">{emptyMessage}</p>
      </div>
    );
  }

  // If none of the conditions match, render the children
  return children;
};

export default StateHandler;
