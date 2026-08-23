import React from "react";
import {
  CampaignIcon,
  PhotoIcon,
} from "../../../../assets/SVGs/brands/customSVGs";

function safeDateLabel(value) {
  if (value == null || value === "") return "—";
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? String(value) : d.toLocaleString();
}

/** @param {Record<string, unknown> | null} assignment - From API only; hides section when absent. */
export default function ViewAssignment({ assignment = null }) {
  if (!assignment || typeof assignment !== "object") return null;

  const status =
    assignment.status ??
    assignment.assignmentStatus ??
    assignment.reviewStatus ??
    "";
  const campaignId =
    assignment.campaignId ??
    assignment.campaignPublicId ??
    assignment.publicCampaignId ??
    "";
  const campaignName =
    assignment.campaignName ??
    assignment.campaignTitle ??
    assignment.title ??
    "";
  const assetsType =
    assignment.assetsType ??
    assignment.assetSummary ??
    (Array.isArray(assignment.deliverables)
      ? `${assignment.deliverables.length} items`
      : assignment.assetsCount != null
        ? `${assignment.assetsCount} Photos`
        : "");
  const dateTime =
    assignment.submittedAt ??
    assignment.dateTime ??
    assignment.updatedAt ??
    assignment.createdAt ??
    "";

  const imageUrls =
    (Array.isArray(assignment.deliverableUrls) && assignment.deliverableUrls) ||
    (Array.isArray(assignment.images) && assignment.images) ||
    (Array.isArray(assignment.deliverables) &&
      assignment.deliverables
        .map((d) => (typeof d === "string" ? d : d?.url))
        .filter(Boolean)) ||
    [];

  const hasRenderable =
    String(status).trim() ||
    String(campaignId).trim() ||
    String(campaignName).trim() ||
    String(assetsType).trim() ||
    String(dateTime).trim() ||
    imageUrls.length > 0;

  if (!hasRenderable) return null;

  return (
    <div className="bg-white rounded-xl p-6 mt-8 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-extrabold font-anton">View Assignment</h2>
        {String(status).trim() ? (
          <div className="inline-flex items-center px-3 py-1 border border-orange-200 rounded-md text-sm text-orange-600">
            {status}
          </div>
        ) : null}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mt-6">
        <div>
          <div className="text-sm text-gray-500">Campaign ID</div>
          <div className="flex items-center gap-2 mt-2 text-gray-800">
            <CampaignIcon className="w-6 h-6" fill="#1E60DB" />
            <span className="font-medium">{campaignId ? `#${String(campaignId).replace(/^#/, "")}` : "—"}</span>
          </div>
        </div>

        <div>
          <div className="text-sm text-gray-500">Campaign Name</div>
          <div className="mt-2 text-gray-800">{campaignName || "—"}</div>
        </div>

        <div>
          <div className="text-sm text-gray-500">Assets Type</div>
          <div className="mt-2 text-gray-800 flex items-center gap-2">
            <PhotoIcon className="w-5 h-5 text-gray-500" />
            {assetsType || "—"}
          </div>
        </div>

        <div>
          <div className="text-sm text-gray-500">Date & Time</div>
          <div className="mt-2 text-gray-800">{safeDateLabel(dateTime)}</div>
        </div>
      </div>

      {imageUrls.length > 0 ? (
        <>
          <div className="border-t border-gray-200 my-6" />
          <h3 className="text-2xl font-anton font-extrabold">Deliverables</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
            {imageUrls.map((url, i) => (
              <div key={i} className="rounded-2xl overflow-hidden bg-gray-50">
                <img
                  src={url}
                  alt={`Deliverable ${i + 1}`}
                  className="w-full h-auto object-contain"
                />
              </div>
            ))}
          </div>
        </>
      ) : null}

      {assignment.allowActions !== false &&
      (assignment.canApprove === true ||
        assignment.canReview === true ||
        assignment.hasActions === true) ? (
        <div className="flex gap-4 mt-6">
          {assignment.canApprove === true ? (
            <button type="button" className="px-6 py-3 bg-blue-600 text-white rounded-full">
              Approve Assignment
            </button>
          ) : null}
          {assignment.canReview === true ? (
            <button
              type="button"
              className="px-6 py-3 border border-blue-400 text-[#0c7bb3] rounded-full"
            >
              Review Request
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
