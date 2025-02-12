import React from 'react';
import { Target, AlertTriangle } from 'lucide-react';

export function ArbitrumWatchdogScope() {
  return (
    <div className="space-y-6 text-gray-300">
      <div className="flex items-center space-x-3 mb-6">
        <Target className="w-6 h-6 text-green-400" />
        <h2 className="text-xl font-semibold bg-gradient-to-r from-green-100 via-green-200 to-green-300 bg-clip-text text-transparent">
          Program Coverage & Scope
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-gray-800/40 border border-gray-700/50 rounded-lg p-6 hover:border-gray-600 transition-all duration-200">
          <h3 className="text-lg font-medium text-white mb-3">Covered Programs</h3>
          <ul className="space-y-2 text-gray-400">
            {['Questbook Domain allocations', 
              'Stylus Sprint initiatives',
              'Arbitrum Foundation grants',
              'All incentive programs'].map((item, index) => (
              <li key={index} className="flex items-start space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 flex-shrink-0"></span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="bg-gray-800/40 border border-gray-700/50 rounded-lg p-6 hover:border-gray-600 transition-all duration-200">
          <h3 className="text-lg font-medium text-white mb-3">Fund Misuse Definition</h3>
          <ul className="space-y-2 text-gray-400">
            {['Stated terms of allocation',
              'Project objectives',
              'Agreement conditions',
              'Overall spirit of allocation'].map((item, index) => (
              <li key={index} className="flex items-start space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 flex-shrink-0"></span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-gray-800/40 border border-gray-700/50 rounded-lg p-6 hover:border-gray-600 transition-all duration-200">
          <h3 className="text-lg font-medium text-white mb-3">Qualifying Activities</h3>
          <div className="space-y-4">
            <div className="p-4 bg-gray-700/20 rounded-lg">
              <h4 className="text-white font-medium mb-2">Fund Misappropriation</h4>
              <p className="text-gray-400">Unauthorized use or diversion of allocated funds, including but not limited to personal use, unauthorized projects, or undisclosed activities.</p>
            </div>
            <div className="p-4 bg-gray-700/20 rounded-lg">
              <h4 className="text-white font-medium mb-2">False Reporting</h4>
              <p className="text-gray-400">Fabrication of progress reports, milestones, or deliverables to obtain or retain funding.</p>
            </div>
            <div className="p-4 bg-gray-700/20 rounded-lg">
              <h4 className="text-white font-medium mb-2">Incentive Gaming</h4>
              <p className="text-gray-400">Manipulation of incentive programs through artificial activity, collusion, or exploitation of program mechanics.</p>
            </div>
          </div>
        </div>

        <div className="col-span-1 lg:col-span-3 bg-gray-800/40 border border-gray-700/50 rounded-lg p-6 hover:border-gray-600 transition-all duration-200">
          <div className="flex items-center space-x-3 mb-4">
            <AlertTriangle className="w-5 h-5 text-yellow-500" />
            <h3 className="text-lg font-medium text-white">Severity Levels & Rewards</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-gray-700/20 rounded-lg border border-gray-600/30">
              <h4 className="text-green-400 font-medium mb-2">Low Severity</h4>
              <p className="text-gray-400 mb-3">Minor misuse with limited impact on DAO&apos;s financial health or reputation.</p>
            </div>
            <div className="p-4 bg-gray-700/20 rounded-lg border border-gray-600/30">
              <h4 className="text-yellow-400 font-medium mb-2">Medium Severity</h4>
              <p className="text-gray-400 mb-3">Significant misuse impacting DAO resources, but potentially recoverable.</p>
            </div>
            <div className="p-4 bg-gray-700/20 rounded-lg border border-gray-600/30">
              <h4 className="text-red-400 font-medium mb-2">High Severity</h4>
              <p className="text-gray-400 mb-3">Large-scale, deliberate misuse of DAO-allocated funds.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}