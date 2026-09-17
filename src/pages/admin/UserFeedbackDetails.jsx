import React, { useEffect, useState } from "react";
import { ArrowLeft, Mail, CalendarDays, ExternalLink, User } from "lucide-react";
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
import {
  FEEDBACK_STATUS_BADGE_CLASSES,
  FEEDBACK_TYPE_BADGE_CLASSES,
  extractUserFeedbackDetail,
} from "./components/userFeedback/userFeedbackMappers";
import {
  getUserFeedbackByPublicId,
  updateUserFeedback,
} from "../../services/api/apiservices";

const UserFeedbackDetails = () => {
  const { publicId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [loadingDetails, setLoadingDetails] = useState(true);
  const [saving, setSaving] = useState(false);
  const [detailsError, setDetailsError] = useState("");
  const [saveError, setSaveError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState("");
  const [status, setStatus] = useState("new");
  const [adminNotes, setAdminNotes] = useState("");
  const [data, setData] = useState(() => {
    if (
      location.state?.report &&
      String(location.state.report.publicId) === String(publicId)
    ) {
      return extractUserFeedbackDetail({ feedback: location.state.report });
    }
    return null;
  });

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

        const response = await getUserFeedbackByPublicId(publicId);
        const details = extractUserFeedbackDetail(response);

        if (mounted && details) {
          setData(details);
          setStatus(details.status);
          setAdminNotes(details.adminNotes || "");
        }
      } catch (err) {
        if (mounted) {
          setDetailsError(err?.message || err?.error || "Failed to fetch user feedback report.");
        }
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

  const handleSave = async () => {
    if (!publicId) return;

    const payload = {};
    const trimmedNotes = adminNotes.trim();
    const statusChanged = status && status !== data?.status;
    const notesChanged = trimmedNotes !== (data?.adminNotes || "");

    if (statusChanged) {
      payload.status = status;
    }

    if (notesChanged) {
      payload.adminNotes = trimmedNotes;
    }

    if (!Object.keys(payload).length) {
      setSaveError("Change the status or update admin notes before saving.");
      setSaveSuccess("");
      return;
    }

    try {
      setSaving(true);
      setSaveError("");
      setSaveSuccess("");

      const response = await updateUserFeedback(publicId, payload);
      const updated = extractUserFeedbackDetail(response);

      if (updated) {
        setData(updated);
        setStatus(updated.status);
        setAdminNotes(updated.adminNotes || "");
      }

      setSaveSuccess(response?.message || "User feedback updated successfully.");
    } catch (err) {
      setSaveError(err?.message || err?.error || "Failed to update user feedback.");
      setSaveSuccess("");
    } finally {
      setSaving(false);
    }
  };

  if (loadingDetails && !data) {
    return (
      <div className="p-6 md:p-8">
        <Button variant="outline" onClick={() => navigate("/admin/user-feedback")}>
          Back
        </Button>
        <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-8 text-gray-600">
          Loading report details...
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-6 md:p-8">
        <Button variant="outline" onClick={() => navigate("/admin/user-feedback")}>
          Back
        </Button>
        <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-8 text-gray-600">
          User feedback report not found.
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
        onClick={() => navigate("/admin/user-feedback")}
        className="inline-flex items-center gap-2 text-xs font-medium text-gray-600 hover:text-gray-900 sm:text-sm"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to User Feedback List
      </button>

      <SectionCard className="p-4 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0353a4]/10 text-[#0353a4] font-semibold text-lg shrink-0">
            <User className="h-6 w-6" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
              <h1 className="break-words text-lg font-bold leading-tight text-gray-900 sm:text-2xl md:text-3xl">
                {data.submitterName}
              </h1>
              <span
                className={`inline-flex w-fit items-center rounded-full border px-3 py-1 text-xs font-semibold ${FEEDBACK_STATUS_BADGE_CLASSES[data.status] || "bg-gray-100 text-gray-700"
                  }`}
              >
                {data.statusLabel}
              </span>
              <span
                className={`inline-flex w-fit items-center rounded-full border px-3 py-1 text-xs font-medium ${FEEDBACK_TYPE_BADGE_CLASSES[data.type] || "bg-gray-100 text-gray-700"
                  }`}
              >
                {data.typeLabel}
              </span>
            </div>

            <div className="mt-3 space-y-2 text-gray-500 sm:mt-4">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 flex-shrink-0" />
                <span className="break-all text-xs sm:text-sm">{data.submitterEmail}</span>
              </div>
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 flex-shrink-0" />
                <span className="text-xs sm:text-sm">{data.createdAtFormatted}</span>
              </div>
            </div>
          </div>
        </div>
      </SectionCard>

      <div className="grid gap-4 sm:gap-6 xl:grid-cols-2">
        <SectionCard
          title="Report Information"
          className="p-4 sm:p-6"
          titleClassName="text-lg font-semibold text-gray-800 sm:text-xl md:text-2xl"
        >
          <LabelValueList
            items={[
              { label: "Public ID", value: data.publicId },
              { label: "Type", value: data.typeLabel },
              { label: "User ID", value: data.userId ?? "—" },
              {
                label: "Page URL",
                value: (
                  <span className="inline-flex items-center gap-1 font-mono text-xs text-blue-600">
                    {data.pageUrl}
                    <ExternalLink className="h-3 w-3" />
                  </span>
                ),
              },
              { label: "Submitted At", value: data.createdAtFormatted },
              { label: "Last Updated", value: data.updatedAtFormatted },
              { label: "Resolved At", value: data.resolvedAtFormatted || "—" },
            ]}
          />
        </SectionCard>

        <SectionCard
          title="Description"
          className="p-4 sm:p-6"
          titleClassName="text-lg font-semibold text-gray-800 sm:text-xl md:text-2xl"
        >
          <p className="whitespace-pre-wrap break-words text-xs leading-relaxed text-gray-800 sm:text-sm">
            {data.description || "No description provided."}
          </p>
        </SectionCard>
      </div>

      <SectionCard
        title="Admin Management"
        className="p-4 sm:p-6"
        titleClassName="text-lg font-semibold text-gray-800 sm:text-xl md:text-2xl"
      >
        <div className="space-y-4 sm:space-y-5">
          <div>
            <label htmlFor="status" className="mb-2 block text-xs font-medium text-gray-700 sm:text-sm">
              Update Status
            </label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger id="status" className="h-10 w-full rounded-xl sm:max-w-xs">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label htmlFor="adminNotes" className="mb-2 block text-xs font-medium text-gray-700 sm:text-sm">
              Internal Admin Notes
            </label>
            <textarea
              id="adminNotes"
              value={adminNotes}
              onChange={(event) => setAdminNotes(event.target.value)}
              placeholder="Add internal notes about bug status, resolution, or deployment info..."
              rows={4}
              maxLength={1000}
              className="w-full resize-none rounded-xl border border-gray-200 px-3 py-3 text-xs text-gray-800 focus:border-[#0353a4] focus:outline-none focus:ring-2 focus:ring-[#0353a4]/20 sm:px-4 sm:text-sm"
            />
            <div className="mt-1 text-right text-[11px] text-gray-400">
              {adminNotes.length}/1000
            </div>
          </div>

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
              disabled={saving}
              onClick={handleSave}
              className="w-full rounded-xl btn-gradient sm:w-auto"
            >
              {saving ? "Saving..." : "Save Changes"}
            </Button>
            <Button
              variant="outline"
              disabled={saving}
              onClick={() => navigate("/admin/user-feedback")}
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

export default UserFeedbackDetails;
