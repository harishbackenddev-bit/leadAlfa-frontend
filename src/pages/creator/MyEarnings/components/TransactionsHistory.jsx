import React, { useEffect, useState } from "react";
import { getCreatorTransactions } from "../../../../services/api/apiservices";

const STATUS_COLORS = {
  CREATED: "bg-gray-100 text-gray-700",
  FUNDED: "bg-blue-100 text-blue-700",
  PAYOUT_TRIGGERED: "bg-yellow-100 text-yellow-700",
  RELEASED: "bg-emerald-100 text-emerald-700",
  COMPLETED: "bg-emerald-100 text-emerald-700",
  FAILED: "bg-red-100 text-red-700",
};

export default function TransactionsHistory({ transactions = [] }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [filterBy, setFilterBy] = useState("Monthly");

  // ✅ Real data state
  const [historyData, setHistoryData] = useState({
    transactions: [],
    total: 0,
    totalPages: 1,
    page: 1,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Fetch transactions
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const res = await getCreatorTransactions({
          page: currentPage,
          limit: itemsPerPage,
        });

        const data = res?.data || res;

        console.log("📊 Transaction history:", data);

        setHistoryData({
          transactions: data?.transactions || [],
          total: data?.total || 0,
          totalPages: data?.totalPages || 1,
          page: data?.page || 1,
        });
      } catch (err) {
        console.error("Failed to load transactions:", err);
        setError(err?.message || "Failed to load transactions");
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, [currentPage, itemsPerPage, filterBy]);

  const totalItems = historyData.total;
  const totalPages = historyData.totalPages;

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Format date
  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-ZA", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Get status label
  const getStatusLabel = (status) => {
    if (!status) return "—";
    return status
      .split("_")
      .map((w) => w.charAt(0) + w.slice(1).toLowerCase())
      .join(" ");
  };

  return (
    <div className="bg-white rounded-xl p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900">
          Transactions History
        </h2>
        <div className="flex items-center gap-3 sm:gap-4">
          <span className="text-sm sm:text-base text-gray-600">Filter by</span>
          <div className="relative">
            <select
              value={filterBy}
              onChange={(e) => {
                setFilterBy(e.target.value);
                setCurrentPage(1);
              }}
              className="appearance-none px-4 sm:px-6 py-2 sm:py-3 pr-10 sm:pr-12 text-gray-500 bg-[#F5F5F5] rounded-full text-sm sm:text-base focus:outline-none cursor-pointer"
            >
              <option value="Monthly">Monthly</option>
              <option value="Weekly">Weekly</option>
              <option value="Daily">Daily</option>
              <option value="Yearly">Yearly</option>
            </select>
            <svg
              className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none"
              width="12"
              height="8"
              viewBox="0 0 12 8"
              fill="none"
            >
              <path
                d="M1 1.5L6 6.5L11 1.5"
                stroke="#9CA3AF"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-t-xl border border-gray-200 border-b-0">
        <table className="w-full min-w-[600px]">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">
                Transaction ID
              </th>
              <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">
                Campaign / Brand
              </th>
              <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">
                Date
              </th>
              <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">
                Status
              </th>
              <th className="text-right py-4 px-4 text-sm font-medium text-gray-500">
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {/* Loading */}
            {isLoading ? (
              <tr>
                <td colSpan="5" className="py-8 text-center text-gray-400">
                  Loading transactions...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="5" className="py-8 text-center text-red-500">
                  {error}
                </td>
              </tr>
            ) : historyData.transactions.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-8 text-center text-gray-400">
                  No transactions yet.
                </td>
              </tr>
            ) : (
              historyData.transactions.map((tx) => (
                <tr key={tx.id} className="border-b border-gray-100">
                  <td className="py-4 px-4">
                    <span className="text-sm text-gray-600 underline cursor-pointer hover:text-blue-800">
                      {tx.reference || tx.id?.slice(0, 8) || "—"}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        {tx.campaignTitle || "—"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {tx.brandName || "—"}
                      </p>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm text-gray-600">
                      {formatDate(tx.createdAt)}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        STATUS_COLORS[tx.status] || "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {getStatusLabel(tx.status)}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <span className="text-sm font-medium text-gray-800">
                      R {Number(tx.creatorNet || 0).toFixed(2)}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-3 bg-gray-50 rounded-b-xl border border-gray-200">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Showing</span>
          <div className="relative">
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="appearance-none px-4 py-1.5 pr-10 border border-gray-300 rounded-lg text-sm text-gray-600 focus:outline-none cursor-pointer bg-white"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
            <svg
              className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
              width="12"
              height="8"
              viewBox="0 0 12 8"
              fill="none"
            >
              <path
                d="M1 1.5L6 6.5L11 1.5"
                stroke="#9CA3AF"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span className="text-sm text-gray-500">of {totalItems}</span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
          >
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>

          {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(
            (page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                  currentPage === page
                    ? "bg-[#0c7bb3] text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {page}
              </button>
            )
          )}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
          >
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}