import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BookCallRequestFilters from "./components/bookCallRequests/BookCallRequestFilters";
import BookCallRequestTable from "./components/bookCallRequests/BookCallRequestTable";
import { getBookCallAdminErrorMessage } from "../../constants/bookCallRequest";
import { getBookCallRequests } from "../../services/api/apiservices";
import { extractBookCallRequestsResponse } from "./components/bookCallRequests/bookCallRequestMappers";

const PAGE_SIZE = 10;

const BookCallRequests = () => {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [accessDenied, setAccessDenied] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchValue.trim());
    }, 300);

    return () => clearTimeout(timer);
  }, [searchValue]);

  const fetchRequests = async (targetPage = page) => {
    try {
      setLoading(true);
      setError("");
      setAccessDenied(false);

      const response = await getBookCallRequests({
        page: targetPage,
        limit: PAGE_SIZE,
        status: statusFilter === "all" ? undefined : statusFilter,
        search: debouncedSearch || undefined,
      });

      const { items, pagination } = extractBookCallRequestsResponse(
        response,
        targetPage,
        PAGE_SIZE
      );

      setRequests(items);
      setPage(pagination.page);
      setTotalPages(pagination.totalPages);
      setTotalItems(pagination.total);
    } catch (err) {
      if (err?.status === 403) {
        setAccessDenied(true);
        setError("");
      } else {
        setError(getBookCallAdminErrorMessage(err, "Failed to fetch call requests."));
      }
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, debouncedSearch]);

  const handleView = (row) => {
    navigate(`/admin/book-call-requests/${row.publicId}`, { state: { request: row } });
  };

  if (accessDenied) {
    return (
      <div className="space-y-6 p-6 md:p-8">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
            Call Requests
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Review and manage discovery calls submitted from the Book a Call page.
          </p>
        </div>
        <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-10 text-center">
          <h2 className="text-lg font-semibold text-red-700">Access Denied</h2>
          <p className="mt-2 text-sm text-red-600">
            You do not have permission to manage book a call requests.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 md:p-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
          Call Requests
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Review and manage discovery calls submitted from the Book a Call page.
        </p>
      </div>

      <BookCallRequestFilters
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        searchValue={searchValue}
        onSearchChange={setSearchValue}
      />

      <BookCallRequestTable rows={requests} loading={loading} onView={handleView} />

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      ) : null}

      <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3">
        <p className="text-sm text-gray-600">
          Showing page {page} of {totalPages} • Total requests: {totalItems}
        </p>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={loading || page <= 1}
            onClick={() => fetchRequests(page - 1)}
            className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Previous
          </button>
          <button
            type="button"
            disabled={loading || page >= totalPages}
            onClick={() => fetchRequests(page + 1)}
            className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookCallRequests;
