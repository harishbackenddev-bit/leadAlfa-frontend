import React, { useEffect, useState } from "react";
import { Button } from "../../../../components/ui/button";
import {
  canPingBrand,
  formatNextPingLabel,
  getNextReminderAvailableAt,
} from "../reminderCooldown";

const STATUS_STYLES = {
  pending: "bg-gray-100 text-gray-700",
  rejected: "bg-red-50 text-red-700",
  active: "bg-emerald-50 text-emerald-700",
  in_review: "bg-amber-50 text-amber-800",
  in_revision: "border border-rose-300 bg-white text-rose-600",
  completed: "bg-emerald-50 text-emerald-700",
};

const STATUS_LABELS = {
  pending: "Awaiting Review",
  rejected: "Declined",
  active: "Active",
  in_review: "Under Review",
  in_revision: "In Revision",
  completed: "Approved",
};

function PingBrandButton({ job, onPingBrand }) {
  const [now, setNow] = useState(() => Date.now());
  const nextAt = getNextReminderAvailableAt(job);
  const allowed = canPingBrand(job);
  const cooldownLabel = formatNextPingLabel(nextAt);

  useEffect(() => {
    if (allowed || !nextAt) return undefined;
    const timer = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(timer);
  }, [allowed, nextAt]);

  // Re-evaluate label when `now` ticks.
  void now;

  if (!allowed) {
    return (
      <div className="flex flex-col gap-1.5">
        <Button
          type="button"
          variant="outline"
          disabled
          className="w-full rounded-xl border-gray-200 text-sm font-semibold text-gray-400"
        >
          Ping Brand
        </Button>
        {cooldownLabel ? (
          <p className="text-center text-[11px] text-gray-500">{cooldownLabel}</p>
        ) : null}
      </div>
    );
  }

  return (
    <Button
      type="button"
      variant="outline"
      className="w-full rounded-xl border-[#0c7bb3] text-sm font-semibold text-[#0c7bb3] hover:bg-blue-50"
      onClick={() => onPingBrand(job)}
    >
      Ping Brand
    </Button>
  );
}

export default function MyJobGridCard({
  job,
  onViewDetails,
  onSubmitWork,
  onPingBrand,
  onRateReview,
  onSubmitRevisions,
}) {
  const {
    title,
    brandName,
    campaignName,
    description,
    image,
    payment,
    deliverable,
    startDate,
    endDate,
    status,
    workStatus,
    overdueDays,
  } = job;

  const renderActions = () => {
    if (status === "rejected") {
      return (
        <Button
          type="button"
          variant="outline"
          className="w-full rounded-xl border-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          onClick={() => onViewDetails(job)}
        >
          View Application
        </Button>
      );
    }

    if (status === "pending") {
      return (
        <Button
          type="button"
          className="w-full rounded-xl btn-gradient text-sm font-semibold"
          onClick={() => onViewDetails(job)}
        >
          View Application
        </Button>
      );
    }

    // workStatus from API drives creator action CTAs.
    if (workStatus === "submit") {
      return (
        <Button
          type="button"
          variant="outline"
          className="w-full rounded-xl btn-gradient text-sm font-semibold text-[#ffffff]"
          onClick={() => onSubmitWork(job)}
        >
          Submit Work
        </Button>
      );
    }

    if (workStatus === "resubmit") {
      return (
        <Button
          type="button"
          className="w-full rounded-xl bg-[#EA580C] text-sm font-semibold text-white hover:bg-[#C2410C]"
          onClick={() => onSubmitRevisions?.(job)}
        >
          Submit Revisions
        </Button>
      );
    }

    // workStatus === null: pending_review → Ping Brand; approved → Rate & Review
    if (workStatus === null) {
      if (status === "completed") {
        return (
          <Button
            type="button"
            className="w-full rounded-xl btn-gradient text-sm font-semibold"
            onClick={() => onRateReview(job)}
          >
            Rate & Review
          </Button>
        );
      }

      // Under review (after submit or resubmit) — ping brand, not View Details.
      if (status === "in_review") {
        return <PingBrandButton job={job} onPingBrand={onPingBrand} />;
      }

      return (
        <Button
          type="button"
          variant="outline"
          className="w-full rounded-xl border-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          onClick={() => onViewDetails(job)}
        >
          View Details
        </Button>
      );
    }

    // Legacy payloads without workStatus.
    if (status === "active") {
      return (
        <Button
          type="button"
          variant="outline"
          className="w-full rounded-xl btn-gradient text-sm font-semibold text-[#ffffff]"
          onClick={() => onSubmitWork(job)}
        >
          Submit Work
        </Button>
      );
    }

    if (status === "in_review") {
      return <PingBrandButton job={job} onPingBrand={onPingBrand} />;
    }

    if (status === "in_revision") {
      return (
        <Button
          type="button"
          className="w-full rounded-xl bg-[#EA580C] text-sm font-semibold text-white hover:bg-[#C2410C]"
          onClick={() => onSubmitRevisions?.(job)}
        >
          Submit Revisions
        </Button>
      );
    }

    if (status === "completed") {
      return (
        <Button
          type="button"
          className="w-full rounded-xl bg-[#0c7bb3] text-sm font-semibold hover:bg-[#0a6a9c]"
          onClick={() => onRateReview(job)}
        >
          Rate & Review
        </Button>
      );
    }

    return null;
  };

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      <div className="relative aspect-[16/10] bg-gray-100 overflow-hidden">
        <img src={image} alt={title} className="h-full w-full object-cover" />
        {overdueDays != null && status !== "completed" && (
          <span className="absolute left-3 top-3 rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-600">
            {overdueDays} Days Overdue
          </span>
        )}
        <span
          className={`absolute right-3 top-3 rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_STYLES[status] || STATUS_STYLES.pending}`}
        >
          {STATUS_LABELS[status] || status}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <a
          type="button"
          onClick={() => onViewDetails(job)}
          className="cursor-pointer text-lg font-bold text-gray-900"
        >
          {title}
        </a>
        <p className="mt-1 text-xs text-gray-500 sm:text-sm">
          Brand: {brandName}
        </p>
        <p className="text-xs text-gray-500 sm:text-sm">
          Campaign: {campaignName}
        </p>

        <div className="mt-4 grid grid-cols-2 gap-3 border-y border-gray-100 py-3">
          <div>
            <p className="text-xs text-gray-400">Deliverable</p>
            <p className="text-sm font-medium text-gray-800">{deliverable}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400">Payment</p>
            <p className="text-sm font-medium text-[#0c7bb3]">{payment}</p>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-3">
          <div>
            <p className="text-xs text-gray-400">Start Date</p>
            <p className="text-sm text-gray-700">{startDate}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400">End Date</p>
            <p className="text-sm text-gray-700">{endDate}</p>
          </div>
        </div>

        {description ? (
          <p className="mt-3 line-clamp-2 flex-1 text-sm text-gray-600">
            {description}
          </p>
        ) : null}

        <div className="mt-4">{renderActions()}</div>
      </div>
    </div>
  );
}
