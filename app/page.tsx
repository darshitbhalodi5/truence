import { Navbar } from '@/components/navbar/Navbar';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-6">Welcome to Truence</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Introducing the integrity of DAO funds. Secure, transparent, and community-driven.
          </p>
          <div className="flex gap-6 justify-center">
            <Link 
              href="/bounties/explore"
              className="px-8 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors text-lg font-medium"
            >
              Explore Bounties
            </Link>
            <Link 
              href="/bounties/create"
              className="px-8 py-3 rounded-lg border border-blue-600 hover:bg-blue-600/10 transition-colors text-lg font-medium"
            >
              Create Bounty
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="p-6 rounded-xl bg-gray-800/50 backdrop-blur">
            <h3 className="text-xl font-bold mb-3">Recover Misused Funds</h3>
            <p className="text-gray-300">
              Identifying and recovering misallocated resources through community oversight.
            </p>
          </div>
          <div className="p-6 rounded-xl bg-gray-800/50 backdrop-blur">
            <h3 className="text-xl font-bold mb-3">Prevent Misconduct</h3>
            <p className="text-gray-300">
              Transparent reporting and public accountability deter bad actors.
            </p>
          </div>
          <div className="p-6 rounded-xl bg-gray-800/50 backdrop-blur">
            <h3 className="text-xl font-bold mb-3">Empower Community</h3>
            <p className="text-gray-300">
              Give contributors the tools and incentives to uphold the integrity of the ecosystem.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
