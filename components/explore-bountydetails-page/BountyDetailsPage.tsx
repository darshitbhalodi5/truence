"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { BountyHeader } from "@/components/bounty-header";
import { DisplayBounty } from "@/types/displayBounty";
import { BountyRewards } from "@/components/bounty-rewards";
import { usePathname } from "next/navigation";
import React from "react";
import { componentsMap } from "@/utils/mapBounties";
import { Navbar } from "@/components/navbar/Navbar";
import { Bars3Icon } from "@heroicons/react/24/solid";
import { LoadingSpinner } from "@/components/multi-purpose-loader/LoadingSpinner";
export interface SeverityDescription {
  severity: "Critical" | "High" | "Medium" | "Low";
  description: string[];
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
  status?: string;
  severityDescriptions: SeverityDescription[];
}

export default function BountyDetailsPage() {
  const pathname = usePathname();
  const router = useRouter();
  const params = useParams();
  const [displayBounty, setDisplayBounty] = useState<DisplayBounty | null>(
    null
  );
  const [bountyDetails, setBountyDetails] = useState<BountyDetails | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("information");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

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

  // Close mobile menu when tab changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [activeTab]);

  // Add click outside handler to close menu
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        mobileMenuOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        menuButtonRef.current &&
        !menuButtonRef.current.contains(event.target as Node)
      ) {
        setMobileMenuOpen(false);
      }
    }

    // Add event listener when menu is open
    if (mobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    // Cleanup event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [mobileMenuOpen]);

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
            <div className="sticky top-0 z-50 pt-0 pb-0 bg-[#000108]">
              <div className="relative border-b border-[#757575]">
                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center justify-between mb-0">
                  <div className="flex space-x-6">
                    <button
                      onClick={() => router.back()}
                      className="text-white hover:text-[#FAFCA3] transition-colors p-2"
                    >
                      <ArrowLeftIcon className="w-5 h-5" />
                    </button>
                    {["information", "scope", "rewards", "rules"].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className="relative py-4 px-2 text-lg capitalize transition-all duration-200 group"
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
                          className={`absolute bottom-0 left-0 w-full h-1 transform transition-all duration-200
                          ${
                            activeTab === tab
                              ? "bg-[#FAFCA3] scale-x-100 rounded-tr rounded-tl"
                              : "bg-[#FAFCA3] scale-x-0 group-hover:bg-[#FAFCA3] group-hover:scale-x-75 rounded-tr rounded-tl"
                          }`}
                        />
                      </button>
                    ))}
                  </div>

                  {/* Desktop Submit Button */}
                  {displayBounty?.status === "IN_PROCESS" && (
                    <button
                      className="bg-gradient-to-r from-[#990F62] via-[#99168E] to-[#991DB5] hover:from-[#b02579] hover:via-[#a12796] hover:to-[#9e2eb8] 
                      text-white px-6 py-2.5 rounded-lg font-medium text-lg transition-all duration-200 
                      shadow-lg hover:shadow-pink-200/40"
                      onClick={() =>
                        router.push(
                          `/submission?bountyName=${encodeURIComponent(
                            displayBounty?.networkName || ""
                          )}`
                        )
                      }
                    >
                      Submit Evidence
                    </button>
                  )}
                </div>

                {/* Mobile Navigation */}
                <div className="flex md:hidden items-center justify-between py-3">
                  <div className="flex items-center">
                    <button
                      onClick={() => router.back()}
                      className="text-white mr-3"
                    >
                      <ArrowLeftIcon className="w-5 h-5" />
                    </button>

                    <button
                      ref={menuButtonRef}
                      onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                      className="text-white flex items-center"
                    >
                      <Bars3Icon className="w-6 h-6 mr-2" />
                      <span className="capitalize">{activeTab}</span>
                    </button>
                  </div>

                  {/* Mobile Submit Button */}
                  {displayBounty?.status === "IN_PROCESS" && (
                    <button
                      className="bg-gradient-to-r from-[#990F62] via-[#99168E] to-[#991DB5]
                    text-white px-4 py-1.5 rounded-lg font-medium text-sm"
                      onClick={() =>
                        router.push(
                          `/submission?bountyName=${encodeURIComponent(
                            displayBounty?.networkName || ""
                          )}`
                        )
                      }
                    >
                      Submit
                    </button>
                  )}
                </div>

                {/* Mobile Menu Dropdown */}
                {mobileMenuOpen && (
                  <div
                    ref={menuRef}
                    className="absolute top-full left-0 right-0 bg-[#121218] z-50 shadow-lg rounded-b-lg md:hidden"
                  >
                    {["information", "scope", "rewards", "rules"].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className="block w-full text-left py-3 px-4 capitalize border-b border-[#2A2A2A] last:border-b-0"
                      >
                        <span
                          className={`${
                            activeTab === tab
                              ? "text-[#FAFCA3]"
                              : "text-[#DBDBDB]"
                          }`}
                        >
                          {tab}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
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
                    status={displayBounty?.status || ""}
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
