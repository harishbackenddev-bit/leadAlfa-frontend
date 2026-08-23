import React, { useMemo, useState } from "react";
import { Send, X } from "lucide-react";
import { Button } from "../../../../components/ui/button";
import { remindBrand } from "../../../../services/api/workSubmissionService";
import { resolveJobPublicId } from "../workSubmissionMapper";
import {
  canPingBrand,
  formatNextPingLabel,
  getNextReminderAvailableAt,
  storeNextReminderAt,
} from "../reminderCooldown";

export default function PingBrandModal({ job, jobPublicId, onClose, onSend }) {
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const brandName = job?.brandName || "the brand";
  const resolvedId = jobPublicId || resolveJobPublicId(job);

  const nextAt = useMemo(() => getNextReminderAvailableAt(job), [job]);
  const allowed = canPingBrand(job);
  const cooldownLabel = formatNextPingLabel(nextAt);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!resolvedId) {
      setError("Unable to send reminder — job ID missing.");
      return;
    }
    if (!canPingBrand(job)) {
      setError(
        cooldownLabel ||
          "You can only send one reminder every 24 hours."
      );
      return;
    }

    setSending(true);
    setError(null);

    try {
      const result = await remindBrand(resolvedId, message.trim() || undefined);
      if (result?.nextReminderAvailableAt) {
        storeNextReminderAt(resolvedId, result.nextReminderAvailableAt);
      } else {
        // Fallback: lock for 24h from now if API omits the field.
        storeNextReminderAt(
          resolvedId,
          new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
        );
      }
      onSend?.(message, result, resolvedId);
      onClose();
    } catch (err) {
      if (err?.nextReminderAvailableAt) {
        storeNextReminderAt(resolvedId, err.nextReminderAvailableAt);
      }
      setError(err?.message || "Failed to send reminder.");
      if (err?.status === 429 && err?.nextReminderAvailableAt) {
        onSend?.(message, { nextReminderAvailableAt: err.nextReminderAvailableAt }, resolvedId);
      }
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/50"
        aria-label="Close modal"
        onClick={onClose}
      />
      <div className="relative w-full max-w-lg rounded-2xl bg-white p-5 shadow-xl sm:p-6">
        <div className="mb-4 flex items-start justify-between gap-3">
          <h2 className="font-anton text-xl font-extrabold text-gray-900 sm:text-2xl">
            Send Reminder to Brand
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1 text-gray-500 hover:bg-gray-100"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="text-sm text-gray-600">
          Your work is currently under review by{" "}
          <span className="font-semibold text-gray-900">{brandName}</span>.
        </p>
        <p className="mt-1 text-sm text-gray-500">
          Send a reminder to request an update?
        </p>

        <form onSubmit={handleSend} className="mt-5">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Add a message (Optional)
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value.slice(0, 200))}
            placeholder="Hi, just checking in on the review status..."
            disabled={sending || !allowed}
            className="min-h-[100px] w-full resize-none rounded-xl border border-gray-200 p-3 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
          />

          <div className="mt-4 flex items-start gap-2 rounded-xl bg-blue-50 px-3 py-3 text-sm text-blue-700">
            <span aria-hidden>💡</span>
            <p>
              You can send a reminder once every 24 hours to avoid spamming.
              {cooldownLabel ? (
                <span className="mt-1 block font-medium">{cooldownLabel}.</span>
              ) : null}
            </p>
          </div>

          {error ? (
            <p
              role="alert"
              className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
            >
              {error}
            </p>
          ) : null}

          <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end ">
            <Button
              type="button"
              variant="outline"
              className="rounded-xl"
              onClick={onClose}
              disabled={sending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="gap-2 rounded-xl btn-gradient"
              disabled={sending || !allowed || !resolvedId}
            >
              <Send className="h-4 w-4" aria-hidden />
              {sending ? "Sending…" : "Send Reminder"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
