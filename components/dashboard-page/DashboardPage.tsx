"use client";

import { Navbar } from "@/components/navbar/Navbar";
import { usePrivy } from "@privy-io/react-auth";
import { useState, useEffect } from "react";
import { Submission } from "@/components/dashboard/Submission";
import { Review } from "@/components/dashboard/Review";
import { Management } from "@/components/dashboard/Management";
import Chat from "@/components/dashboard/Chat";
import { ArrowLeftIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import useScroll from "@/hooks/useScroll";
import { toast } from "react-hot-toast";

export default function DashboardPage() {
  const { user, ready } = usePrivy();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Your Submission");
  const isScrolled = useScroll();
  const [isLoading, setIsLoading] = useState(true);
  const [availableChats, setAvailableChats] = useState<
    Array<{
      bountyId: string;
      reportId: string;
      bountyName: string;
      reportTitle: string;
    }>
  >([]);
  const [selectedChat, setSelectedChat] = useState<{
    bountyId: string;
    reportId: string;
  } | null>(null);

  useEffect(() => {
    if (ready && !user) {
      toast.error("Please connect your wallet first");
      router.push("/");
      return;
    }

    // Simulate loading time for dashboard preparation
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [ready, user, router]);

  useEffect(() => {
    if (!user?.wallet?.address) return;

    // Fetch available chats for the user
    fetch(`/api/users/${user.wallet.address}/reports`)
      .then((res) => res.json())
      .then((data) => {
        const chats: typeof availableChats = [];

        // Add submitter's reports
        if (data.submitter.submissions) {
          data.submitter.submissions.forEach((submission: any) => {
            chats.push({
              bountyId: submission.bountyId,
              reportId: submission._id,
              bountyName: submission.programName,
              reportTitle: submission.title,
            });
          });
        }

        // Add reviewer's reports
        if (data.reviewer.submissions) {
          data.reviewer.submissions.forEach((submission: any) => {
            chats.push({
              bountyId: submission.bountyId,
              reportId: submission._id,
              bountyName: submission.programName,
              reportTitle: submission.title,
            });
          });
        }

        setAvailableChats(chats);
      })
      .catch((error) => {
        console.error("Error fetching available chats:", error);
        toast.error("Failed to load available chats");
      });
  }, [user?.wallet?.address]);

  if (isLoading || !ready) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-400">Preparing your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user?.wallet?.address) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <p className="text-red-400 text-lg">
            Please connect your wallet to view the dashboard
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="sticky top-0 z-50 bg-gray-900 pt-4 pb-0">
          <div className="flex items-center mb-6 border-b border-gray-700/50">
            {isScrolled && (
              <button
                onClick={() => router.back()}
                className="text-gray-400 hover:text-white transition-colors p-2"
              >
                <ArrowLeftIcon className="w-5 h-5" />
              </button>
            )}
            {["Your Submission", "Review Submission", "Manage Bounties"].map(
              (tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className="relative py-4 px-2 text-sm font-medium capitalize transition-all duration-200 group"
                >
                  <span
                    className={`${
                      activeTab === tab
                        ? "text-blue-500"
                        : "text-gray-400 hover:text-gray-200"
                    }`}
                  >
                    {tab}
                  </span>
                  <span
                    className={`absolute bottom-0 left-0 w-full h-0.5 transform transition-all duration-200
                        ${
                          activeTab === tab
                            ? "bg-gradient-to-r from-blue-500 to-blue-600 scale-x-100"
                            : "bg-blue-500/0 scale-x-0 group-hover:bg-blue-500/50 group-hover:scale-x-75"
                        }`}
                  />
                </button>
              )
            )}
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg p-6">
          {activeTab === "Your Submission" && (
            <Submission walletAddress={user.wallet.address} />
          )}
          {activeTab === "Review Submission" && (
            <Review walletAddress={user.wallet.address} />
          )}
          {activeTab === "Manage Bounties" && (
            <Management walletAddress={user.wallet.address} />
          )}
        </div>

        <Chat
          bountyId={selectedChat?.bountyId}
          reportId={selectedChat?.reportId}
          onSelectChat={(bountyId, reportId) =>
            setSelectedChat({ bountyId, reportId })
          }
          availableChats={availableChats}
        />
      </div>
    </div>
  );
}
