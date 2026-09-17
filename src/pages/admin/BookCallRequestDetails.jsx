import { ArrowLeft, Globe, Mail, CalendarDays } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Button } from "../../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import SectionCard from "./components/requestDetails/SectionCard";
import LabelValueList from "./components/requestDetails/LabelValueList";
import ContactRequestStatusBadge from "./components/contactRequests/ContactRequestStatusBadge";
import ContactRequestProfileAvatar from "./components/contactRequests/ContactRequestProfileAvatar";
import ContactRequestReplyHistory from "./components/contactRequests/ContactRequestReplyHistory";
import { appendAdminNoteReply } from "./components/contactRequests/contactRequestNotes";
import {
  BOOK_CALL_BANNER_DURATION_MS,
  BOOK_CALL_STATUS_OPTIONS,
  getBookCallAdminErrorMessage,
} from "../../constants/bookCallRequest";
import {
  getBookCallRequestByPublicId,
  updateBookCallRequest,
} from "../../services/api/apiservices";
import {
  buildBookCallOriginalSummary,
  extractBookCallRequestDetail,
} from "./components/bookCallRequests/bookCallRequestMappers";

const BookCallRequestDetails = () => {
  const { publicId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [loadingDetails, setLoadingDetails] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sendingReply, setSendingReply] = useState(false);
  const [detailsError, setDetailsError] = useState("");
  const [accessDenied, setAccessDenied] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState("");
  const [status, setStatus] = useState("new");
  const [replyDraft, setReplyDraft] = useState("");
  const [data, setData] = useState(() => {
    if (
      location.state?.request &&
      String(location.state.request.publicId) === String(publicId)
    ) {
      return extractBookCallRequestDetail({ request: location.state.request });
    }
    return null;
  });

  useEffect(() => {
    if (!saveError && !saveSuccess) return undefined;

    const timer = setTimeout(() => {
      setSaveError("");
      setSaveSuccess("");
    }, BOOK_CALL_BANNER_DURATION_MS);

    return () => clearTimeout(timer);
  }, [saveError, saveSuccess]);

  useEffect(() => {
    let mounted = true;

    const loadDetails = async () => {
      if (!publicId) {
        setLoadingDetails(false);
        return;
      }

      try {
        setLoadingDetails(true);
        setDetailsError("");
        setAccessDenied(false);
        setNotFound(false);

        const response = await getBookCallRequestByPublicId(publicId);
        const details = extractBookCallRequestDetail(response);

        if (mounted && details) {
          setData(details);
          setStatus(details.status);
          setReplyDraft("");
        }
      } catch (err) {
        if (!mounted) return;

        if (err?.status === 403) {
          setAccessDenied(true);
          return;
        }

        if (err?.status === 404) {
          setNotFound(true);
          setDetailsError(getBookCallAdminErrorMessage(err));
          return;
        }

        setDetailsError(getBookCallAdminErrorMessage(err, "Failed to fetch call request."));
      } finally {
        if (mounted) {
          setLoadingDetails(false);
        }
      }
    };

    loadDetails();

    return () => {
      mounted = false;
    };
  }, [publicId]);

  const isBusy = saving || sendingReply;

  const applyUpdate = async (payload, successMessage, { isReply = false } = {}) => {
    const setBusy = isReply ? setSendingReply : setSaving;

    try {
      setBusy(true);
      setSaveError("");
      setSaveSuccess("");

      const response = await updateBookCallRequest(publicId, payload);
      const updated = extractBookCallRequestDetail(response);

      if (updated) {
        setData(updated);
        setStatus(updated.status);
      }

      if (payload.adminNotes) {
        setReplyDraft("");
      }

      setSaveSuccess(successMessage || response?.message || "Book a call request updated successfully.");
      return true;
    } catch (err) {
      setSaveError(getBookCallAdminErrorMessage(err, "Failed to update call request."));
      setSaveSuccess("");
      return false;
    } finally {
      setBusy(false);
    }
  };

  const handleSendReply = async () => {
    if (!publicId) return;

    const trimmedReply = replyDraft.trim();
    if (!trimmedReply) {
      setSaveError("Write a reply before sending.");
      setSaveSuccess("");
      return;
    }

    let adminNotes;
    try {
      adminNotes = appendAdminNoteReply(data?.adminNotes || "", trimmedReply);
    } catch (err) {
      setSaveError(err.message || "Unable to send reply.");
      setSaveSuccess("");
      return;
    }

    await applyUpdate({ adminNotes }, "Reply sent successfully.", { isReply: true });
  };

  const handleSave = async () => {
    if (!publicId) return;

    const payload = {};
    const statusChanged = status && status !== data?.status;

    if (statusChanged) {
      payload.status = status;
    }

    if (!Object.keys(payload).length) {
      setSaveError("Change the status before saving. Use Send Reply to send a message.");
      setSaveSuccess("");
      return;
    }

    await applyUpdate(payload, "Changes saved successfully.");
  };

  if (accessDenied) {
    return (
      <div className="p-6 md:p-8">
        <Button variant="outline" onClick={() => navigate("/admin/book-call-requests")}>
          Back
        </Button>
        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
          <h2 className="text-lg font-semibold text-red-700">Access Denied</h2>
          <p className="mt-2 text-sm text-red-600">
            You do not have permission to view this call request.
          </p>
        </div>
      </div>
    );
  }

  if (loadingDetails && !data) {
    return (
      <div className="p-6 md:p-8">
        <Button variant="outline" onClick={() => navigate("/admin/book-call-requests")}>
          Back
        </Button>
        <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-8 text-gray-600">
          Loading call request...
        </div>
      </div>
    );
  }

  if (notFound || !data) {
    return (
      <div className="p-6 md:p-8">
        <Button variant="outline" onClick={() => navigate("/admin/book-call-requests")}>
          Back
        </Button>
        <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-8 text-gray-600">
          {detailsError || "Book a call request not found."}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4 sm:space-y-6 sm:p-6 md:p-8">
      {detailsError ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
          {detailsError}
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => navigate("/admin/book-call-requests")}
        className="inline-flex items-center gap-2 text-xs font-medium text-gray-600 hover:text-gray-900 sm:text-sm"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Call Requests
      </button>

      <SectionCard className="p-4 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-5">
          <ContactRequestProfileAvatar
            name={data.name}
            profilePhotoUrl={data.profilePhotoUrl}
          />

          <div className="min-w-0 flex-1">
            <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
              <h1 className="break-words text-lg font-bold leading-tight text-gray-900 sm:text-2xl md:text-3xl">
                {data.name}
              </h1>
              <div>
                <ContactRequestStatusBadge status={data.status} label={data.statusLabel} />
              </div>
              {data.roleLabel ? (
                <span className="inline-flex w-fit items-center rounded-full bg-blue-50 px-3 py-1 text-[11px] font-medium text-blue-700 sm:text-xs">
                  {data.roleLabel}
                </span>
              ) : null}
            </div>

            <div className="mt-3 space-y-2 text-gray-500 sm:mt-4">
              <div className="flex items-start gap-2">
                <Mail className="mt-0.5 h-4 w-4 flex-shrink-0" />
                <span className="break-all text-xs leading-relaxed sm:text-sm">{data.businessEmail}</span>
              </div>
              {data.companyWebsite ? (
                <div className="flex items-start gap-2">
                  <Globe className="mt-0.5 h-4 w-4 flex-shrink-0" />
                  <a
                    href={data.companyWebsite}
                    target="_blank"
                    rel="noreferrer"
                    className="break-all text-xs leading-relaxed text-[#0353a4] underline hover:opacity-80 sm:text-sm"
                  >
                    {data.companyWebsite}
                  </a>
                </div>
              ) : null}
              <div className="flex items-start gap-2">
                <CalendarDays className="mt-0.5 h-4 w-4 flex-shrink-0" />
                <div className="text-xs leading-relaxed sm:text-sm">
                  <span className="block font-medium text-gray-700">
                    {data.dateLabel || "Submitted"}
                  </span>
                  {data.timeLabel ? (
                    <span className="block text-gray-500">{data.timeLabel}</span>
                  ) : (
                    <span className="block text-gray-500">{data.createdAtFormatted}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </SectionCard>

      <div className="grid gap-4 sm:gap-6 xl:grid-cols-2">
        <SectionCard
          title="Request Details"
          className="p-4 sm:p-6"
          titleClassName="text-lg font-semibold text-gray-800 sm:text-xl md:text-2xl"
        >
          <LabelValueList
            items={[
              { label: "Request ID", value: data.publicId },
              { label: "Company Name", value: data.companyName },
              { label: "Company Website", value: data.companyWebsite || "—" },
              { label: "Last Updated", value: data.updatedAtFormatted },
              { label: "Resolved At", value: data.resolvedAtFormatted },
            ]}
          />
        </SectionCard>

        <SectionCard
          title="Company"
          className="p-4 sm:p-6"
          titleClassName="text-lg font-semibold text-gray-800 sm:text-xl md:text-2xl"
        >
          <p className="text-xs leading-relaxed text-gray-700 sm:text-sm">
            {data.companyName || "—"}
          </p>
          {data.companyWebsite ? (
            <a
              href={data.companyWebsite}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-block break-all text-xs text-[#0353a4] underline hover:opacity-80 sm:text-sm"
            >
              {data.companyWebsite}
            </a>
          ) : (
            <p className="mt-3 text-xs text-gray-500 sm:text-sm">No website provided.</p>
          )}
        </SectionCard>
      </div>

      <SectionCard
        title="Admin Actions"
        className="p-4 sm:p-6"
        titleClassName="text-lg font-semibold text-gray-800 sm:text-xl md:text-2xl"
      >
        <div className="space-y-4 sm:space-y-5">
          <div>
            <label htmlFor="status" className="mb-2 block text-xs font-medium text-gray-700 sm:text-sm">
              Status
            </label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger id="status" className="h-10 w-full rounded-xl sm:max-w-xs">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {BOOK_CALL_STATUS_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label htmlFor="replyDraft" className="mb-2 block text-xs font-medium text-gray-700 sm:text-sm">
              Add Note
            </label>
            <textarea
              id="replyDraft"
              value={replyDraft}
              onChange={(event) => setReplyDraft(event.target.value)}
              placeholder="Write a reply to send to this requester..."
              rows={4}
              disabled={isBusy}
              className="w-full resize-none rounded-xl border border-gray-200 px-3 py-3 text-xs text-gray-800 focus:border-[#0353a4] focus:outline-none focus:ring-2 focus:ring-[#0353a4]/20 disabled:opacity-60 sm:px-4 sm:text-sm"
            />
            <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:justify-end">
              <Button
                type="button"
                disabled={isBusy}
                onClick={handleSendReply}
                className="w-full rounded-xl btn-gradient sm:w-auto"
              >
                {sendingReply ? "Saving..." : "Save Note"}
              </Button>
            </div>
          </div>

          <ContactRequestReplyHistory
            adminNotes={data.adminNotes}
            originalMessage={buildBookCallOriginalSummary(data)}
            submittedAt={data.createdAt}
            updatedAt={data.updatedAt}
          />

          {saveError ? (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-600 sm:text-sm">
              {saveError}
            </div>
          ) : null}

          {saveSuccess ? (
            <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-xs text-green-700 sm:text-sm">
              {saveSuccess}
            </div>
          ) : null}

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button
              type="button"
              disabled={isBusy}
              onClick={handleSave}
              className="w-full rounded-xl btn-gradient sm:w-auto"
            >
              {saving ? "Saving..." : "Save Changes"}
            </Button>
            <Button
              variant="outline"
              disabled={isBusy}
              onClick={() => navigate("/admin/book-call-requests")}
              className="w-full rounded-xl sm:w-auto"
            >
              Cancel
            </Button>
          </div>
        </div>
      </SectionCard>
    </div>
  );
};

export default BookCallRequestDetails;
