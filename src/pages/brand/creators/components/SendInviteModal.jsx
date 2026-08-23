import React, { useEffect, useMemo, useState } from "react";
import { Modal } from "antd";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Loader2,
  X,
} from "lucide-react";
import { Button } from "../../../../components/ui/button";
import CreatorPickerList from "./CreatorPickerList";
import {
  getBrandCreatorsQueryOptions,
  getCampaignsQueryOptions,
  sendCampaignInvitationsMutation,
} from "../../../../services/tanstack/queryService";
import { useNotification } from "../../../../context/NotificationContext";
import {
  extractConflictingCreatorIds,
  humanizeApiError,
  mapCampaignToOption,
  mapCreatorToPickerOption,
  parseApiError,
} from "../invitationsMapper";

const CREATORS_FETCH_LIMIT = 100;
const CAMPAIGNS_FETCH_LIMIT = 100;
const SUCCESS_AUTOCLOSE_MS = 1400;

export default function SendInviteModal({
  open,
  onClose,
  presetCampaignId,
  presetCreatorId,
}) {
  const { showNotification } = useNotification();

  const [bulkMode, setBulkMode] = useState(false);
  const [campaignId, setCampaignId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [conflictIds, setConflictIds] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");

  /* -------------------- live data -------------------- */
  const { data: campaignsResp, isLoading: isCampaignsLoading } = useQuery({
    ...getCampaignsQueryOptions({ page: 1, limit: CAMPAIGNS_FETCH_LIMIT }),
    enabled: open,
  });

  const { data: creatorsResp, isLoading: isCreatorsLoading } = useQuery({
    ...getBrandCreatorsQueryOptions({
      page: 1,
      limit: CREATORS_FETCH_LIMIT,
    }),
    enabled: open,
  });

  const campaignOptions = useMemo(() => {
    const list =
      campaignsResp?.campaigns ||
      campaignsResp?.data?.campaigns ||
      campaignsResp ||
      [];
    if (!Array.isArray(list)) return [];
    return list.map(mapCampaignToOption).filter((opt) => opt.value);
  }, [campaignsResp]);

  const creatorOptions = useMemo(() => {
    const list =
      creatorsResp?.creators ||
      creatorsResp?.data?.creators ||
      creatorsResp ||
      [];
    if (!Array.isArray(list)) return [];
    return list.map(mapCreatorToPickerOption).filter((opt) => opt.id);
  }, [creatorsResp]);

  // id -> display name lookup, used to humanize backend error messages
  // (backend says "Creator with ID 50", brands need "User One").
  const creatorIdToName = useMemo(() => {
    const map = new Map();
    creatorOptions.forEach((c) => {
      if (c?.id != null) map.set(Number(c.id), c.name);
    });
    return map;
  }, [creatorOptions]);

  /* -------------------- preset support -------------------- */
  useEffect(() => {
    if (!open) return;
    if (presetCampaignId) setCampaignId(String(presetCampaignId));
    if (presetCreatorId) setSelectedIds([Number(presetCreatorId)]);
  }, [open, presetCampaignId, presetCreatorId]);

  /* -------------------- mutation -------------------- */
  const { mutate: sendInvites, isPending: isSending } = useMutation({
    ...sendCampaignInvitationsMutation(),
    onSuccess: (data) => {
      const count = data?.invitations?.length ?? selectedIds.length;
      const apiMessage =
        typeof data?.message === "string" && data.message.trim()
          ? data.message
          : count > 1
            ? `Successfully sent ${count} invitations.`
            : "Invitation sent successfully. The creator has been notified.";

      setErrorMessage("");
      setConflictIds([]);
      setSuccessMessage(apiMessage);

      showNotification({
        type: "success",
        message: count > 1 ? "Invitations sent!" : "Invitation sent!",
        description: apiMessage,
      });
    },
    onError: (error) => {
      const rawMessage = parseApiError(error, "Failed to send invitation.");
      // Find IDs first (regex needs them before they're swapped for names)
      const conflicts = extractConflictingCreatorIds(rawMessage);
      // Then rewrite "Creator with ID 50" → "<Creator Name>"
      const friendlyMessage = humanizeApiError(rawMessage, creatorIdToName);
      setSuccessMessage("");
      setErrorMessage(friendlyMessage);
      setConflictIds(conflicts);
      showNotification({
        type: "error",
        message: "Could not send invitation",
        description: friendlyMessage,
      });
    },
  });

  // After success: keep the success banner visible briefly so the brand
  // sees the confirmation, then auto-close. Cleared on unmount/re-open.
  useEffect(() => {
    if (!successMessage || !open) return undefined;
    const timer = setTimeout(() => {
      handleClose();
    }, SUCCESS_AUTOCLOSE_MS);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [successMessage, open]);

  /* -------------------- helpers -------------------- */
  const resetForm = () => {
    setBulkMode(false);
    setCampaignId("");
    setSearchQuery("");
    setSelectedIds([]);
    setMessage("");
    setErrorMessage("");
    setConflictIds([]);
    setSuccessMessage("");
  };

  const handleClose = () => {
    if (isSending) return;
    resetForm();
    onClose?.();
  };

  const isLocked = isSending || Boolean(successMessage);

  // Clear inline error whenever the user changes input that could resolve it.
  const clearError = () => {
    if (errorMessage) setErrorMessage("");
    if (conflictIds.length) setConflictIds([]);
  };

  const handleCampaignChange = (e) => {
    setCampaignId(e.target.value);
    clearError();
  };

  const handleToggleCreator = (id, mode) => {
    clearError();
    if (mode === "bulk") {
      setSelectedIds((prev) =>
        prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
      );
      return;
    }
    setSelectedIds([id]);
  };

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
    if (errorMessage) setErrorMessage("");
  };

  const handleRemoveConflicts = () => {
    if (conflictIds.length === 0) return;
    setSelectedIds((prev) => prev.filter((id) => !conflictIds.includes(Number(id))));
    setErrorMessage("");
    setConflictIds([]);
  };

  const handleSend = () => {
    if (!campaignId) {
      setErrorMessage("Please select a campaign.");
      return;
    }
    if (selectedIds.length === 0) {
      setErrorMessage(
        bulkMode ? "Please select at least one creator." : "Please select a creator."
      );
      return;
    }
    if (isSending) return;

    setErrorMessage("");
    setConflictIds([]);
    sendInvites({
      campaignId,
      creatorIds: selectedIds.map((id) => Number(id)),
      customMessage: message,
    });
  };

  const canSend =
    Boolean(campaignId) && selectedIds.length > 0 && !isLocked;

  return (
    <Modal
      open={open}
      onCancel={handleClose}
      footer={null}
      width={560}
      centered
      closable={false}
      destroyOnClose
      maskClosable={!isLocked}
      className="send-invite-modal"
    >
      <div className="px-1 pb-1 pt-2">
        <div className="mb-5 flex items-start justify-between gap-3">
          <div>
            <h2 className="font-anton text-xl font-extrabold text-gray-900">
              Send Invite
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              {bulkMode
                ? "Select multiple creators for bulk invite"
                : "Select a creator to send invitation"}
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="rounded-full p-1 text-gray-500 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Close"
            disabled={isLocked}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {bulkMode && !successMessage ? (
          <div className="mb-4 flex items-center gap-2 rounded-xl bg-blue-50 px-3 py-2.5 text-sm text-blue-700">
            <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden />
            Bulk Invite Mode Enabled — Selected {selectedIds.length} creator
            {selectedIds.length === 1 ? "" : "s"}
          </div>
        ) : null}

        {successMessage ? (
          <div
            role="status"
            aria-live="polite"
            className="mb-4 flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-sm text-emerald-700"
          >
            <CheckCircle2
              className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500"
              aria-hidden
            />
            <div className="min-w-0 flex-1">
              <p className="font-semibold leading-5">{successMessage}</p>
              <p className="mt-0.5 text-xs text-emerald-600">
                Closing automatically...
              </p>
            </div>
          </div>
        ) : null}

        {errorMessage && !successMessage ? (
          <div
            role="alert"
            className="mb-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700"
          >
            <AlertCircle
              className="mt-0.5 h-4 w-4 shrink-0 text-red-500"
              aria-hidden
            />
            <div className="min-w-0 flex-1">
              <p className="font-medium leading-5">{errorMessage}</p>
              {conflictIds.length > 0 ? (
                <button
                  type="button"
                  onClick={handleRemoveConflicts}
                  className="mt-1 inline-flex items-center text-xs font-semibold text-red-700 underline hover:text-red-800"
                >
                  Remove the conflicting creator
                  {conflictIds.length === 1 ? "" : "s"} from selection
                </button>
              ) : null}
            </div>
          </div>
        ) : null}

        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Select Campaign <span className="text-red-500">*</span>
            </label>
            <select
              value={campaignId}
              onChange={handleCampaignChange}
              disabled={
                isLocked || isCampaignsLoading || campaignOptions.length === 0
              }
              className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-gray-50"
            >
              <option value="">
                {isCampaignsLoading
                  ? "Loading campaigns..."
                  : campaignOptions.length === 0
                    ? "No campaigns available"
                    : "Choose campaign"}
              </option>
              {campaignOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <div className="mb-1.5 flex items-center justify-between gap-2">
              <label className="text-sm font-medium text-gray-700">
                Select Creator{bulkMode ? "s" : ""}{" "}
                <span className="text-red-500">*</span>
              </label>
              <button
                type="button"
                onClick={() => {
                  setBulkMode((v) => !v);
                  setSelectedIds([]);
                  clearError();
                }}
                disabled={isLocked}
                className="inline-flex items-center gap-1 text-sm font-medium text-[#0c7bb3] hover:underline disabled:cursor-not-allowed disabled:opacity-40 disabled:no-underline"
              >
                {bulkMode ? (
                  <>
                    <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
                    Switch to Single
                  </>
                ) : (
                  <>
                    Invite More Creators
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                  </>
                )}
              </button>
            </div>
            <div
              className={
                isLocked ? "pointer-events-none opacity-60" : undefined
              }
              aria-disabled={isLocked || undefined}
            >
              <CreatorPickerList
                creators={creatorOptions}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                mode={bulkMode ? "bulk" : "single"}
                selectedIds={selectedIds}
                onToggle={handleToggleCreator}
                loading={isCreatorsLoading}
                conflictIds={conflictIds}
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Custom Message (Optional)
            </label>
            <p className="mb-2 text-xs text-gray-500">
              Add a personal message to the creator
            </p>
            <textarea
              value={message}
              onChange={handleMessageChange}
              placeholder="Add a personal message..."
              maxLength={500}
              disabled={isLocked}
              className="min-h-[100px] w-full resize-none rounded-xl border border-gray-200 p-3 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-gray-50"
            />
            <p className="mt-1 text-right text-xs text-gray-400">
              {message.length}/500
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            className="rounded-xl"
            onClick={handleClose}
            disabled={isLocked}
          >
            Cancel
          </Button>
          <Button
            type="button"
            className="min-w-[140px] gap-2 rounded-xl btn-gradient" 
            disabled={!canSend}
            onClick={handleSend}
            aria-busy={isSending || undefined}
          >
            {isSending ? (
              <>
                <Loader2
                  className="h-4 w-4 animate-spin"
                  aria-hidden
                />
                Sending...
              </>
            ) : successMessage ? (
              <>
                <CheckCircle2 className="h-4 w-4" aria-hidden />
                Sent
              </>
            ) : (
              "Send Invite"
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
