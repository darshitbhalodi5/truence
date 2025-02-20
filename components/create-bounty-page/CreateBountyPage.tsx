"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  Building,
  LinkIcon,
  PlusCircle,
  MinusCircle,
  Send,
} from "lucide-react";

export default function CreateBountyPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [links, setLinks] = useState<string[]>([""]);

  const addLink = () => setLinks([...links, ""]);
  const removeLink = (index: number) =>
    setLinks(links.filter((_, i) => i !== index));
  const updateLink = (index: number, value: string) => {
    const newLinks = [...links];
    newLinks[index] = value;
    setLinks(newLinks);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const data = {
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      email: formData.get("email"),
      company: formData.get("company"),
      usefulLinks: links.filter((link) => link.trim() !== ""),
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Something went wrong");
      }

      router.push("/thank-you");
    } catch (err: any) {
      console.error("Error while form submission", err);
      setError(err.message || "Failed to submit form. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-[#000108] to-[#0a1020] text-white">
      {/* Left side - Information */}
      <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center">
        <div className="max-w-md mx-auto space-y-8">
          <h1 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
            Join Truence's Journey
          </h1>

          <div className="space-y-6">
            <p className="text-gray-300 leading-relaxed">
              We're excited about your interest in Truence. Complete this form
              to start our collaboration journey.
            </p>
            <p className="text-gray-300 leading-relaxed">
              Our team is ready to discuss how Truence can elevate your projects
              and answer any questions you may have.
            </p>
          </div>

          <div className="mt-8 p-6 bg-white/5 rounded-lg backdrop-blur-sm">
            <h2 className="text-xl font-semibold mb-4">Why Choose Truence?</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-300">
              <li>Cutting-edge technology solutions</li>
              <li>Tailored approaches for your unique needs</li>
              <li>Commitment to innovation and excellence</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full md:w-1/2 bg-white/5 backdrop-blur-md flex items-center justify-center">
        <div className="max-w-md mx-auto p-8 md:p-16">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-gray-300"
                >
                  First Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="firstName"
                    id="firstName"
                    required
                    placeholder="Enter your first name"
                    className="w-full pl-10 pr-3 py-2 bg-gray-900/50 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <User
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-gray-300"
                >
                  Last Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="lastName"
                    id="lastName"
                    required
                    placeholder="Enter your last name"
                    className="w-full pl-10 pr-3 py-2 bg-gray-900/50 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <User
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-300"
                >
                  Email <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    id="email"
                    required
                    placeholder="Enter your email address"
                    className="w-full pl-10 pr-3 py-2 bg-gray-900/50 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <Mail
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="company"
                  className="block text-sm font-medium text-gray-300"
                >
                  Company <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="company"
                    id="company"
                    required
                    placeholder="Enter your company name"
                    className="w-full pl-10 pr-3 py-2 bg-gray-900/50 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <Building
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  Useful Links
                </label>
                {links.map((link, index) => (
                  <div key={index} className="flex gap-2">
                    <div className="relative flex-grow">
                      <input
                        type="url"
                        name={`links[${index}]`}
                        value={link}
                        onChange={(e) => updateLink(index, e.target.value)}
                        placeholder="Enter a useful link"
                        className="w-full pl-10 pr-3 py-2 bg-gray-900/50 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <LinkIcon
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        size={18}
                      />
                    </div>
                    {links.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeLink(index)}
                        className="p-2 bg-red-600/20 text-red-400 rounded-md hover:bg-red-600/30 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                      >
                        <MinusCircle size={18} />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addLink}
                  className="w-full mt-2 px-4 py-2 bg-blue-600/20 text-blue-400 rounded-md hover:bg-blue-600/30 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 flex items-center justify-center"
                >
                  <PlusCircle size={18} className="mr-2" /> Add Another Link
                </button>
              </div>
            </div>

            {error && (
              <div className="text-red-500 text-sm bg-red-900/20 border border-red-900/50 rounded-md p-4">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-md hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Submitting...
                </div>
              ) : (
                <>
                  <Send size={18} className="mr-2" /> Submit
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
