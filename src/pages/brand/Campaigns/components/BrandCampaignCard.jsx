import React from "react";
import { Dropdown } from "antd";
import {
  Calendar,
  Clock,
  Eye,
  Image,
  Megaphone,
  MoreHorizontal,
  Pencil,
  Trash2,
  Users,
} from "lucide-react";
import {
  canDeleteCampaign,
  canEditCampaign,
  canPublishCampaign,
  getStatusBadgeClasses,
  isDraftCampaign,
} from "../utils/campaignCardUtils";

const STAT_ITEMS = [
  { key: "applications", label: "Applications" },
  { key: "invited", label: "Invited" },
  { key: "hired", label: "Hired" },
  { key: "assetsSubmitted", label: "Submissions" },
  { key: "approved", label: "Approved" },
  { key: "pendingReviews", label: "Under Review", highlight: true },
];

function CardActionButton({
  variant = "outline",
  icon: Icon,
  children,
  onClick,
  className = "",
}) {
  const base =
    "inline-flex h-9 items-center justify-center gap-2 rounded-lg px-4 text-sm font-medium transition-colors";
  const styles =
    variant === "primary"
      ? `${base} btn-gradient text-white`
      : variant === "danger"
        ? `${base} border border-red-200 bg-white text-red-600 hover:bg-red-50`
        : `${base} border border-gray-200 bg-white text-gray-600 hover:bg-gray-50`;

  return (
    <button
      type="button"
      className={[styles, className].filter(Boolean).join(" ")}
      onClick={onClick}
    >
      {Icon ? <Icon className="h-4 w-4 shrink-0" strokeWidth={2} /> : null}
      {children}
    </button>
  );
}

export default function BrandCampaignCard({
  campaign,
  onViewCampaign,
  onViewCreators,
  onViewAssets,
  onAction,
}) {
  const stats = campaign.stats ?? {};
  const timeline = campaign.timeline ?? { text: "—", tone: "neutral" };
  const pendingReviews = stats.pendingReviews ?? 0;

  const raw = campaign.raw ?? campaign;
  const isDraft = isDraftCampaign(raw);
  const showEdit = canEditCampaign(raw);
  const showDelete = canDeleteCampaign(raw);
  const showPublish = canPublishCampaign(raw);

  const menuItems = isDraft
    ? [
        { key: "view", label: "View", icon: <Eye className="h-4 w-4" /> },
        { key: "edit", label: "Edit", icon: <Pencil className="h-4 w-4" /> },
        {
          key: "delete",
          label: "Delete",
          icon: <Trash2 className="h-4 w-4" />,
          danger: true,
        },
      ]
    : [
        { key: "view", label: "View", icon: <Eye className="h-4 w-4" /> },
        ...(showEdit
          ? [{ key: "edit", label: "Edit", icon: <Pencil className="h-4 w-4" /> }]
          : []),
        ...(showDelete
          ? [
              {
                key: "delete",
                label: "Delete",
                icon: <Trash2 className="h-4 w-4" />,
                danger: true,
              },
            ]
          : []),
      ];

  return (
    <article className="rounded-xl border border-gray-200 bg-white p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2.5">
            <h3 className="text-lg font-semibold leading-snug text-gray-900">
              {campaign.title}
            </h3>
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusBadgeClasses(
                campaign.statusKey
              )}`}
            >
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-current" />
              {campaign.status}
            </span>
          </div>
          <p className="mt-1.5 text-sm text-gray-500">
            ID: {campaign.displayId} · Budget: {campaign.budget}
          </p>
        </div>

        <Dropdown
          trigger={["click"]}
          menu={{
            items: menuItems.map(({ key, label, icon, danger }) => ({
              key,
              label: (
                <span
                  className={`inline-flex items-center gap-2 ${
                    danger ? "text-red-600" : ""
                  }`}
                >
                  {icon}
                  {label}
                </span>
              ),
            })),
            onClick: ({ key, domEvent }) => {
              domEvent?.stopPropagation();
              onAction?.(key, raw);
            },
          }}
        >
          <button
            type="button"
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-gray-400 hover:bg-gray-50 hover:text-gray-600"
            aria-label="Campaign options"
            onClick={(e) => e.stopPropagation()}
          >
            <MoreHorizontal className="h-5 w-5" />
          </button>
        </Dropdown>
      </div>

      <div className="mt-5 overflow-x-auto border-y border-gray-100 py-5">
        <div className="flex min-w-[640px] items-stretch">
          {STAT_ITEMS.map(({ key, label, highlight }, index) => {
            const isHighlighted = highlight && stats[key] > 0;
            return (
              <React.Fragment key={key}>
                {index > 0 ? (
                  <div className="w-px shrink-0 self-stretch bg-gray-200" />
                ) : null}
                <div className="flex min-w-0 flex-1 flex-col items-center justify-center px-2 text-center">
                  <span
                    className={`text-xl font-semibold leading-none ${
                      isHighlighted ? "text-red-500" : "text-gray-900"
                    }`}
                  >
                    {stats[key]}
                  </span>
                  <span
                    className={`mt-1.5 text-xs leading-tight ${
                      isHighlighted ? "text-red-500" : "text-gray-500"
                    }`}
                  >
                    {label}
                  </span>
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </div>

      <div className="mt-4 rounded-lg bg-gray-50 px-4 py-3.5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-500">
            <span className="inline-flex items-center gap-2">
              <Calendar className="h-4 w-4 shrink-0 text-gray-400" strokeWidth={1.75} />
              <span>
                Start:{" "}
                <span className="font-semibold text-gray-800">{campaign.startDate}</span>
              </span>
            </span>
            <span className="inline-flex items-center gap-2">
              <Calendar className="h-4 w-4 shrink-0 text-gray-400" strokeWidth={1.75} />
              <span>
                End:{" "}
                <span className="font-semibold text-gray-800">{campaign.endDate}</span>
              </span>
            </span>
          </div>

          <span
            className={`inline-flex items-center gap-1.5 text-sm font-medium ${
              timeline.tone === "completed"
                ? "text-purple-600"
                : timeline.tone === "active"
                  ? "text-[#1E60DB]"
                  : "text-gray-500"
            }`}
          >
            {timeline.tone === "active" ? (
              <Clock className="h-4 w-4 shrink-0" strokeWidth={2} />
            ) : null}
            {timeline.text}
          </span>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {isDraft ? (
          <div className="flex flex-wrap items-center gap-2">
            {showPublish ? (
              <CardActionButton
                variant="primary"
                icon={Megaphone}
                onClick={() => onAction?.("publish", raw)}
              >
                Publish Campaign
              </CardActionButton>
            ) : null}
            <CardActionButton
              icon={Pencil}
              onClick={() => onAction?.("edit", raw)}
            >
              Edit
            </CardActionButton>
            <CardActionButton
              variant="danger"
              icon={Trash2}
              onClick={() => onAction?.("delete", raw)}
            >
              Delete
            </CardActionButton>
            <CardActionButton icon={Eye} onClick={() => onViewCampaign?.(campaign)}>
              View
            </CardActionButton>
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-2">
            <CardActionButton
              variant="primary"
              icon={Eye}
              onClick={() => onViewCampaign?.(campaign)}
            >
              View Campaign
            </CardActionButton>
            <CardActionButton icon={Users} onClick={() => onViewCreators?.(campaign)}>
              View Creators
            </CardActionButton>
            <CardActionButton icon={Image} onClick={() => onViewAssets?.(campaign)}>
              View Assets
            </CardActionButton>
          </div>
        )}

        {pendingReviews > 0 ? (
          <span className="inline-flex h-9 shrink-0 items-center gap-1.5 self-start rounded-full bg-red-50 px-3.5 text-sm font-medium text-red-500 sm:self-auto">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-red-500" />
            {pendingReviews} review{pendingReviews === 1 ? "" : "s"} needed
          </span>
        ) : null}
      </div>
    </article>
  );
}
