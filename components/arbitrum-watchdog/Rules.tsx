import React from 'react';
import { AlertCircle } from 'lucide-react';

export function ArbitrumWatchdogRules() {
  return (
    <div className="space-y-6 text-gray-300">
      <div className="flex items-center space-x-3 mb-6">
        <AlertCircle className="w-6 h-6 text-yellow-400" />
        <h2 className="text-xl font-semibold bg-gradient-to-r from-yellow-100 via-yellow-200 to-yellow-300 bg-clip-text text-transparent">
          Rules & Guidelines
        </h2>
      </div>

      <div className="space-y-8">
        <div className="bg-gray-800/40 border border-gray-700/50 rounded-lg p-6 hover:border-gray-600 transition-all duration-200">
          <h3 className="text-lg font-medium text-white mb-4">Submission Guidelines</h3>
          <div className="space-y-4">
            <div className="p-4 bg-gray-700/20 rounded-lg">
              <h4 className="text-white font-medium mb-2">Required Information</h4>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-start space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 mt-2 flex-shrink-0"></span>
                  <span>Detailed description of the fund misuse incident</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 mt-2 flex-shrink-0"></span>
                  <span>Transaction hashes and relevant addresses</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 mt-2 flex-shrink-0"></span>
                  <span>Step-by-step breakdown of the misuse pattern</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 mt-2 flex-shrink-0"></span>
                  <span>Supporting evidence (screenshots, logs, communications) in one report</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-gray-800/40 border border-gray-700/50 rounded-lg p-6 hover:border-gray-600 transition-all duration-200">
          <h3 className="text-lg font-medium text-white mb-4">Detailed Impact and Reward Classification</h3>
          <div className="space-y-4">
            <div className="p-4 border rounded-lg">
              <h4 className="text-orange-400 font-medium mb-2">High Impact Rewards</h4>
              <p className="text-gray-400">30k ARB + 5% of recovered funds capped at an additional $100k </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="text-blue-400 font-medium mb-2">Medium Impact Rewards</h4>
              <p className="text-gray-400">10k ARB base payout + 5% of recovered funds capped at an additional $20k</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="text-green-400 font-medium mb-2">Low Impact Rewards</h4>
              <p className="text-gray-400">1k ARB base payout + 5% of recovered funds capped at an additional $10k</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800/40 border border-gray-700/50 rounded-lg p-6 hover:border-gray-600 transition-all duration-200">
          <h3 className="text-lg font-medium text-white mb-4">Evaluation Process</h3>
          <div className="space-y-3">
            {[
              'Initial screening for completeness and relevance',
              'Detailed technical analysis of provided evidence',
              'Severity assessment by review committee',
              'Verification of fund tracking and impact',
              'Consensus requirement (2/3 reviewers)',
              'Private communication phase with involved parties',
              'Determination of recovery possibilities',
              'Final reward calculation and distribution'
            ].map((step, index) => (
              <div key={index} className="flex items-center space-x-3 text-gray-400">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center text-sm font-medium text-white">
                  {index + 1}
                </span>
                <span>{step}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}