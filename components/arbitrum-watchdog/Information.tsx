import React from "react";
import { Shield } from "lucide-react";

export function ArbitrumWatchdogInfo() {
  return (
    <div className="space-y-6 text-gray-300">
      <div className="flex items-center space-x-3 mb-6">
        <Shield className="w-6 h-6 text-blue-400" />
        <h2 className="text-xl font-semibold bg-gradient-to-r from-blue-100 via-blue-200 to-blue-300 bg-clip-text text-transparent">
          Program Overview
        </h2>
      </div>

      <div className="space-y-8">
        <div className="bg-gray-800/40 border border-gray-700/50 rounded-lg p-6 hover:border-gray-600 transition-all duration-200">
          <h3 className="text-lg font-medium text-white mb-3">
            About the Program
          </h3>
          <div className="space-y-4 text-gray-400 leading-relaxed">
            <p>
              The Arbitrum Watchdog program is a community-driven initiative
              designed to protect the Arbitrum ecosystem&apos;s integrity by
              incentivizing the identification and reporting of fund misuse.
              With over 422m ARB tokens allocated across various initiatives,
              this program serves as a crucial oversight mechanism.
            </p>
            <p>
              The program employs a comprehensive review system where reports
              are evaluated by a committee of three trusted entities: the
              Arbitrum Foundation, Entropy Advisors, and the elected Research
              Member of the ARDC. This structure ensures fair and thorough
              assessment of all submissions while maintaining reporter
              anonymity.
            </p>
          </div>
        </div>

        <div className="bg-gray-800/40 border border-gray-700/50 rounded-lg p-6 hover:border-gray-600 transition-all duration-200">
          <h3 className="text-lg font-medium text-white mb-3">Mission</h3>
          <p className="text-gray-400 leading-relaxed">
            The Watchdog program is a specialized bounty initiative established
            by Entropy Advisors to protect the Arbitrum DAO&apos;s 422m+ ARB
            token allocations across various initiatives. It serves as a
            decentralized accountability mechanism to identify and report fund
            misappropriation.
          </p>
        </div>

        <div className="bg-gray-800/40 border border-gray-700/50 rounded-lg p-6 hover:border-gray-600 transition-all duration-200">
          <h3 className="text-lg font-medium text-white mb-3">
            Program Objectives
          </h3>
          <div className="space-y-4">
            <div className="p-4 bg-gray-700/20 rounded-lg">
              <h4 className="text-white font-medium mb-2">Fund Protection</h4>
              <p className="text-gray-400">
                Safeguard the DAO&apos;s allocated funds through community
                vigilance and systematic oversight, ensuring resources are used
                as intended across all initiatives.
              </p>
            </div>
            <div className="p-4 bg-gray-700/20 rounded-lg">
              <h4 className="text-white font-medium mb-2">
                Transparency Enhancement
              </h4>
              <p className="text-gray-400">
                Foster an environment of accountability by creating clear
                reporting channels and maintaining open communication about fund
                usage.
              </p>
            </div>
            <div className="p-4 bg-gray-700/20 rounded-lg">
              <h4 className="text-white font-medium mb-2">
                Ecosystem Integrity
              </h4>
              <p className="text-gray-400">
                Maintain the integrity of Arbitrum&apos;s grant and incentive
                programs by deterring potential misuse and ensuring proper fund
                allocation.
              </p>
            </div>
          </div>
        </div>
        <div className="bg-gray-800/40 border border-gray-700/50 rounded-lg p-6 hover:border-gray-600 transition-all duration-200">
          <h3 className="text-lg font-medium text-white mb-3">
            Program Features
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4  rounded-lg">
              <h4 className="text-blue-400 font-medium mb-2">
                Anonymous Reporting
              </h4>
              <p className="text-gray-400">
                Submit reports confidentially through our secure platform,
                protecting whistleblower identities throughout the process.
              </p>
            </div>
            <div className="p-4  rounded-lg">
              <h4 className="text-green-400 font-medium mb-2">
                Fair Evaluation
              </h4>
              <p className="text-gray-400">
                Three-member committee ensures unbiased assessment of all
                submissions with clear severity classifications.
              </p>
            </div>
            <div className="p-4  rounded-lg">
              <h4 className="text-purple-400 font-medium mb-2">
                Structured Rewards
              </h4>
              <p className="text-gray-400">
                Receive rewards based on impact level, with additional
                percentage from recovered funds.
              </p>
            </div>
            <div className="p-4  rounded-lg">
              <h4 className="text-orange-400 font-medium mb-2">
                Continuous Monitoring
              </h4>
              <p className="text-gray-400">
                Ongoing oversight of all DAO-funded initiatives with regular
                program reviews and updates.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="space-y-8">
        <div className="bg-gray-800/40 border border-gray-700/50 rounded-lg p-6 hover:border-gray-600 transition-all duration-200">
          <h3 className="text-lg font-medium text-white mb-3">Key Benefits</h3>
          <ul className="space-y-2 text-gray-400">
            <li className="flex items-start space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0"></span>
              <span>
                Enables fund recovery through legal means, smart contract
                enforcement, or community pressure
              </span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0"></span>
              <span>
                Provides evidence for improving underlying programs and
                identifying bad actors
              </span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0"></span>
              <span>Creates deterrence against malicious actions</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0"></span>
              <span>
                Attracts sophisticated onchain investigators to the DAO
              </span>
            </li>
          </ul>
        </div>

        <div className="bg-gray-800/40 border border-gray-700/50 rounded-lg p-6 hover:border-gray-600 transition-all duration-200">
          <h3 className="text-lg font-medium text-white mb-3">
            Budget & Management
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-700/20 rounded-lg">
              <span className="text-gray-400">Total Allocation</span>
              <span className="text-white font-medium">400,000 ARB</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-700/20 rounded-lg">
              <span className="text-gray-400">Review Committee</span>
              <span className="text-white font-medium">3 Members</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-700/20 rounded-lg">
              <span className="text-gray-400">Program Duration</span>
              <span className="text-white font-medium">
                Until Funds Exhausted
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
