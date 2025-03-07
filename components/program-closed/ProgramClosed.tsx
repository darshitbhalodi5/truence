import React from "react";
import { AlertCircle } from "lucide-react";

export default function ProgramClosed() {
  return (
    <div className="bg-[#0A0F29] p-6 mt-6 rounded-lg shadow-xl">
      <div className="text-center max-w-2xl mx-auto py-8">
        <AlertCircle className="text-[#FAFCA3] w-12 h-12 mx-auto mb-6" />

        <h1 className="text-3xl md:text-4xl font-bold text-[#FAFCA3] tracking-tight mb-6">
          Program Closed
        </h1>

        <p className="text-xl md:text-xl text-white/80 mb-6">
          We're no longer accepting new submissions for this program.
        </p>

        <p className="text-md text-white/80">
          Please check back later for future opportunities or explore other
          programs.
        </p>
      </div>
    </div>
  );
}
