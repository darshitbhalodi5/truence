"use client";

import EvidenceSubmissionPage from "@/components/report-submission-page/EvidenceSubmissionPage";
import { Suspense } from "react";

export default function EvidenceSubmission() {
  return (
    <Suspense>
      <EvidenceSubmissionPage />
    </Suspense>
  );
}
