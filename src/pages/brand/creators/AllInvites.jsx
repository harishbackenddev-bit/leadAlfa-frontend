import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "../../../components/ui/button";
import SendInviteModal from "./components/SendInviteModal";
import SentInvitesTable from "./components/SentInvitesTable";
import {
  getBrandInvitationsQueryOptions,
  withdrawBrandInvitationMutation,
} from "../../../services/tanstack/queryService";
import { useNotification } from "../../../context/NotificationContext";
import { mapBrandInvitationToRow, parseApiError } from "./invitationsMapper";

const ITEMS_PER_PAGE = 10;
const STATUS_FILTERS = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "accepted", label: "Accepted" },
  { value: "declined", label: "Declined" },
];

export default function AllInvites() {
  const { showNotification } = useNotification();

  const [sendModalOpen, setSendModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");

  const apiStatus = statusFilter === "all" ? undefined : statusFilter;

  const {
    data: response,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useQuery(
    getBrandInvitationsQueryOptions({
      status: apiStatus,
      page,
      limit: ITEMS_PER_PAGE,
    })
  );

  const invitations = useMemo(() => {
    const list = response?.invitations || [];
    return list.map(mapBrandInvitationToRow);
  }, [response]);

  const pagination = response?.pagination || {
    totalItems: invitations.length,
    totalPages: 1,
    currentPage: 1,
  };

  /* -------------------- withdraw mutation -------------------- */
  const { mutate: withdrawInvite, isPending: isWithdrawing } = useMutation({
    ...withdrawBrandInvitationMutation(),
    onSuccess: () => {
      showNotification({
        type: "success",
        message: "Invitation withdrawn",
        description: "The invitation has been removed.",
      });
    },
    onError: (error) => {
      showNotification({
        type: "error",
        message: "Could not withdraw invitation",
        description: parseApiError(error, "Please try again later."),
      });
    },
  });

  const handleTableAction = (action, record) => {
    if (!record?.publicId) return;
    if (action === "withdraw") {
      withdrawInvite(record.publicId);
    }
  };

  const handleStatusFilterChange = (next) => {
    setStatusFilter(next);
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <div className="mx-auto max-w-[1920px] px-4 py-6 sm:px-6 lg:px-8">
        <Link
          to="/brand/creators"
          className="mb-4 inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700"
        >
          ← Back to Creators
        </Link>

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-xl font-extrabold text-gray-900 sm:text-2xl lg:text-3xl">
              Sent Invites
            </h1>
            <p className="mt-1 text-sm text-gray-500 sm:text-base">
              Track all invitations sent to creators
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            className="gap-2 self-start rounded-xl border-[#0c7bb3] text-[#0c7bb3] hover:bg-blue-50"
            onClick={() => setSendModalOpen(true)}
          >
            <Plus className="h-4 w-4" aria-hidden />
            Send Invite
          </Button>
        </div>

        <div className="mb-4 flex flex-wrap items-center gap-2">
          {STATUS_FILTERS.map((filter) => {
            const isActive = statusFilter === filter.value;
            return (
              <button
                key={filter.value}
                type="button"
                onClick={() => handleStatusFilterChange(filter.value)}
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors sm:text-sm ${
                  isActive
                    ? "border-[#0c7bb3] bg-[#0c7bb3] text-white"
                    : "border-gray-200 bg-white text-gray-600 hover:border-[#0c7bb3] hover:text-[#0c7bb3]"
                }`}
              >
                {filter.label}
              </button>
            );
          })}
        </div>

        {isError ? (
          <div className="flex flex-col items-center gap-3 rounded-xl border border-gray-200 bg-white py-12 text-center">
            <p className="text-sm text-gray-600">
              Failed to load invitations.
            </p>
            <Button
              type="button"
              variant="outline"
              onClick={() => refetch()}
              className="rounded-xl"
            >
              Retry
            </Button>
          </div>
        ) : (
          <SentInvitesTable
            invitations={invitations}
            currentPage={pagination.currentPage || page}
            totalPages={Math.max(1, pagination.totalPages || 1)}
            totalItems={pagination.totalItems ?? invitations.length}
            itemsPerPage={ITEMS_PER_PAGE}
            isLoading={isLoading || isFetching}
            isProcessing={isWithdrawing}
            onPageChange={setPage}
            onAction={handleTableAction}
          />
        )}
      </div>

      <SendInviteModal
        open={sendModalOpen}
        onClose={() => setSendModalOpen(false)}
      />
    </div>
  );
}
