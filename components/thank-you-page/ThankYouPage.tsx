"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle, Home } from "lucide-react";

export default function ThankYouPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center bg-gray-800 p-8 rounded-lg shadow-xl max-w-md w-full"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        >
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
        </motion.div>
        <h1 className="text-4xl font-bold text-white mb-4">Thank You!</h1>
        <p className="text-xl text-gray-300 mb-8">
          We have received your information and will be in touch soon.
        </p>
        <Link
          href="/"
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105"
        >
          <Home className="mr-2 h-5 w-5" />
          Return Home
        </Link>
      </motion.div>
    </div>
  );
}
