"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { BountyHeader } from "@/components/bounty-header";
import { DisplayBounty } from "@/types/displayBounty";
import { BountyRewards } from "@/components/bounty-rewards";
import { usePathname } from "next/navigation";
import React from "react";
import { componentsMap } from "@/utils/mapBounties";
import { Navbar } from "@/components/navbar/Navbar";
import useScroll from "@/hooks/useScroll";
import { LoadingSpinner } from "@/components/multi-purpose-loader/LoadingSpinner";
export interface SeverityDescription {
  severity: "Critical" | "High" | "Medium" | "Low";
  description: string;
}

interface BountyDetails {
  networkName: string;
  criticalReward: number;
  highReward: number;
  mediumReward: number;
  lowReward: number;
  additionalDetails: {
    scope: string;
    eligibility: string;
    rules: string;
    rewards: string;
  };
  severityDescriptions: SeverityDescription[];
}

export default function BountyDetailsPage() {
  const pathname = usePathname();
  const router = useRouter();
  const params = useParams();
  const isScrolled = useScroll();
  const [displayBounty, setDisplayBounty] = useState<DisplayBounty | null>(
    null
  );
  const [bountyDetails, setBountyDetails] = useState<BountyDetails | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("information");

  const lastSegment = pathname.split("/").filter(Boolean).pop();
  const components = componentsMap[lastSegment as string] || [];

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch display bounty data
        const displayResponse = await fetch(
          `/api/display-bounties/${params.network}`
        );
        const displayData = await displayResponse.json();
        setDisplayBounty(displayData);

        // Try to fetch additional details if available
        try {
          const detailsResponse = await fetch(
            `/api/bounties/${params.network}`
          );
          if (detailsResponse.ok) {
            const detailsData = await detailsResponse.json();
            setBountyDetails(detailsData);
          }
        } catch (error) {
          console.error("Additional details not found:", error);
        }
      } catch (error) {
        console.error("Error fetching bounty:", error);
      } finally {
        setLoading(false);
      }
    };

    if (params.network) {
      fetchData();
    }
  }, [params.network]);

  // Show loader
  if (loading) {
    return displayBounty?.networkName ? (
      <LoadingSpinner
        text={`Fetching latest details of ${displayBounty?.networkName}`}
      />
    ) : (
      <LoadingSpinner text="Fetching latest details.." />
    );
  }

  return (
    <div className="min-h-screen bg-[#000108]">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        {/* Back Button - Only show when not scrolled */}
        {!isScrolled && (
          <button
            onClick={() => router.back()}
            className="flex items-center space-x-2 text-white hover:text-[#FAFCA3] mb-6 transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            <span>Back to Opportunities</span>
          </button>
        )}

        {/* Bounty Header */}
        <div className="mb-4">
          {displayBounty && (
            <BountyHeader
              networkName={displayBounty.networkName}
              logoUrl={displayBounty.logoUrl}
              description={displayBounty.description}
              maxRewards={displayBounty.maxRewards}
              totalPaid={displayBounty.totalPaid}
              startDate={displayBounty.startDate}
              endDate={displayBounty.endDate}
              lastUpdated={displayBounty.lastUpdated}
            />
          )}
        </div>

        {/* Only show tabs and content sections if additional details are available */}
        {bountyDetails && (
          <>
            {/* Navigation Tabs and Submit Button */}
            <div className="sticky top-0 z-50 pt-0 pb-0">
              <div className="flex items-center justify-between mb-6 border-b border-[#757575]">
                <div className="flex space-x-6">
                  {isScrolled && (
                    <button
                      onClick={() => router.back()}
                      className="text-white hover:text-[#FAFCA3] transition-colors p-2"
                    >
                      <ArrowLeftIcon className="w-5 h-5" />
                    </button>
                  )}
                  {["information", "scope", "rewards", "rules"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className="relative py-4 px-2 text-sm font-medium capitalize transition-all duration-200 group"
                    >
                      <span
                        className={`${
                          activeTab === tab
                            ? "text-[#FAFCA3]"
                            : "text-[#DBDBDB] hover:text-gray-200"
                        }`}
                      >
                        {tab}
                      </span>
                      {/* Bottom line indicator */}
                      <span
                        className={`absolute bottom-0 left-0 w-full h-0.5 transform transition-all duration-200
                        ${
                          activeTab === tab
                            ? "bg-[#FAFCA3] scale-x-100 rounded-t-lg"
                            : "bg-[#FAFCA3] scale-x-0 group-hover:bg-[#FAFCA3] group-hover:scale-x-75"
                        }`}
                      />
                    </button>
                  ))}
                </div>

                {/* Submit Button */}
                <button
                  className="bg-gradient-to-r from-[#990F62] via-[#99168E] to-[#991DB5] hover:from-[#b02579] hover:via-[#a12796] hover:to-[#9e2eb8] 
                    text-white px-6 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 
                    shadow-lg hover:shadow-pink-200/40"
                  onClick={() => router.push("/submission")}
                >
                  Submit Evidence
                </button>
              </div>
            </div>

            {/* Content Sections */}
            <div className="bg-[#000108] rounded-lg pt-4">
              {activeTab === "information" &&
                components[0] &&
                React.createElement(components[0])}
              {activeTab === "rules" &&
                components[1] &&
                React.createElement(components[1])}
              {activeTab === "scope" &&
                components[2] &&
                React.createElement(components[2])}

              {activeTab === "rewards" && (
                <div className="space-y-6">
                  <BountyRewards
                    networkName={bountyDetails.networkName}
                    criticalReward={bountyDetails.criticalReward}
                    highReward={bountyDetails.highReward}
                    mediumReward={bountyDetails.mediumReward}
                    lowReward={bountyDetails.lowReward}
                    severityDescriptions={bountyDetails.severityDescriptions}
                  />
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
