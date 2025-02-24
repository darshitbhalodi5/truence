"use client";

import { useEffect, useState } from "react";
import { DisplayBounty } from "@/types/displayBounty";
import { BountyTable } from "@/components/bounty-card";
import { Navbar } from "@/components/navbar/Navbar";
import { NoBounties } from "@/components/no-bounties/NoBounties";
import toast from "react-hot-toast";

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
        toast.error("Failed to fetch bounties list");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBounties();
  }, []);

  // Skeleton loader
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#000108] p-4 md:p-6">
        <div className="max-w-6xl mx-auto">
          <div className="h-32 mb-6" /> {/* Space for future content */}
          <div className="animate-pulse space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-28 bg-gray-800 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

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
          {bounties.length === 0 ? (
            <div className="text-center py-8">
              <NoBounties />
            </div>
          ) : (
            <BountyTable bounties={bounties} />
          )}
        </div>
      </div>
    </div>
  );
}
