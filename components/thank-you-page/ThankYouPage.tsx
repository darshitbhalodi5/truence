import Link from "next/link";

export default function ThankYouPage() {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">Thank You!</h1>
        <p className="text-xl text-gray-300 mb-8">
          We have received your information and will be in touch soon.
        </p>
        <Link
          href="/"
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
