import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserFeedbackFilters from "./components/userFeedback/UserFeedbackFilters";
import UserFeedbackTable from "./components/userFeedback/UserFeedbackTable";
import { getUserFeedbackList } from "../../services/api/apiservices";
import { extractUserFeedbackListResponse } from "./components/userFeedback/userFeedbackMappers";

const PAGE_SIZE = 10;

const UserFeedback = () => {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchValue.trim());
    }, 300);

    return () => clearTimeout(timer);
  }, [searchValue]);

  const fetchReports = async (targetPage = page) => {
    try {
      setLoading(true);
      setError("");

      const response = await getUserFeedbackList({
        page: targetPage,
        limit: PAGE_SIZE,
        status: statusFilter === "all" ? undefined : statusFilter,
        type: typeFilter === "all" ? undefined : typeFilter,
        search: debouncedSearch || undefined,
      });

      const { items, pagination } = extractUserFeedbackListResponse(
        response,
        targetPage,
        PAGE_SIZE
      );

      setReports(items);
      setPage(pagination.page);
      setTotalPages(pagination.totalPages);
      setTotalItems(pagination.total);
    } catch (err) {
      setError(err?.message || err?.error || "Failed to fetch user feedback reports.");
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, typeFilter, debouncedSearch]);

  const handleView = (row) => {
    navigate(`/admin/user-feedback/${row.publicId}`, { state: { report: row } });
  };

  return (
    <div className="space-y-6 p-6 md:p-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
          User Feedback & Bug Reports
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Review, manage, and resolve feedback and bug reports submitted by authenticated users.
        </p>
      </div>

      <UserFeedbackFilters
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        typeFilter={typeFilter}
        onTypeChange={setTypeFilter}
        searchValue={searchValue}
        onSearchChange={setSearchValue}
      />

      <UserFeedbackTable rows={reports} loading={loading} onView={handleView} />

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      ) : null}

      <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
        <p className="text-sm text-gray-600">
          Showing page {page} of {totalPages} • Total reports: {totalItems}
        </p>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={loading || page <= 1}
            onClick={() => fetchReports(page - 1)}
            className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-700 disabled:cursor-not-allowed disabled:opacity-50 hover:bg-gray-50 transition-colors"
          >
            Previous
          </button>
          <button
            type="button"
            disabled={loading || page >= totalPages}
            onClick={() => fetchReports(page + 1)}
            className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-700 disabled:cursor-not-allowed disabled:opacity-50 hover:bg-gray-50 transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserFeedback;
