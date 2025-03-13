"use client";

import { useEffect, useState } from "react";
import { DisplayBounty } from "@/types/displayBounty";
import { BountyTable } from "@/components/bounty-card";
import { Navbar } from "@/components/navbar/Navbar";
import { NoBounties } from "@/components/no-bounties/NoBounties";
import { showCustomToast } from "@/components/custom-toast/CustomToast";
import { ChevronDown, Filter } from "lucide-react";

export default function ExploreBountiesPage() {
  const [bounties, setBounties] = useState<DisplayBounty[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBounties = async () => {
      try {
        const response = await fetch("/api/display-bounties");
        if (!response.ok) {
          throw new Error("Failed to fetch bounties");
        }
        const data = await response.json();
        setBounties(data);
      } catch (err) {
        console.log("Error while fetch bounties list", err);
        showCustomToast("error","Error while fetching bounties for you. Please try again!")
      } finally {
        setIsLoading(false);
      }
    };

    fetchBounties();
  }, []);

  return (
    <div className="min-h-screen bg-[#000108]">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <p className="text-[#FAFCA3] text-sm md:text-base">
            Discover and participate in bounties or program from various
            blockchain networks
          </p>
        </div>

        <div className="space-y-2">
          {isLoading ? (
            <div className="space-y-4">
              <div className="flex justify-end mb-4">
                <div className="relative">
                  <div className="flex items-center gap-2 bg-gray-800 text-white rounded-lg px-4 py-2.5 border border-gray-700 animate-pulse">
                    <Filter className="w-4 h-4" />
                    <div className="w-24 h-5 bg-gray-700 rounded"></div>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-gray-400 text-sm">
                      <th className="py-3 px-4">Description</th>
                      <th className="py-3 px-4">
                        <div className="flex items-center space-x-1">
                          <span>Max Rewards</span>
                          <div className="h-4 w-4 bg-gray-400 rounded-full"></div>
                        </div>
                      </th>
                      <th className="py-3 px-4 hidden sm:table-cell">
                        <div className="flex items-center space-x-1">
                          <span>Start Date</span>
                          <div className="h-4 w-4 bg-gray-400 rounded-full"></div>
                        </div>
                      </th>
                      <th className="py-3 px-4 hidden sm:table-cell">
                        <div className="flex items-center space-x-1">
                          <span>End Date</span>
                          <div className="h-4 w-4 bg-gray-400 rounded-full"></div>
                        </div>
                      </th>
                      <th className="py-3 px-4 text-center md:text-left">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {[1, 2, 3, 4].map((i) => (
                      <tr
                        key={i}
                        className="hover:bg-gray-800/50 transition-colors"
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="relative w-8 h-8 flex-shrink-0 rounded-full overflow-hidden bg-gray-700 animate-pulse"></div>
                            <div>
                              <div className="h-5 w-32 bg-gray-700 rounded animate-pulse mb-1"></div>
                              <div className="h-4 w-48 bg-gray-700 rounded animate-pulse"></div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="h-5 w-24 bg-gray-700 rounded animate-pulse"></div>
                        </td>
                        <td className="py-3 px-4 hidden sm:table-cell">
                          <div className="h-5 w-20 bg-gray-700 rounded animate-pulse"></div>
                        </td>
                        <td className="py-3 px-4 hidden sm:table-cell">
                          <div className="h-5 w-20 bg-gray-700 rounded animate-pulse"></div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="hidden md:flex px-2 py-1 rounded-full items-center gap-2 w-24 h-6 bg-gray-700 animate-pulse"></div>
                          <div className="md:hidden flex justify-center">
                            <div className="w-3 h-3 rounded-full bg-gray-700 animate-pulse"></div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : bounties.length === 0 ? (
            <div className="text-center py-8">
              <NoBounties />
            </div>
          ) : (
            <BountyTable bounties={bounties} featuredBountyId="67ced5d3c89e2cded0b8db42"/>
          )}
        </div>
      </div>
    </div>
  );
}
