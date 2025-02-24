import { AlertCircle } from "lucide-react";

export function NoBounties() {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="rounded-full bg-yellow-100 p-3">
        <AlertCircle className="h-6 w-6 text-yellow-600" />
      </div>
      <h3 className="mt-2 text-sm font-medium text-gray-200">
        No bounties available
      </h3>
      <p className="mt-1 text-sm text-gray-400">
        There are currently no bounties available. Please check back later.
      </p>
    </div>
  );
}
