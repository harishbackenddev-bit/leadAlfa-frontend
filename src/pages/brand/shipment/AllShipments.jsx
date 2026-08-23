import React, { useState, useMemo } from 'react';
import { mockShipments } from './shipments';
import { PaginationLeftIcon, PaginationRightIcon } from '../../../assets/SVGs/brands/customSVGs';

const statusClass = (status) => {
  switch (status) {
    case 'Active':
      return 'text-green-600 border-green-600 bg-green-50/50';
    case 'Inactive':
      return 'text-orange-600 border-orange-600 bg-orange-50/50';
    case 'Closed':
      return 'text-red-600 border-red-600 bg-red-50/50';
    default:
      return 'text-gray-600 border-gray-600 bg-gray-50/50';
  }
};

const Pagination = ({ total, page, perPage, onChange }) => {
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const pages = [];
  const maxVisible = 5;

  if (totalPages <= maxVisible) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    if (page <= 3) {
      for (let i = 1; i <= maxVisible; i++) pages.push(i);
    } else if (page >= totalPages - 2) {
      for (let i = totalPages - maxVisible + 1; i <= totalPages; i++) pages.push(i);
    } else {
      for (let i = page - 2; i <= page + 2; i++) pages.push(i);
    }
  }

  return (
    <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
      <div className="text-sm text-gray-600">
        Showing <span className="font-medium">{Math.min((page - 1) * perPage + 1, total)}</span> to{' '}
        <span className="font-medium">{Math.min(page * perPage, total)}</span> of{' '}
        <span className="font-medium">{total}</span>
      </div>
      
      <div className="flex items-center gap-2">
        <button
          onClick={() => onChange(Math.max(1, page - 1))}
          disabled={page === 1}
          className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${
            page === 1 ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-gray-100 text-gray-500'
          }`}
        >
          <PaginationLeftIcon />
        </button>

        {pages.map((p) => (
          <button
            key={p}
            onClick={() => onChange(p)}
            className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
              page === p ? 'bg-blue-600 text-white' : 'hover:bg-gray-100 text-gray-600'
            }`}
          >
            {p}
          </button>
        ))}

        <button
          onClick={() => onChange(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
          className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${
            page === totalPages ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-gray-100 text-gray-500'
          }`}
        >
          <PaginationRightIcon />
        </button>
      </div>
    </div>
  );
};

const ShipmentsTable = ({ shipments, itemsPerPage = 10 }) => {
  const [page, setPage] = useState(1);

  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const visible = useMemo(() => {
    return shipments.slice(startIndex, endIndex);
  }, [shipments, startIndex, endIndex]);

  return (
    <div className="w-full bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="py-4 px-6 text-left text-sm font-medium text-gray-500">ID</th>
              <th className="py-4 px-6 text-left text-sm font-medium text-gray-500">Shipping Name</th>
              <th className="py-4 px-6 text-left text-sm font-medium text-gray-500">SKU ID</th>
              <th className="py-4 px-6 text-left text-sm font-medium text-gray-500">Quantity</th>
              <th className="py-4 px-6 text-left text-sm font-medium text-gray-500">Shipment Date</th>
              <th className="py-4 px-6 text-left text-sm font-medium text-gray-500">Status</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((shipment, index) => (
              <tr
                key={`${shipment.id}-${index}`}
                className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
              >
                <td className="py-4 px-6 text-sm text-blue-600 underline cursor-pointer">{shipment.id}</td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <img
                      src={shipment.avatar}
                      alt={shipment.shippingName}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <span className="text-sm font-medium text-gray-900">{shipment.shippingName}</span>
                  </div>
                </td>
                <td className="py-4 px-6 text-sm text-gray-900">{shipment.skuId}</td>
                <td className="py-4 px-6 text-sm text-gray-600">{shipment.quantity}</td>
                <td className="py-4 px-6 text-sm text-gray-600">{shipment.shipmentDate}</td>
                <td className="py-4 px-6">
                  <span className={`inline-flex items-center justify-center px-4 py-1 text-sm font-medium border rounded-md ${statusClass(shipment.status)}`}>
                    {shipment.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination total={shipments.length} page={page} perPage={itemsPerPage} onChange={setPage} />
    </div>
  );
};

export default function AllShipments() {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [timeFilter, setTimeFilter] = useState('monthly');

  const filteredShipments = useMemo(() => {
    let filtered = mockShipments;

    // Filter by tab
    switch (activeTab) {
      case 'ongoing':
        filtered = filtered.filter((s) => s.status === 'Active');
        break;
      case 'closed':
        filtered = filtered.filter((s) => s.status === 'Closed');
        break;
      case 'all':
      default:
        break;
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter((s) =>
        s.shippingName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.skuId.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [activeTab, searchQuery]);

  const tabs = [
    { id: 'all', label: 'All Shipments' },
    { id: 'ongoing', label: 'On-going Shipments' },
    { id: 'closed', label: 'Closed Shipments' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-extrabold uppercase font-anton text-gray-900">
            MY SHIPMENTS
          </h1>
          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Search Shipments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
              />
            </div>

            {/* Time Filter Dropdown */}
            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
            >
              <option value="monthly">Monthly</option>
              <option value="weekly">Weekly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="flex gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-2.5 rounded-full text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <ShipmentsTable shipments={filteredShipments} />
      </div>
    </div>
  );
}
