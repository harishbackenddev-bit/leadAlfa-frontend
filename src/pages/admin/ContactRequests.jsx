import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ContactRequestFilters from "./components/contactRequests/ContactRequestFilters";
import ContactRequestTable from "./components/contactRequests/ContactRequestTable";
import { getContactRequests } from "../../services/api/apiservices";
import { extractContactRequestsResponse } from "./components/contactRequests/contactRequestMappers";

const PAGE_SIZE = 10;

const ContactRequests = () => {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState("all");
  const [inquiryTypeFilter, setInquiryTypeFilter] = useState("all");
  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [requests, setRequests] = useState([]);
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

  const fetchRequests = async (targetPage = page) => {
    try {
      setLoading(true);
      setError("");

      const response = await getContactRequests({
        page: targetPage,
        limit: PAGE_SIZE,
        status: statusFilter === "all" ? undefined : statusFilter,
        inquiryType: inquiryTypeFilter === "all" ? undefined : inquiryTypeFilter,
        search: debouncedSearch || undefined,
      });

      const { items, pagination } = extractContactRequestsResponse(
        response,
        targetPage,
        PAGE_SIZE
      );

      setRequests(items);
      setPage(pagination.page);
      setTotalPages(pagination.totalPages);
      setTotalItems(pagination.total);
    } catch (err) {
      setError(err?.message || err?.error || "Failed to fetch contact requests.");
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, inquiryTypeFilter, debouncedSearch]);

  const handleView = (row) => {
    navigate(`/admin/contact-requests/${row.publicId}`, { state: { request: row } });
  };

  return (
    <div className="space-y-6 p-6 md:p-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
          Contact Requests
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Review and manage messages submitted from the public Contact Us page.
        </p>
      </div>

      <ContactRequestFilters
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        inquiryTypeFilter={inquiryTypeFilter}
        onInquiryTypeChange={setInquiryTypeFilter}
        searchValue={searchValue}
        onSearchChange={setSearchValue}
      />

      <ContactRequestTable rows={requests} loading={loading} onView={handleView} />

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

export default ContactRequests;
