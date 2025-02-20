"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle, Home } from "lucide-react";

export default function ThankYouPage() {
  return (
    <div className="min-h-screen bg-[#000108] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        // className="text-center bg-gray-800 p-8 rounded-lg shadow-xl max-w-md w-full"
        className="text-center bg-gray-900 p-8 rounded-2xl shadow-2xl max-w-md w-full border border-gray-700"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        >
          <CheckCircle className="w-20 h-20 text-green-400 mx-auto mb-6" />
        </motion.div>
        <h1 className="text-4xl font-bold text-gray-100 mb-4">Thank You!</h1>
        <p className="text-xl text-gray-400 mb-8">
          We have received your information and will be in touch soon.
        </p>
        <Link
          href="/"
          className="inline-flex items-center px-6 py-3 border border-gray-600 text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition duration-300 ease-in-out transform hover:scale-105 shadow-md"
        >
          <Home className="mr-2 h-5 w-5" />
          Return Home
        </Link>
      </motion.div>
    </div>
  );
}
