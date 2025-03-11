import { useState, useEffect, useCallback } from "react";
import { UsePinProps } from "@/types/pinSubmissionProps";

export const usePin = ({ walletAddress, prefix }: UsePinProps) => {
  const pinKey = walletAddress
    ? `${prefix}Pins_${walletAddress}`
    : `${prefix}Pins`;

  // Initialize state with data from localStorage
  const [pinnedSubmissions, setPinnedSubmissions] = useState<string[]>(() => {
    try {
      const savedPins = localStorage.getItem(pinKey);
      if (savedPins) {
        const parsedPins = JSON.parse(savedPins);
        if (Array.isArray(parsedPins)) {
          return parsedPins;
        }
      }
      return [];
    } catch (e) {
      console.error("Error loading initial pinned submissions:", e);
      return [];
    }
  });

  // Persist pin submissions to localStorage
  const persistPins = useCallback(
    (pins: string[]) => {
      try {
        if (pins.length === 0) {
          localStorage.removeItem(pinKey);
        } else {
          localStorage.setItem(pinKey, JSON.stringify(pins));
        }
      } catch (e) {
        console.error("Error persisting to pin submission:", e);
      }
    },
    [pinKey]
  );

  // Load pinned submissions from localStorage when component mounts or wallet changes
  useEffect(() => {
    const loadPinSubmissions = () => {
      try {
        const savedPins = localStorage.getItem(pinKey);
        const parsedPins = savedPins ? JSON.parse(savedPins) : [];

        if (Array.isArray(parsedPins)) {
          setPinnedSubmissions(parsedPins);
        } else {
          console.error("Stored pin submissions are not an array:", parsedPins);
          setPinnedSubmissions([]);
          localStorage.removeItem(pinKey);
        }
      } catch (e) {
        console.error("Error loading pinned submissions:", e);
        setPinnedSubmissions([]);
        localStorage.removeItem(pinKey);
      }
    };

    loadPinSubmissions();

    // Handle storage events for cross-tab synchronization
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === pinKey) {
        loadPinSubmissions();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [pinKey]);

  // Persist pin submissions whenever they change
  useEffect(() => {
    persistPins(pinnedSubmissions);
  }, [pinnedSubmissions, persistPins]);

  // Toggle pinned submission status
  const togglePins = useCallback(
    (submissionId: string) => {
      setPinnedSubmissions((prev) => {
        const isCurrentlyPinned = prev.includes(submissionId);
        const newPins = isCurrentlyPinned
          ? prev.filter((id) => id !== submissionId)
          : [...prev, submissionId];

        // Immediately persist the change
        persistPins(newPins);
        return newPins;
      });
    },
    [persistPins]
  );

  // Check if a submission is pinned
  const isPinned = useCallback(
    (submissionId: string): boolean => {
      return pinnedSubmissions.includes(submissionId);
    },
    [pinnedSubmissions]
  );

  return {
    pinnedSubmissions,
    togglePins,
    isPinned,
  };
};
