import React, { useState } from 'react';
import proposals from './allProposals';
import withPagination from '../../../../components/common/withPagination';
import { PaginationLeftIcon, PaginationRightIcon } from '../../../../assets/SVGs/brands/customSVGs';
import CampaignsNav from '../components/CampaignsNav';

function ProposalsTable({ items = [] }) {
  return (
    <table className="min-w-full text-left">
      <thead className="bg-gray-50">
        <tr className="text-sm text-gray-500">
          <th className="px-6 py-3 first:rounded-tl-lg">ID</th>
          <th className="px-6 py-3">Name</th>
          <th className="px-6 py-3">Total Price</th>
          <th className="px-6 py-3">Start Date</th>
          <th className="px-6 py-3 last:rounded-tr-lg">Status</th>
        </tr>
      </thead>
      <tbody>
        {items.map((row) => (
          <tr key={row.id} className="border-t border-gray-100">
            <td className="px-6 py-4 text-sm text-[#1E60DB] underline">{row.orderId}</td>
            <td className="px-6 py-4 text-sm text-gray-700">{row.name}</td>
            <td className="px-6 py-4 text-sm text-gray-700">{row.totalPrice}</td>
            <td className="px-6 py-4 text-sm text-gray-700">{row.startDate}</td>
            <td className="px-6 py-4">
              <span className={`inline-block px-3 py-1 text-sm font-medium rounded-lg ${row.status === 'Declined' ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-pink-50 text-pink-600 border border-pink-200'}`}>
                {row.status}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

const PaginatedProposals = withPagination(ProposalsTable, 6, 'w-full');

export default function AllProposals() {
  const [activeTab, setActiveTab] = useState('sent');

  const filtered = proposals.filter((p) => {
    if (activeTab === 'sent') return p.status === 'Offer Sent';
    return p.status === 'Declined';
  });

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <CampaignsNav />

        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm mt-4">
          <div className="mb-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setActiveTab('sent')}
                className={`px-4 py-2 rounded-full text-sm ${activeTab === 'sent' ? 'bg-[#1E60DB] text-white' : 'bg-white border border-gray-200 text-gray-600'}`}>
                Sent Offers
              </button>
              <button
                onClick={() => setActiveTab('declined')}
                className={`px-4 py-2 rounded-full text-sm ${activeTab === 'declined' ? 'bg-white text-gray-700 border border-gray-200' : 'bg-white border border-gray-200 text-gray-600'}`}>
                Declined Offers
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead>
                <tr className="text-sm text-gray-500">
                  <th className="px-6 py-3">ID</th>
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Total Price</th>
                  <th className="px-6 py-3">Start Date</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((row) => (
                  <tr key={row.id} className="border-t border-gray-100">
                    <td className="px-6 py-4 text-sm text-[#1E60DB] underline">{row.orderId}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{row.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{row.totalPrice}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{row.startDate}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-3 py-1 text-sm font-medium rounded-lg ${row.status === 'Declined' ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-pink-50 text-pink-600 border border-pink-200'}`}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex items-center justify-center gap-3">
            <button className="w-9 h-9 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-500">
              <PaginationLeftIcon className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2">
              <button className="w-8 h-8 rounded-full bg-[#1E60DB] text-white">1</button>
              <button className="w-8 h-8 rounded-full bg-white border border-gray-200 text-gray-600">2</button>
              <button className="w-8 h-8 rounded-full bg-white border border-gray-200 text-gray-600">3</button>
              <button className="w-8 h-8 rounded-full bg-white border border-gray-200 text-gray-600">4</button>
              <button className="w-8 h-8 rounded-full bg-white border border-gray-200 text-gray-600">5</button>
            </div>
            <button className="w-9 h-9 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-500">
              <PaginationRightIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
