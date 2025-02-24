"use client";

import { Navbar } from "@/components/navbar/Navbar";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Shield, Glasses, Users } from "lucide-react";

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features = [
    {
      icon: <Shield className="w-8 h-8 text-purple-400" />,
      title: "Recover Misused Funds",
      description:
        "Identifying and recovering misallocated resources through community oversight.",
    },
    {
      icon: <Glasses className="w-8 h-8 text-blue-400" />,
      title: "Prevent Misconduct",
      description:
        "Transparent reporting and public accountability deter bad actors.",
    },
    {
      icon: <Users className="w-8 h-8 text-green-400" />,
      title: "Empower Community",
      description:
        "Give contributors the tools and incentives to uphold the integrity of the ecosystem.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#000108] text-white bg-gradient-to-b from-[#000108] to-[#150b1a]">
      <Navbar />

      <main className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <section
          className={`text-center mb-24 transition-all duration-1000 transform ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-white via-purple-300 to-[#99168E] bg-clip-text text-transparent">
            Welcome to Truence
          </h1>
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
            Introducing the integrity of DAO funds. Secure, transparent, and
            community-driven.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              href="/bounties/explore"
              className="group px-8 py-4 rounded-lg border-2 border-[#99168E] hover:bg-[#99168E]/20 transition-all duration-300 text-lg font-medium relative overflow-hidden"
            >
              <span className="relative z-10">Explore Bounties</span>
              <div className="absolute inset-0 bg-gradient-to-r from-[#99168E]/0 via-[#99168E]/20 to-[#99168E]/0 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
            </Link>
            <Link
              href="/bounties/create"
              className="group px-8 py-4 rounded-lg bg-[#99168E] hover:bg-[#99168E]/90 transition-all duration-300 text-lg font-medium relative overflow-hidden"
            >
              <span className="relative z-10">Create Bounty</span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section className="grid md:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className={`p-8 rounded-xl bg-gray-800/30 backdrop-blur border border-gray-700/50 hover:border-gray-600/50 transition-all duration-500 transform hover:-translate-y-1 hover:shadow-2xl hover:shadow-purple-900/20 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: `${index * 200}ms` }}
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-white to-purple-300 bg-clip-text text-transparent">
                {feature.title}
              </h3>
              <p className="text-gray-300 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
