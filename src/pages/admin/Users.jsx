import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import RequestManagementFilters from "./components/requestManagement/RequestManagementFilters";
import RequestManagementTable from "./components/requestManagement/RequestManagementTable";
import {
  approveCreatorProfileRequest,
  clarifyCreatorProfileRequest,
  deleteCreatorProfileRequest,
  getCreatorProfileRequests,
  rejectCreatorProfileRequest,
} from "../../services/api/apiservices";
import { extractCreatorRequestsResponse } from "./components/requestManagement/creatorRequestMappers";

const ADMIN_CREATOR_REQUESTS_CACHE_KEY = "admin_creator_requests_cache";
const PAGE_SIZE = 10;

const Users = () => {
  const navigate = useNavigate();
  const [activeType, setActiveType] = useState("creator");
  const [statusFilter, setStatusFilter] = useState("pending");
  const [searchValue, setSearchValue] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [activeModal, setActiveModal] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [modalInput, setModalInput] = useState("");

  const containerRef = useRef(null);

  const fetchRequests = async (targetPage = page) => {
    try {
      setLoading(true);
      setError("");

      const response = await getCreatorProfileRequests({
        status: statusFilter === "all" ? undefined : statusFilter,
        page: targetPage,
        limit: PAGE_SIZE,
      });

      const { items, pagination } = extractCreatorRequestsResponse(
        response,
        targetPage,
        PAGE_SIZE
      );

      setRequests(items);
      setPage(pagination.page);
      setTotalPages(pagination.totalPages);
      setTotalItems(pagination.total);
      sessionStorage.setItem(ADMIN_CREATOR_REQUESTS_CACHE_KEY, JSON.stringify(items));
    } catch (err) {
      setError(err?.message || err?.error || "Failed to fetch creator requests.");
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    fetchRequests(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const filteredRequests = useMemo(() => {
    const normalizedQuery = searchValue.trim().toLowerCase();

    return requests
      .filter((item) => item.type === activeType)
      .filter((item) => {
        if (!normalizedQuery) return true;

        const name = String(item?.name || "").toLowerCase();
        const email = String(item?.email || "").toLowerCase();

        return name.includes(normalizedQuery) || email.includes(normalizedQuery);
      });
  }, [requests, activeType, searchValue]);

  const handleToggleMenu = (rowId) => {
    setOpenMenuId((prev) => (prev === rowId ? null : rowId));
  };

  const runActionAndRefresh = async (rowId, actionRunner) => {
    try {
      setActionLoadingId(rowId);
      await actionRunner();
      await fetchRequests(page);
    } catch (err) {
      window.alert(err?.message || err?.error || "Action failed. Please try again.");
    } finally {
      setActionLoadingId(null);
    }
  };

  const openActionModal = (type, row) => {
    setSelectedRow(row);
    setActiveModal(type);
    setModalInput("");
  };

  const closeActionModal = () => {
    if (selectedRow?.id && actionLoadingId === selectedRow.id) return;
    setActiveModal(null);
    setSelectedRow(null);
    setModalInput("");
  };

  const handleModalConfirm = async () => {
    if (!selectedRow?.id) return;

    const rowId = selectedRow.id;
    const inputValue = modalInput.trim();

    if (activeModal === "reject") {
      if (!inputValue) return;
      await runActionAndRefresh(rowId, () => rejectCreatorProfileRequest(rowId, inputValue));
      closeActionModal();
      return;
    }

    if (activeModal === "request-info") {
      if (!inputValue) return;
      await runActionAndRefresh(rowId, () => clarifyCreatorProfileRequest(rowId, inputValue));
      closeActionModal();
      return;
    }

    if (activeModal === "delete") {
      await runActionAndRefresh(rowId, () => deleteCreatorProfileRequest(rowId));
      closeActionModal();
    }
  };

  const handleAction = async (action, row) => {
    setOpenMenuId(null);

    if (action === "view") {
      navigate(`/admin/users/${row.id}`, { state: { request: row } });
      return;
    }

    if (action === "approve") {
      await runActionAndRefresh(row.id, () => approveCreatorProfileRequest(row.id));
      return;
    }

    if (action === "reject") {
      openActionModal("reject", row);
      return;
    }

    if (action === "send-email") {
      openActionModal("request-info", row);
      return;
    }

    if (action === "delete") {
      openActionModal("delete", row);
    }
  };

  return (
    <div ref={containerRef} className="space-y-6 p-6 md:p-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-gray-900">Request Management</h1>
        <p className="mt-2 text-sm text-gray-500">
          Review and manage creator profile approval requests
        </p>
      </div>

      <RequestManagementFilters
        activeType={activeType}
        onTypeChange={setActiveType}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        searchValue={searchValue}
        onSearchChange={setSearchValue}
      />

      <RequestManagementTable
        rows={filteredRequests}
        openMenuId={openMenuId}
        onToggleMenu={handleToggleMenu}
        onAction={handleAction}
        loading={loading}
        actionLoadingId={actionLoadingId}
      />

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

      {activeModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-[28px] bg-white p-7 md:p-8">
            <h2 className="font-['Manrope:Bold',sans-serif] text-[22px] text-[#1a1a1a] mb-3">
              {activeModal === "reject"
                ? "Reject Application"
                : activeModal === "request-info"
                ? "Request More Information"
                : "Delete User Request"}
            </h2>

            {activeModal === "delete" ? (
              <p className="font-['Manrope:Regular',sans-serif] text-[14px] text-[#64748b] mb-4">
                Are you sure you want to delete this user request? This action cannot be undone.
              </p>
            ) : (
              <>
                <p className="font-['Manrope:Regular',sans-serif] text-[14px] text-[#64748b] mb-4">
                  {activeModal === "reject"
                    ? "Please provide a reason for rejecting this application:"
                    : "Send a message to the applicant requesting additional information:"}
                </p>
                <textarea
                  value={modalInput}
                  onChange={(event) => setModalInput(event.target.value)}
                  placeholder={
                    activeModal === "reject"
                      ? "Enter rejection reason..."
                      : "Enter your message..."
                  }
                  rows={6}
                  className="w-full px-4 py-3 border border-[#e5e7eb] rounded-[8px] font-['Manrope:Regular',sans-serif] text-[14px] text-[#1a1a1a] placeholder:text-[#94a3b8] focus:outline-none focus:border-[#0353a4] focus:ring-2 focus:ring-[#0353a4]/20 resize-none"
                />
              </>
            )}

            <div className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-2">
              <button
                type="button"
                onClick={closeActionModal}
                disabled={selectedRow?.id && actionLoadingId === selectedRow.id}
                className="flex-1 h-[48px] border border-[#e5e7eb] rounded-[8px] font-['Manrope:Medium',sans-serif] text-[14px] text-[#64748b] hover:bg-[#f8f9fb] transition-colors disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleModalConfirm}
                disabled={
                  (selectedRow?.id && actionLoadingId === selectedRow.id) ||
                  ((activeModal === "reject" || activeModal === "request-info") &&
                    !modalInput.trim())
                }
                className={`flex-1 h-[48px] rounded-[8px] font-['Manrope:Medium',sans-serif] text-[14px] text-white hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed ${
                  activeModal === "request-info"
                    ? "bg-gradient-to-b from-[#0353a4] to-[#4b96e3]"
                    : "bg-gradient-to-b from-[#dc2626] to-[#b91c1c]"
                }`}
              >
                {selectedRow?.id && actionLoadingId === selectedRow.id
                  ? "Please wait..."
                  : activeModal === "reject"
                  ? "Reject Application"
                  : activeModal === "request-info"
                  ? "Send Request"
                  : "Delete User"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Users;
