import React from 'react';
import shippingName from '../../../../assets/images/brands/Macbook.png';

const mockRows = [
  { id: '#12345645', name: 'Sarah Alex', sku: 'WH-0001', qty: '1 Quantity', date: 'Jun 26 2025', status: 'In-Transit' },
  { id: '#12345646', name: 'Max', sku: 'WH-0002', qty: '2 Quantity', date: 'Jun 26 2025', status: 'Fulfilled' },
  { id: '#12345647', name: 'Sam Johnson', sku: 'WH-0003', qty: '1 Quantity', date: 'Jun 26 2025', status: 'Delivered' }
];

const statusButton = (status) => {
  switch (status) {
    case 'In-Transit':
      return 'px-4 py-3 rounded-md bg-blue-600 text-white';
    case 'Fulfilled':
      return 'px-5 py-2.5 rounded-md bg-blue-50 text-blue-700 border-2 border-[#1E60DB]';
    case 'Delivered':
      return 'px-3.5 py-2.5 rounded-md bg-white text-gray-800 border-2 border-gray-800';
    default:
      return 'px-4 py-3 rounded-md bg-gray-50 text-gray-700';
  }
};

export default function ShippingDetails2({ rows = mockRows }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mt-8">
      <h3 className="text-2xl font-extrabold mb-6">Shipping Details</h3>

      <div className="rounded-xl overflow-hidden border border-gray-300">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100">
            <tr className="text-gray-400 text-sm border-b border-gray-300">
              <th className="py-4 px-6 w-1/5">Tracking ID</th>
              <th className="py-4 px-6 w-1/5">Name</th>
              <th className="py-4 px-6 w-1/5 text-left">Shipped On</th>
              <th className="py-4 px-6 w-1/5 text-left">Delivering Date</th>
              <th className="py-4 px-6 w-1/5 text-left">Status</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((r, idx) => (
              <tr key={idx} className="border-t border-gray-300">
                <td className="py-4 px-6 align-left w-1/5">
                  <a href="#" className="underline">{r.id}</a>
                </td>

                <td className="py-4 px-6 w-1/5 text-gray-800">{r.name}</td>
                <td className="py-4 px-6 w-1/5 text-left text-gray-700">{r.date}</td>

                <td className="py-4 px-6 w-1/5 text-left text-gray-700">{r.date}</td>

                <td className="py-4 px-6 w-1/5 text-left">
                  <button className={statusButton(r.status)}>{r.status}</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
