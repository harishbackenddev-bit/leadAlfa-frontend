import React from 'react';

export default function SettingsHeader({ activeTab, onTabChange }) {
  const mainTabs = [
    'Payment Settings',
    'Security & Access',
    'Notifications',
    'Availability',
    'Legal & Compliance'
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm">
      <h1 className="text-2xl font-extrabold font-anton text-gray-900 mb-4 p-4 mt-2">
        Settings
      </h1>
      
      {/* Main Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-0 sm:gap-4 md:gap-8 pl-4 sm:pl-6 px-2 border-b border-gray-200">
        {mainTabs.map((tab) => (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            className={`py-2 sm:pb-3 sm:pt-0 text-sm text-left sm:text-center transition-colors relative ${
              activeTab === tab
                ? 'text-gray-800'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab}
            {activeTab === tab && (
              <div className="hidden sm:block absolute bottom-0 left-0 right-0 h-[3px] bg-[#1E60DB]"></div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
