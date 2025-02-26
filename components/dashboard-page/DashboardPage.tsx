"use client";

import { Navbar } from "@/components/navbar/Navbar";
import { usePrivy } from "@privy-io/react-auth";
import { useState, useEffect } from "react";
import { Submission } from "@/components/dashboard/Submission";
import { Review } from "@/components/dashboard/Review";
import { Management } from "@/components/dashboard/Management";
import Chat from "@/components/dashboard/Chat";
import { ArrowLeftIcon, MenuIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { showCustomToast } from "@/components/custom-toast/CustomToast";
import { LoadingSpinner } from "@/components/multi-purpose-loader/LoadingSpinner";

export default function DashboardPage() {
  const { user, ready } = usePrivy();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Your Submission");
  const [isLoading, setIsLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userRoles, setUserRoles] = useState({
    isSubmitter: true,
    isReviewer: false,
    isManager: false,
  });
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
      showCustomToast(
        "error",
        "Please connect your wallet to access dashboard"
      );
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
        let hasReviewerRole = false;
        let hasManagerRole = false;

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
          hasReviewerRole = data.reviewer.submissions.length > 0;
          data.reviewer.submissions.forEach((submission: any) => {
            chats.push({
              bountyId: submission.bountyId,
              reportId: submission._id,
              bountyName: submission.programName,
              reportTitle: submission.title,
            });
          });
        }

        // Check if user is a manager
        if (data.manager && data.manager.bounties) {
          hasManagerRole = data.manager.bounties.length > 0;
        }

        // Set user roles
        setUserRoles({
          isSubmitter: true, // Everyone can submit
          isReviewer: hasReviewerRole,
          isManager: hasManagerRole,
        });

        // Set default active tab based on priority
        if (hasManagerRole) {
          setActiveTab("Manage Bounties");
        } else if (hasReviewerRole) {
          setActiveTab("Review Submission");
        } else {
          setActiveTab("Your Submission");
        }

        setAvailableChats(chats);
      })
      .catch((error) => {
        console.error("Error fetching available chats:", error);
      });
  }, [user?.wallet?.address]);

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false); // Close mobile menu after selection
  };

  if (isLoading || !ready) {
    return (
      <div className="min-h-screen bg-[#000108]">
        <Navbar />
        <LoadingSpinner text="Preparing your dashboard.." />
      </div>
    );
  }

  if (!user?.wallet?.address) {
    return (
      <div className="min-h-screen bg-[#000108]">
        <Navbar />
        <LoadingSpinner text="Please connect your wallet to view the dashboard" />
      </div>
    );
  }

  // Determine which tabs to show based on user roles
  const availableTabs = [
    { id: "Your Submission", visible: userRoles.isSubmitter },
    { id: "Review Submission", visible: userRoles.isReviewer },
    { id: "Manage Bounties", visible: userRoles.isManager },
  ].filter((tab) => tab.visible);

  return (
    <div className="min-h-screen bg-[#000108]">
      <Navbar />
      <div className="container mx-auto px-4 py-4 md:py-8">
        <div className="sticky top-0 z-50 bg-[#000108] pt-2 md:pt-4 pb-0">
          {/* Mobile navigation */}
          <div className="flex items-center justify-between md:hidden border-b border-[#757575] pb-3">
            <button
              onClick={() => router.back()}
              className="text-white hover:text-[#FAFCA3] transition-colors p-2"
            >
              <ArrowLeftIcon className="w-5 h-5" />
            </button>
            <span className="text-[#FAFCA3] font-medium text-lg">
              {activeTab}
            </span>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-white hover:text-[#FAFCA3] transition-colors p-2"
            >
              <MenuIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Mobile dropdown menu */}
          {mobileMenuOpen && (
            <div className="md:hidden bg-[#0A0A0A] rounded-md mt-2 shadow-lg absolute w-full left-0 right-0 z-50 border border-[#303030]">
              {availableTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  className={`w-full text-left px-4 py-3 block ${
                    activeTab === tab.id
                      ? "text-[#FAFCA3] bg-[#101010]"
                      : "text-[#DBDBDB] hover:bg-[#101010]"
                  }`}
                >
                  {tab.id}
                </button>
              ))}
            </div>
          )}

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center mb-6 border-b border-[#757575]">
            <button
              onClick={() => router.back()}
              className="text-white hover:text-[#FAFCA3] transition-colors p-2"
            >
              <ArrowLeftIcon className="w-5 h-5" />
            </button>
            {availableTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="relative py-4 px-2 text-lg font-medium capitalize transition-all duration-200 group"
              >
                <span
                  className={`${
                    activeTab === tab.id
                      ? "text-[#FAFCA3]"
                      : "text-[#DBDBDB] hover:text-gray-200"
                  }`}
                >
                  {tab.id}
                </span>
                <span
                  className={`absolute bottom-0 left-0 w-full h-1 transform transition-all duration-200
                          ${
                            activeTab === tab.id
                              ? "bg-[#FAFCA3] scale-x-100 rounded-tr rounded-tl"
                              : "bg-[#FAFCA3] scale-x-0 group-hover:bg-[#FAFCA3] group-hover:scale-x-75 rounded-tr rounded-tl"
                          }`}
                />
              </button>
            ))}
          </div>
        </div>
        <div className="bg-[#000108] rounded-lg p-2 md:p-6">
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

        <div className="mt-4 md:mt-6">
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
    </div>
  );
}
