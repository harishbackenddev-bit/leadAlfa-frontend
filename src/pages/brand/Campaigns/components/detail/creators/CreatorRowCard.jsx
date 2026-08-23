import React from "react";
import { MessageCircle, Star } from "lucide-react";
import { Button } from "../../../../../../components/ui/button";
import CreatorAvatar from "../shared/CreatorAvatar";

const STATUS_CONFIG = {
  working: { label: "Working", className: "bg-blue-50 text-blue-700" },
  submitted: { label: "Submitted", className: "bg-purple-50 text-purple-700" },
  hired: { label: "Hired", className: "bg-green-50 text-green-700" },
  invited: { label: "Invited", className: "bg-gray-100 text-gray-600" },
  completed: { label: "Completed", className: "bg-green-50 text-green-700" },
};

export default function CreatorRowCard({ creator, onViewProfile, onMessage }) {
  const status = STATUS_CONFIG[creator.status] || STATUS_CONFIG.invited;

  return (
    <article className="rounded-xl border border-gray-200 bg-white p-4 md:p-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="flex min-w-0 flex-1 items-start gap-3">
          <CreatorAvatar initials={creator.initials} />
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-semibold text-gray-900">{creator.name}</span>
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-medium ${status.className}`}
              >
                {status.label}
              </span>
            </div>
            <p className="mt-0.5 text-sm text-gray-500">{creator.handle}</p>
            <p className="mt-1 flex items-center gap-1 text-sm text-gray-500">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              {creator.rating} · {creator.jobsDone} jobs
            </p>
          </div>
        </div>

        <div className="hidden grid grid-cols-2 gap-4 sm:grid-cols-3  lg:items-center lg:gap-8">
          <div className="text-center lg:min-w-[100px]">
            <p className="text-lg font-semibold text-gray-900">
              {creator.deliverables}
            </p>
            <p className="text-xs text-gray-500">Deliverables</p>
          </div>
          <div className="text-center lg:min-w-[120px]">
            <p className="text-sm font-semibold text-gray-900">{creator.deadline}</p>
            <p className="text-xs text-gray-500">Deadline</p>
          </div>
        </div>

        <div className="flex justify-end gap-2 lg:shrink-0">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-9 rounded-lg border-gray-200 px-4 text-sm text-gray-700"
            onClick={() => onViewProfile?.(creator)}
          >
            View Profile
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-9 w-9 rounded-lg border-gray-200 text-gray-600"
            onClick={() => onMessage?.(creator)}
            aria-label={`Message ${creator.name}`}
          >
            <MessageCircle className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </article>
  );
}
