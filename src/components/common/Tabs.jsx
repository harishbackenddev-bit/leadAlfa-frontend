import React from 'react';

export default function Tabs({
  tabs = [],
  activeTab,
  onChange,
  className = '',
  activeClassName,
  inactiveClassName,
}) {
  const defaultActive = 'bg-blue-600 text-white shadow-md';
  const defaultInactive = 'text-gray-500 hover:text-gray-700 hover:bg-gray-50';

  return (
    <div className={`flex items-center bg-white p-1 rounded-full border border-gray-200 shadow-sm overflow-x-auto max-w-full ${className}`}>
      {tabs.map((t) => {
        const label = typeof t === 'string' ? t : t.label;
        const key = typeof t === 'string' ? t : t.key || t.id || t.label;
        const isActive = activeTab === key || activeTab === label;

        const btnClass = `px-6 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
          isActive ? (activeClassName || defaultActive) : (inactiveClassName || defaultInactive)
        }`;

        return (
          <button key={key} onClick={() => onChange && onChange(key)} className={btnClass}>
            {label}
          </button>
        );
      })}
    </div>
  );
}
