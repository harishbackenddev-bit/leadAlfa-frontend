import React from "react";
import { CalendarDays, Clock, LineChart, Users } from "lucide-react";
import CampaignDetailsGrid from "../../pages/brand/Campaigns/components/CampaignDetailsGrid";
import compensationIcon from "../../assets/images/campaign/compensationIcon.webp";
import {
  formatDetailDate,
  getSidebarPaymentRange,
} from "./campaignViewUtils";

function getPetsRequiredDisplay(campaign) {
  const raw = campaign?.petsRequired;
  const isYes =
    raw === true ||
    String(raw || "").toLowerCase() === "yes" ||
    String(raw || "").toLowerCase() === "true";
  const typeOfPet = String(campaign?.typeOfPet || "").trim();
  if (!isYes) return "No";
  return typeOfPet ? `Yes (${typeOfPet})` : "Yes";
}

/**
 * Shared campaign detail sections (brand view detail + creator explore detail).
 * Expects the same campaign object shape as brand `useCampaign` / API.
 * @param {boolean} [showCampaignDetailsGrid=false] — Brand campaign view only; hidden on creator explore.
 * @param {() => void} [onApplyClick] — Creator explore: opens apply flow; shows Apply inside the payment card.
 * @param {string} [applyLabel] — Label for the action button (defaults to "Apply Now").
 * @param {React.ReactNode} [topSlot] — Rendered at the top of the left content column (e.g. brand feedback box).
 * @param {React.ReactNode} [bottomSlot] — Rendered at the bottom of the left content column (e.g. submission + re-submit).
 * @param {React.ReactNode} [sidebarSlot] — Replaces the default sticky sidebar (e.g. compensation + timeline + submit revisions).
 */
export default function CampaignViewContent({
  campaign,
  showCampaignDetailsGrid = false,
  onApplyClick,
  applyLabel = "Apply Now",
  topSlot,
  bottomSlot,
  sidebarSlot,
}) {
  if (!campaign) return null;

  const deliverable =
    campaign?.deliverables || campaign?.socialMediaType || "-";

  const minBudget = campaign?.minBudget;
  const maxBudget = campaign?.maxBudget;
  const isGift = String(campaign?.compensationType || "")
    .toLowerCase()
    .includes("gift");
  const compensationRange = isGift
    ? "Gift Campaign"
    : minBudget && maxBudget
      ? `R ${minBudget}`
      : minBudget
        ? `R ${minBudget}`
        : "-";

  const sidebarPaymentRange = getSidebarPaymentRange(campaign);

  const creativeDirection = campaign?.creativeDirection || {};
  const videoParts = String(creativeDirection.videoStructure || "")
    .split("->")
    .map((part) => part.trim())
    .filter(Boolean);
  const [hook, problem, solution, cta] = [
    videoParts[0] || "-",
    videoParts[1] || "-",
    videoParts[2] || "-",
    videoParts[3] || "-",
  ];

  const dosList = String(campaign?.dos || "")
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
  const dontsList = String(campaign?.donts || "")
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);

  const platforms = Array.isArray(campaign?.platform)
    ? campaign.platform
    : campaign?.platform
      ? [campaign.platform]
      : [];
  const addOns = Array.isArray(campaign?.addOns)
    ? campaign.addOns
    : campaign?.addOns
      ? [campaign.addOns]
      : [];
  const moodboardsRaw = campaign?.media?.moodboards;
  const moodboards = Array.isArray(moodboardsRaw)
    ? moodboardsRaw
    : moodboardsRaw
      ? [moodboardsRaw]
      : [];

  return (
    <>
      {showCampaignDetailsGrid ? (
        <CampaignDetailsGrid
          description={campaign?.campaignBrief || campaign?.additionalBrief || "-"}
          startDate={
            campaign?.startDate
              ? new Date(campaign.startDate).toLocaleDateString()
              : campaign?.campaignStarts
                ? new Date(campaign.campaignStarts).toLocaleDateString()
                : campaign?.createdAt
                  ? new Date(campaign.createdAt).toLocaleDateString()
                  : "-"
          }
          creatorsNeeded={
            campaign?.numberOfCreators ?? campaign?.creatorsNeeded ?? "-"
          }
          deliverable={deliverable}
        />
      ) : null}

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1.6fr_1fr] lg:items-start">
        <div className="min-w-0">
          {topSlot ? <div className="mb-6">{topSlot}</div> : null}
          <div className="relative rounded-2xl bg-gradient-to-br from-[#0353A4] to-[#024080] p-6 text-white shadow-sm">
            <img src={compensationIcon} alt="" className="absolute top-0 right-0" aria-hidden />
            <img
              src={compensationIcon}
              alt=""
              className="absolute bottom-0 left-0 w-15 rotate-180"
              aria-hidden
            />
            <p className="text-xs uppercase tracking-wide text-blue-100">Compensation</p>
            <div className="border-b border-white/20 pb-6">
              <p className="mt-2 text-3xl font-semibold md:text-5xl">{compensationRange}</p>
              {!isGift && maxBudget ? (
                <p className="mt-1 text-sm text-white/60">up to R {maxBudget}</p>
              ) : null}
            </div>

            <div
              className={`mt-6 grid grid-cols-1 gap-3 ${onApplyClick ? "sm:grid-cols-2 lg:grid-cols-4" : "sm:grid-cols-3"
                }`}
            >
              <div className="rounded-xl bg-white/10 p-3 text-sm">
                <p className="text-xs uppercase text-white/50">Product</p>
                <p className="mt-1">{campaign?.productStatus || "-"}</p>
              </div>
              <div className="rounded-xl bg-white/10 p-3 text-sm">
                <p className="text-xs uppercase text-white/50">Usage Rights</p>
                <p className="mt-1">{campaign?.usageRightsIncluded || "-"}</p>
              </div>
              <div className="rounded-xl bg-white/10 p-3 text-sm">
                <p className="text-xs uppercase text-white/50">Whitelisting</p>
                <p className="mt-1">{campaign?.whitelistingSparkAds || "-"}</p>
              </div>
              {onApplyClick ? (
                <div className="rounded-xl bg-white/10 p-3 text-sm">
                  <p className="text-xs uppercase text-white/50">Pets Required</p>
                  <p className="mt-1">{getPetsRequiredDisplay(campaign)}</p>
                </div>
              ) : null}
            </div>
          </div>
          <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900">Campaign Brief</h3>
            <div className="mt-4 space-y-4 text-sm text-gray-700">
              <div>
                <p className="text-xs uppercase text-gray-400">Objective</p>
                <p className="mt-1">{campaign?.campaignGoal || "-"}</p>
              </div>
              <div>
                <p className="text-xs uppercase text-gray-400">Target Audience</p>
                <p className="mt-1">{campaign?.additionalAudienceDetails || "-"}</p>
              </div>
              <div className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-900">
                <p className="text-xs uppercase text-amber-500">Key Message</p>
                <p className="mt-1">{campaign?.keyMessage || "-"}</p>
              </div>
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900">Deliverables</h3>
            <div className="mt-4 grid grid-cols-1 gap-4 text-sm text-gray-700 md:grid-cols-2">
              <div>
                <p className="text-xs uppercase text-gray-400">Deliverables</p>
                <p className="mt-1">{deliverable}</p>
              </div>
              <div>
                <p className="text-xs uppercase text-gray-400">Platform</p>
                <p className="mt-1">{platforms.length ? platforms.join(" / ") : "-"}</p>
              </div>
              <div>
                <p className="text-xs uppercase text-gray-400">Product / Service</p>
                {campaign?.productServiceUrl ? (
                  <a
                    href={campaign.productServiceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-1 inline-block text-blue-600"
                  >
                    {campaign.productServiceUrl}
                  </a>
                ) : (
                  <p className="mt-1">-</p>
                )}
              </div>
              <div>
                <p className="text-xs uppercase text-gray-400">Additional Requirements</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {addOns.length ? (
                    addOns.map((item, idx) => (
                      <span
                        key={`addon-${idx}`}
                        className="rounded-full bg-blue-50 px-3 py-1 text-xs text-blue-600"
                      >
                        {item}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-gray-500">-</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900">Creative Direction</h3>
            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-gray-200 p-4">
                <p className="text-xs uppercase text-gray-400">Hook</p>
                <p className="mt-2 text-sm text-gray-700">{hook}</p>
              </div>
              <div className="rounded-xl border border-gray-200 p-4">
                <p className="text-xs uppercase text-gray-400">Problem</p>
                <p className="mt-2 text-sm text-gray-700">{problem}</p>
              </div>
              <div className="rounded-xl border border-gray-200 p-4">
                <p className="text-xs uppercase text-gray-400">Solution</p>
                <p className="mt-2 text-sm text-gray-700">{solution}</p>
              </div>
              <div className="rounded-xl border border-gray-200 p-4">
                <p className="text-xs uppercase text-gray-400">CTA</p>
                <p className="mt-2 text-sm text-gray-700">{cta}</p>
              </div>
            </div>

            <div className="mt-6 space-y-4 text-sm text-gray-700">
              <div>
                <p className="text-xs uppercase text-gray-400">Aesthetic / Vibe</p>
                <p className="mt-1">{creativeDirection?.aestheticVibe || "-"}</p>
              </div>
              <div>
                <p className="text-xs uppercase text-gray-400">Scripting Approach</p>
                <div className="mt-2 inline-flex rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-blue-700">
                  {creativeDirection?.scriptingApproach || "-"}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900">Do’s & Don’ts</h3>
            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                <p className="text-xs font-semibold uppercase text-emerald-600">Do</p>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-emerald-800">
                  {dosList.length
                    ? dosList.map((item, idx) => <li key={`do-${idx}`}>{item}</li>)
                    : <li>-</li>}
                </ul>
              </div>
              <div className="rounded-xl border border-rose-200 bg-rose-50 p-4">
                <p className="text-xs font-semibold uppercase text-rose-600">Don’t</p>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-rose-800">
                  {dontsList.length
                    ? dontsList.map((item, idx) => <li key={`dont-${idx}`}>{item}</li>)
                    : <li>-</li>}
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900">
              Moodboard / Inspiration / Examples / Previous Campaigns
            </h3>
            {moodboards.length ? (
              <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
                {moodboards.map((board, idx) => {
                  const url = board?.mediaDetails?.url || board?.url;
                  if (!url) return null;
                  return (
                    <div key={board.id ?? idx} className="overflow-hidden rounded-xl">
                      <img
                        src={url}
                        alt={board?.name || `Moodboard ${idx + 1}`}
                        className="h-48 w-full object-cover"
                      />
                    </div>
                  );
                })}
              </div>
            ) : campaign?.moodboardInspirationUrl ? (
              <a
                href={campaign.moodboardInspirationUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-block text-blue-600"
              >
                {campaign.moodboardInspirationUrl}
              </a>
            ) : (
              <p className="mt-3 text-sm text-gray-500">No moodboards provided.</p>
            )}
          </div>

          {bottomSlot ? <div className="mt-8">{bottomSlot}</div> : null}
        </div>
        <div
          className={`sticky z-10 w-full min-w-0 self-start ${onApplyClick || sidebarSlot ? "top-20" : "top-4"}`}
        >
          {sidebarSlot ? (
            sidebarSlot
          ) : (
          <div className="space-y-4">
            <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100">
                    <CalendarDays className="h-5 w-5 text-[#0353A4]" aria-hidden />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs uppercase tracking-wide text-gray-400">Start Date</p>
                    <p className="mt-0.5 text-sm font-semibold text-gray-900">
                      {formatDetailDate(campaign?.campaignStarts)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100">
                    <Clock className="h-5 w-5 text-[#0353A4]" aria-hidden />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs uppercase tracking-wide text-gray-400">
                      Applications Deadline
                    </p>
                    <p className="mt-0.5 text-sm font-semibold text-gray-900">
                      {formatDetailDate(campaign?.applicationDeadline)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100">
                    <Users className="h-5 w-5 text-[#0353A4]" aria-hidden />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs uppercase tracking-wide text-gray-400">Follower Count</p>
                    <p className="mt-0.5 text-sm font-semibold text-gray-900">
                      {campaign?.followerCount || "-"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100">
                    <LineChart className="h-5 w-5 text-[#0353A4]" aria-hidden />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs uppercase tracking-wide text-gray-400">Engagement Rate</p>
                    <p className="mt-0.5 text-sm font-semibold text-gray-900">
                      {campaign?.engagementRate || "-"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-gradient-to-br from-[#0353A4] to-[#024080] px-5 py-4 text-white shadow-sm">
              <p className="text-xs font-medium uppercase tracking-wide text-white/90">
                {onApplyClick ? "Payment" : "Payment Range"}
              </p>
              <p className="mt-2 text-xl font-bold leading-snug text-white sm:text-2xl">
                {sidebarPaymentRange}
              </p>
              {typeof onApplyClick === "function" ? (
                <button
                  type="button"
                  onClick={onApplyClick}
                  className="mt-4 w-full rounded-xl bg-[#0353A4] py-3 text-center text-sm font-semibold text-white shadow-sm transition-colors"
                >
                  {applyLabel}
                </button>
              ) : null}
            </div>
          </div>
          )}
        </div>
      </div>
    </>
  );
}
