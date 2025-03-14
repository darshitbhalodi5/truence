import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  BountyTableProps,
  BountyCardProps,
  DisplayBountyStatus,
  SortField,
  SortDirection,
} from "@/types/displayBounty";
import { getCurrency, formatRewardNumber } from "@/utils/networkCurrency";
import { ChevronDown, Filter, Search } from "lucide-react";
import SortIcon from "@/components/sort-icon/SortIcon";

export function BountyTable({ bounties, featuredBountyId }: BountyTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<SortField>("startDate");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [statusFilter, setStatusFilter] = useState<DisplayBountyStatus | "ALL">(
    "ALL"
  );
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Status color for various status
  const statusConfig = {
    LIVE_SOON: { color: "bg-yellow-500", tooltip: "Live Soon" },
    IN_PROCESS: { color: "bg-green-500", tooltip: "In Process" },
    CLOSED: { color: "bg-red-500", tooltip: "Closed" },
    UPCOMING: { color: "bg-blue-500", tooltip: "Upcoming" },
  };

  // To show dot with specific status color
  const StatusDot = ({ status }: { status: DisplayBountyStatus }) => (
    <div className="relative group">
      <div className={`w-3 h-3 rounded-full ${statusConfig[status].color}`} />
      <div className="hidden group-hover:block absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-xs text-white rounded whitespace-nowrap">
        {statusConfig[status].tooltip}
      </div>
    </div>
  );

  // Show status of particular bounties/program
  const StatusCell = ({ status }: { status: DisplayBountyStatus }) => (
    <>
      <div className="hidden md:flex px-2 py-1 rounded-full text-xs items-center gap-2">
        <span
          className={`w-2 h-2 rounded-full ${statusConfig[status].color}`}
        />
        <span className={`text-${status.toLowerCase().replace("_", "-")}`}>
          {status.replace("_", " ")}
        </span>
      </div>
      <div className="md:hidden flex justify-center">
        <StatusDot status={status} />
      </div>
    </>
  );

  // To show formatted date
  const formatDate = (date: Date | null) => {
    if (!date) return "TBA";
    return new Date(date).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Calculate status from data
  const calculateStatus = (
    bounty: BountyCardProps["bounty"]
  ): DisplayBountyStatus => {
    const now = new Date();

    if (!bounty.startDate) {
      return "LIVE_SOON";
    }

    const currentTime = now.getTime();
    const startTime = new Date(bounty.startDate).getTime();
    const endTime = bounty.endDate ? new Date(bounty.endDate).getTime() : null;

    if (endTime && currentTime >= endTime) {
      return "CLOSED";
    }

    if (currentTime < startTime) {
      return "UPCOMING";
    }

    return "IN_PROCESS";
  };

  // Logic for sorting various operation on bounties
  const sortedAndFilteredBounties = useMemo(() => {
    let filtered = bounties.map((bounty) => ({
      ...bounty,
      status: calculateStatus(bounty),
      isFeatured: bounty._id === featuredBountyId
    }));

    if (statusFilter !== "ALL") {
      filtered = filtered.filter((bounty) => bounty.status === statusFilter);
    }

    if (searchQuery.trim()) {
      filtered = filtered.filter((bounty) =>
        bounty.networkName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // First sort by featured status to keep featured bounty at the top
    return filtered.sort((a, b) => {
      // If a is featured, it should come first
      if (a.isFeatured && !b.isFeatured) return -1;
      // If b is featured, it should come first
      if (!a.isFeatured && b.isFeatured) return 1;
      
      // If neither or both are featured, sort by the selected field
      const direction = sortDirection === "asc" ? 1 : -1;

      switch (sortField) {
        case "rewards":
          return (a.maxRewards - b.maxRewards) * direction;
        case "startDate":
          return (
            ((a.startDate ? new Date(a.startDate).getTime() : 0) -
              (b.startDate ? new Date(b.startDate).getTime() : 0)) *
            direction
          );
        case "endDate":
          return (
            ((a.endDate ? new Date(a.endDate).getTime() : 0) -
              (b.endDate ? new Date(b.endDate).getTime() : 0)) *
            direction
          );
        default:
          return 0;
      }
    });
  }, [bounties, sortField, sortDirection, statusFilter, searchQuery, featuredBountyId]);

  // Handle sorting part for asending or descending
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <div className="relative flex-grow max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-white" />
          </div>
          <input
            type="text"
            placeholder="Search by program name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 w-full bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#99168E] focus:border-transparent"
          />
        </div>
        <div className="relative">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center gap-2 bg-gray-800 text-white rounded-lg px-4 py-2.5 
                     hover:bg-gray-700 transition-colors duration-200 border border-gray-700"
          >
            <Filter className="w-4 h-4" />
            <span className="text-sm font-medium hidden md:inline">
              {statusFilter === "ALL"
                ? "All Statuses"
                : statusFilter.replace("_", " ")}
            </span>
            {statusFilter !== "ALL" && (
              <span className="md:hidden">
                <StatusDot status={statusFilter as DisplayBountyStatus} />
              </span>
            )}
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-200 
              ${isFilterOpen ? "rotate-180" : ""}`}
            />
          </button>

          {isFilterOpen && (
            <div
              className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg 
                          border border-gray-700 py-1 z-50"
            >
              <button
                onClick={() => {
                  setStatusFilter("ALL");
                  setIsFilterOpen(false);
                }}
                className={`w-full px-4 py-2 text-sm text-left flex items-center gap-2 
                         hover:bg-gray-700 transition-colors duration-200
                         ${statusFilter === "ALL" ? "bg-gray-700" : ""}`}
              >
                All Statuses
              </button>
              {Object.entries(statusConfig).map(([status, config]) => (
                <button
                  key={status}
                  onClick={() => {
                    setStatusFilter(status as DisplayBountyStatus);
                    setIsFilterOpen(false);
                  }}
                  className={`w-full px-4 py-2 text-sm text-left flex items-center gap-2 
                           hover:bg-gray-700 transition-colors duration-200
                           ${statusFilter === status ? "bg-gray-700" : ""}`}
                >
                  <span className={`w-2 h-2 rounded-full ${config.color}`} />
                  {config.tooltip}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="relative overflow-x-auto">
        <div className="scroll-container overflow-y-auto max-h-[80vh] scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-700 scrollbar-thumb-rounded-lg">
          <table className="w-full">
            <thead className="text-sm text-gray-400 sticky top-0 bg-gray-900 z-10">
              <tr className="text-left text-gray-400 bg-gray-900 text-sm">
                <th className="w-3/5 py-3 px-4">Description</th>
                <th
                  className="py-3 px-4 cursor-pointer"
                  onClick={() => handleSort("rewards")}
                >
                  <div className="flex items-center space-x-1">
                    <span>Max Rewards</span>
                    <SortIcon
                      field="rewards"
                      sortField={sortField}
                      sortDirection={sortDirection}
                    />
                  </div>
                </th>
                <th
                  className="py-3 px-4 cursor-pointer hidden sm:table-cell"
                  onClick={() => handleSort("startDate")}
                >
                  <div className="flex items-center space-x-1">
                    <span>Start Date</span>
                    <SortIcon
                      field="startDate"
                      sortField={sortField}
                      sortDirection={sortDirection}
                    />
                  </div>
                </th>
                <th
                  className="py-3 px-4 cursor-pointer hidden sm:table-cell"
                  onClick={() => handleSort("endDate")}
                >
                  <div className="flex items-center space-x-1">
                    <span>End Date</span>
                    <SortIcon
                      field="endDate"
                      sortField={sortField}
                      sortDirection={sortDirection}
                    />
                  </div>
                </th>
                <th className="py-3 px-4 text-center md:text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {sortedAndFilteredBounties.map((bounty) => {
                const status = bounty.status;
                const isClosed = status === "CLOSED";
                const isFeatured = bounty._id === featuredBountyId;

                return (
                  <tr
                    key={bounty._id}
                    className={`hover:bg-gray-800/50 transition-colors ${
                      isFeatured ? "bg-gray-800/30" : ""
                    }`}
                  >
                    <td className="py-3 px-4">
                      <Link
                        href={`/bounties/explore/${bounty.networkName
                          .toLowerCase()
                          .replace(/\s+/g, "-")}`}
                        className="flex items-center gap-3"
                      >
                        <div className="relative w-8 h-8 flex-shrink-0 rounded-full overflow-hidden">
                          <Image
                            src={bounty.logoUrl}
                            alt={bounty.networkName}
                            fill
                            className={`object-contain ${
                              isClosed ? "grayscale" : ""
                            }`}
                          />
                        </div>
                        <div>
                          <h3 className="text-white font-medium flex items-center gap-2">
                            {bounty.networkName}
                            {isFeatured && (
                              <span className="bg-[#99168E] text-white text-xs px-2 py-0.5 rounded-full">
                                Featured
                              </span>
                            )}
                          </h3>
                          <p className="text-gray-400 text-sm line-clamp-1">
                            {bounty.description}
                          </p>
                        </div>
                      </Link>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-[#FAFCA3]">
                        {formatRewardNumber(bounty.maxRewards)}{" "}
                        {getCurrency(bounty.networkName)}
                      </span>
                    </td>
                    <td className="py-3 px-4 hidden sm:table-cell">
                      {formatDate(bounty.startDate)}
                    </td>
                    <td className="py-3 px-4 hidden sm:table-cell">
                      {formatDate(bounty.endDate)}
                    </td>
                    <td className="py-3 px-4">
                      <StatusCell status={status} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
