"use client";
import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex justify-center items-center bg-[#000108] text-white">
      <div className="max-w-2xl text-center px-6 py-8">
        <div className="text-4xl mb-4 animate-bounce">🛸</div>
        <h3 className="text-lg mb-6 text-yellow-100">Truence says</h3>
        <h1 className="text-8xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent mb-2">
          404
        </h1>
        <h2 className="text-3xl mb-6 text-yellow-100">Page Not Found</h2>
        <p className="text-gray-300 mb-8 max-w-md mx-auto">
          The page you are looking for might have been removed, had its name
          changed, or is temporarily unavailable.
        </p>

        <Link
          href="/"
          className="inline-block border-2 border-[#ffffff] px-8 py-3 rounded-lg transition-all hover:bg-[rgba(74,255,138,0.1)] hover:shadow-[0_0_15px_rgba(74,255,138,0.5)]"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
