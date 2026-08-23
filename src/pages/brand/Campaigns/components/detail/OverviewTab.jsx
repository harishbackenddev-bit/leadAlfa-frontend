import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Spin } from "antd";
import {
  BarChart3,
  Calendar,
  Clock,
  ImagePlus,
  Lightbulb,
  Link2,
  MapPin,
  Package,
  PawPrint,
  Sparkles,
  Target,
  Users,
  Video,
  Zap,
} from "lucide-react";
import { getCampaignActivityQueryOptions } from "../../../../../services/tanstack/queryService";
import {
  mapActivityEntry,
  parseActivityResponse,
} from "../../utils/activityUtils";
import { NOT_PROVIDED, isPresent } from "../../utils/overviewDisplayUtils";
import {
  DetailField,
  DetailGrid,
  DetailSection,
  InfoBox,
  PillBadge,
} from "./DetailPrimitives";
import CampaignSummaryMetrics from "./CampaignSummaryMetrics";
import CampaignAlertBanner from "./CampaignAlertBanner";

const RECENT_ACTIVITY_LIMIT = 5;

function EmptyValue({ children }) {
  const value = children ?? NOT_PROVIDED;
  const isEmpty = value === NOT_PROVIDED || value === "—";
  return (
    <span className={isEmpty ? "text-gray-400 italic" : undefined}>{value}</span>
  );
}

function OverviewText({ value, tone = "gray" }) {
  if (!isPresent(value)) {
    return <EmptyValue>{NOT_PROVIDED}</EmptyValue>;
  }
  return <InfoBox tone={tone}>{value}</InfoBox>;
}

function OverviewRecentActivity({ campaignPublicId }) {
  const {
    data: response,
    isLoading,
    isError,
  } = useQuery({
    ...getCampaignActivityQueryOptions(campaignPublicId, {
      page: 1,
      limit: RECENT_ACTIVITY_LIMIT,
    }),
    enabled: Boolean(campaignPublicId),
  });

  const activities = useMemo(() => {
    return parseActivityResponse(response).activity.map(mapActivityEntry);
  }, [response]);

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-base font-semibold text-gray-900">Recent Activity</h2>
        {activities.length > 0 ? (
          <span className="text-xs text-gray-400">Latest {activities.length}</span>
        ) : null}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-10">
          <Spin size="small" />
        </div>
      ) : isError ? (
        <p className="mt-4 text-sm text-gray-500">
          Unable to load recent activity. Open the Campaign Activity tab to try again.
        </p>
      ) : activities.length === 0 ? (
        <p className="mt-4 text-sm text-gray-500 italic">No recent activity yet.</p>
      ) : (
        <div className="mt-4 divide-y divide-gray-100">
          {activities.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id || `${item.eventType}-${item.createdAt}`}
                className="flex items-start justify-between gap-4 py-4 first:pt-0 last:pb-0"
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ring-4 ring-white ${item.iconClassName}`}
                  >
                    <Icon className="h-4 w-4" strokeWidth={2} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{item.title}</p>
                    <p className="text-sm text-gray-500">{item.description}</p>
                    <p className="mt-1 text-xs text-gray-400">{item.actorLabel}</p>
                  </div>
                </div>
                <span className="shrink-0 text-xs text-gray-400">
                  {item.timelineLabel}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default function OverviewTab({ detail, campaignPublicId }) {
  const { campaignDetails, goals, creative, timelineDetails, moodboard, addOns } =
    detail;
  const hasApiData = Boolean(detail.hasApiData);
  const showAddOns = addOns.length > 0;

  return (
    <div className="space-y-5">
      <CampaignAlertBanner messages={detail.alertMessages} />
      <CampaignSummaryMetrics detail={detail} />

      <DetailSection icon={Video} title="Campaign Details">
        <DetailGrid>
          <DetailField label="Campaign Title">
            <EmptyValue>{detail.title}</EmptyValue>
          </DetailField>
          <DetailField label="Deliverables Platform">
            {campaignDetails.platforms.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {campaignDetails.platforms.map((p) => (
                  <PillBadge key={p} tone="blue">
                    {p}
                  </PillBadge>
                ))}
              </div>
            ) : (
              <EmptyValue>{NOT_PROVIDED}</EmptyValue>
            )}
          </DetailField>
          <DetailField label="Video Length">
            <EmptyValue>{campaignDetails.videoLength}</EmptyValue>
          </DetailField>
          <DetailField label="Compensation Type">
            {isPresent(campaignDetails.compensationType) ? (
              <PillBadge tone="green">{campaignDetails.compensationType}</PillBadge>
            ) : (
              <EmptyValue>{NOT_PROVIDED}</EmptyValue>
            )}
          </DetailField>
          <DetailField label="Product / Service URL" fullWidth>
            {isPresent(campaignDetails.productUrl) ? (
              <a
                href={campaignDetails.productUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-[#1E60DB] hover:underline"
              >
                <Link2 className="h-4 w-4" />
                {campaignDetails.productUrl}
              </a>
            ) : (
              <EmptyValue>{NOT_PROVIDED}</EmptyValue>
            )}
          </DetailField>
          <DetailField label="Product Status" fullWidth>
            {isPresent(campaignDetails.productStatus) ? (
              <PillBadge tone="orange" icon={Package}>
                {campaignDetails.productStatus}
              </PillBadge>
            ) : (
              <EmptyValue>{NOT_PROVIDED}</EmptyValue>
            )}
          </DetailField>
        </DetailGrid>
      </DetailSection>

      <DetailSection icon={Target} title="Goals & Target Audience">
        <DetailGrid>
          <DetailField label="Campaign Goal / Objective" fullWidth>
            <EmptyValue>{goals.objective}</EmptyValue>
          </DetailField>
          <DetailField label="Age Range">
            <EmptyValue>{goals.ageRange}</EmptyValue>
          </DetailField>
          <DetailField label="Gender">
            <EmptyValue>{goals.gender}</EmptyValue>
          </DetailField>
          <DetailField label="Location / City">
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-gray-400" />
              <EmptyValue>{goals.locations}</EmptyValue>
            </span>
          </DetailField>
          <DetailField label="Number of Creators">
            <span className="inline-flex items-center gap-1.5">
              <Users className="h-4 w-4 text-gray-400" />
              <EmptyValue>{goals.numberOfCreators}</EmptyValue>
            </span>
          </DetailField>
          <DetailField label="Follower Count">
            <EmptyValue>{goals.followerCount}</EmptyValue>
          </DetailField>
          <DetailField label="Engagement Rate">
            <span className="inline-flex items-center gap-1.5">
              <BarChart3 className="h-4 w-4 text-gray-400" />
              <EmptyValue>{goals.engagementRate}</EmptyValue>
            </span>
          </DetailField>
        </DetailGrid>
      </DetailSection>

      <DetailSection icon={Lightbulb} title="Creative Direction">
        <div className="space-y-5">
          <DetailField label="Key Message" fullWidth>
            {isPresent(creative.keyMessage) ? (
              <InfoBox tone="blue">&ldquo;{creative.keyMessage}&rdquo;</InfoBox>
            ) : (
              <EmptyValue>{NOT_PROVIDED}</EmptyValue>
            )}
          </DetailField>
          <DetailField label="Campaign Brief" fullWidth>
            <OverviewText value={creative.brief} tone="gray" />
          </DetailField>
          <DetailGrid>
            <DetailField label="Hook Style">
              <span className="inline-flex items-center gap-1.5">
                <Zap className="h-4 w-4 text-gray-400" />
                <EmptyValue>{creative.hookStyle}</EmptyValue>
              </span>
            </DetailField>
            <DetailField label="Tone / Voice">
              <EmptyValue>{creative.toneVoice}</EmptyValue>
            </DetailField>
          </DetailGrid>
          <DetailGrid>
            <DetailField label="Problem">
              {isPresent(creative.problem) ? (
                <InfoBox tone="red">
                  <span className="mb-1 block text-xs font-semibold uppercase text-red-600">
                    Problem
                  </span>
                  {creative.problem}
                </InfoBox>
              ) : (
                <EmptyValue>{NOT_PROVIDED}</EmptyValue>
              )}
            </DetailField>
            <DetailField label="Solution">
              {isPresent(creative.solution) ? (
                <InfoBox tone="green">
                  <span className="mb-1 block text-xs font-semibold uppercase text-green-600">
                    Solution
                  </span>
                  {creative.solution}
                </InfoBox>
              ) : (
                <EmptyValue>{NOT_PROVIDED}</EmptyValue>
              )}
            </DetailField>
          </DetailGrid>
          <DetailField label="Call to Action (CTA)" fullWidth>
            {isPresent(creative.cta) ? (
              <InfoBox tone="yellow">
                <span className="inline-flex items-start gap-2">
                  <Zap className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                  {creative.cta}
                </span>
              </InfoBox>
            ) : (
              <EmptyValue>{NOT_PROVIDED}</EmptyValue>
            )}
          </DetailField>
          <DetailField label="Aesthetic Vibes" fullWidth>
            {creative.aestheticVibes.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {creative.aestheticVibes.map((vibe) => (
                  <PillBadge key={vibe} tone="purple" icon={Sparkles}>
                    {vibe}
                  </PillBadge>
                ))}
              </div>
            ) : (
              <EmptyValue>{NOT_PROVIDED}</EmptyValue>
            )}
          </DetailField>
        </div>
      </DetailSection>

      <DetailSection icon={Calendar} title="Timeline & Requirements">
        <DetailGrid cols={3}>
          <DetailField label="Campaign Start Date">
            {isPresent(timelineDetails.campaignStart) ? (
              <PillBadge tone="blue" icon={Calendar}>
                {timelineDetails.campaignStart}
              </PillBadge>
            ) : (
              <EmptyValue>{NOT_PROVIDED}</EmptyValue>
            )}
          </DetailField>
          <DetailField label="Application Deadline">
            {isPresent(timelineDetails.applicationDeadline) ? (
              <PillBadge tone="red" icon={Clock}>
                {timelineDetails.applicationDeadline}
              </PillBadge>
            ) : (
              <EmptyValue>{NOT_PROVIDED}</EmptyValue>
            )}
          </DetailField>
          <DetailField label="Pet Required">
            {isPresent(timelineDetails.petsRequired) ? (
              <PillBadge tone="gray" icon={PawPrint}>
                {timelineDetails.petsRequired}
              </PillBadge>
            ) : (
              <EmptyValue>{NOT_PROVIDED}</EmptyValue>
            )}
          </DetailField>
        </DetailGrid>
      </DetailSection>

      <DetailSection icon={ImagePlus} title="Moodboard">
        <div className="space-y-4">
          <DetailField label="Reference URL" fullWidth>
            {isPresent(moodboard.referenceUrl) ? (
              <a
                href={moodboard.referenceUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-[#1E60DB] hover:underline"
              >
                <Link2 className="h-4 w-4" />
                {moodboard.referenceUrl}
              </a>
            ) : (
              <EmptyValue>{NOT_PROVIDED}</EmptyValue>
            )}
          </DetailField>
          <DetailField label="Uploaded Images" fullWidth>
            {moodboard.images?.length > 0 ? (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {moodboard.images.map((src, i) => (
                  <img
                    key={src || i}
                    src={src}
                    alt={`Moodboard ${i + 1}`}
                    className="aspect-[4/3] rounded-lg object-cover"
                  />
                ))}
              </div>
            ) : (
              <EmptyValue>
                {hasApiData ? "No moodboard images uploaded." : NOT_PROVIDED}
              </EmptyValue>
            )}
          </DetailField>
        </div>
      </DetailSection>

      {showAddOns ? (
        <DetailSection
          icon={Zap}
          title="Add-ons"
          subtitle="Enhance creator deliverables for higher-performing campaigns."
        >
          <div className="space-y-3">
            {addOns.map((addon) => (
              <div
                key={addon.title}
                className="flex items-start justify-between gap-4 rounded-lg border border-gray-200 px-4 py-3"
              >
                <div className="min-w-0">
                  <p className="font-semibold text-gray-900">{addon.title}</p>
                  {addon.description ? (
                    <p className="mt-0.5 text-sm text-gray-500">{addon.description}</p>
                  ) : null}
                  {addon.pricingDetail ? (
                    <p className="mt-1 text-xs text-gray-400">{addon.pricingDetail}</p>
                  ) : null}
                </div>
                {addon.percent ? (
                  <span className="shrink-0 text-sm font-semibold text-[#1E60DB]">
                    {addon.percent}
                  </span>
                ) : null}
              </div>
            ))}
          </div>
        </DetailSection>
      ) : null}

      <OverviewRecentActivity campaignPublicId={campaignPublicId} />
    </div>
  );
}
