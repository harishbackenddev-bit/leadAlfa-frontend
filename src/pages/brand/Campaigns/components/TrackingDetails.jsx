import React from 'react';

const steps = [
  { title: 'Order Created', date: 'Jun 17 2025, 01:21:12' },
  { title: 'Shipment Details Edited', date: 'Jun 17 2025, 01:22:12' },
  { title: 'Label Generated', date: 'Jun 17 2025, 01:30:12' },
  { title: 'Pickup Scheduled', date: 'Jun 18 2025, 03:27:12' }
];

export default function TrackingDetails({ noContainer = false }) {
  const inner = (
    <div>
      <h3 className="text-2xl font-extrabold font-anton mb-6">Tracking Details</h3>

      <div className="relative">
        <div className="absolute left-0 right-0 top-7 h-px bg-transparent">
        </div>

        <div className="flex items-start gap-10 relative z-10">
          {steps.map((s, idx) => (
            <div key={idx} className="flex-1 text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full border-2 border-dashed border-blue-300 flex items-center justify-center">
                <div className="w-4 h-4 bg-blue-500 rounded-full" />
              </div>
              <div className="text-sm font-medium text-gray-800">{s.title}</div>
              <div className="text-xs text-gray-500 mt-2">{s.date}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  if (noContainer) return <div className="py-6">{inner}</div>;

  return <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mt-6">{inner}</div>;
}
