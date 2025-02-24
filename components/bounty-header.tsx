"use client";

import Image from "next/image";
import { getCurrency } from "@/utils/networkCurrency";
import { BountyHeaderProps } from "@/types/bountyHeaderProps";

export function BountyHeader({
  networkName,
  logoUrl,
  description,
  maxRewards,
  totalPaid,
  startDate,
  endDate,
  lastUpdated,
}: BountyHeaderProps) {
  const formatDate = (date: Date | null) => {
    if (!date) return "TBA";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div
      className="bg-gradient-to-r from-[#080008] via-[#00041B] to-[#000313] border border-[#4C085B] border-r-[#00082F] p-4 sm:p-6"
      style={{
        borderImage:
          "linear-gradient(90deg, #4C085B 0%, #73577A 50.23%, #00082F 100%) 1",
      }}
    >
      {/* Network Info */}
      <div className="flex flex-col sm:flex-row items-start gap-4 mb-6">
        <div className="relative w-12 h-12 flex-shrink-0">
          <Image
            src={logoUrl}
            alt={networkName}
            fill
            className="object-contain"
          />
        </div>
        <div className="flex-1">
          <h1 className="text-xl sm:text-2xl font-bold text-white mb-2">
            {networkName}
          </h1>
          <p className="text-[#8E8E8E] text-sm sm:text-base">{description}</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        {maxRewards > 0 && (
          <div className="rounded-lg p-3 sm:p-4 bg-[#AC350D] hover:bg-[#BC450D] transition-colors">
            <div className="text-xs sm:text-sm text-gray-200 mb-1">
              Maximum Bounty
            </div>
            <div className="text-base sm:text-lg font-semibold text-white">
              {maxRewards} {getCurrency(networkName)}
            </div>
          </div>
        )}

        {totalPaid > 0 && (
          <div className="rounded-lg p-3 sm:p-4 bg-[#99940E] hover:bg-[#A9A40E] transition-colors">
            <div className="text-xs sm:text-sm text-gray-200 mb-1">
              Total Paid
            </div>
            <div className="text-base sm:text-lg font-semibold text-white">
              {totalPaid} {getCurrency(networkName)}
            </div>
          </div>
        )}

        {startDate && (
          <div className="rounded-lg p-3 sm:p-4 bg-[#075540] hover:bg-[#176550] transition-colors">
            <div className="text-xs sm:text-sm text-gray-200 mb-1">
              Live Since
            </div>
            <div className="text-base sm:text-lg font-semibold text-white">
              {formatDate(startDate)}
            </div>
          </div>
        )}

        {endDate && (
          <div className="rounded-lg p-3 sm:p-4 bg-[#3D5B04] hover:bg-[#4D6B14] transition-colors">
            <div className="text-xs sm:text-sm text-gray-200 mb-1">
              End Date
            </div>
            <div className="text-base sm:text-lg font-semibold text-white">
              {formatDate(endDate)}
            </div>
          </div>
        )}

        <div className="rounded-lg p-3 sm:p-4 bg-[#2E022E] hover:bg-[#3E123E] transition-colors">
          <div className="text-xs sm:text-sm text-gray-200 mb-1">
            Last Updated
          </div>
          <div className="text-base sm:text-lg font-semibold text-white">
            {formatDate(lastUpdated)}
          </div>
        </div>
      </div>
    </div>
  );
}
