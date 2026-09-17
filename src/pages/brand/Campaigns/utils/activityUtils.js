import {
  Activity,
  CheckCircle2,
  FileText,
  Mail,
  RefreshCw,
  Send,
  UserCheck,
  UserPlus,
  UserX,
  Bell,
  XCircle,
  Sparkles,
} from "lucide-react";

export const ACTIVITY_FILTERS = [
  { key: "all", label: "All", eventType: null },
  { key: "application_received", label: "Applications", eventType: "application_received" },
  { key: "invitation_sent", label: "Invitations", eventType: "invitation_sent" },
  { key: "submission_created", label: "Submissions", eventType: "submission_created" },
  { key: "revision_requested", label: "Revisions", eventType: "revision_requested" },
  { key: "submission_approved", label: "Approvals", eventType: "submission_approved" },
];

const ACTOR_LABELS = {
  brand: "Brand",
  creator: "Creator",
  system: "System",
};

const EVENT_CONFIG = {
  campaign_created: {
    title: "Campaign Created",
    icon: Activity,
    className: "bg-blue-50 text-blue-600 ring-blue-100",
    description: (m) =>
      m?.campaignTitle
        ? `"${m.campaignTitle}" was published.`
        : "Campaign was published.",
  },
  invitation_sent: {
    title: "Invitation Sent",
    icon: Send,
    className: "bg-orange-50 text-orange-600 ring-orange-100",
    description: (m) =>
      m?.invitationPublicId
        ? `Invitation ${m.invitationPublicId} was sent to a creator.`
        : "Invitation sent to a creator.",
  },
  invitation_accepted: {
    title: "Invitation Accepted",
    icon: UserCheck,
    className: "bg-purple-50 text-purple-600 ring-purple-100",
    description: () => "A creator accepted the campaign invitation.",
  },
  invitation_declined: {
    title: "Invitation Declined",
    icon: UserX,
    className: "bg-gray-100 text-gray-600 ring-gray-200",
    description: () => "A creator declined the campaign invitation.",
  },
  application_received: {
    title: "Application Received",
    icon: UserPlus,
    className: "bg-indigo-50 text-indigo-600 ring-indigo-100",
    description: (m) =>
      m?.applicationId
        ? `New application #${m.applicationId} was submitted.`
        : "A creator submitted an application.",
  },
  application_approved: {
    title: "Application Approved",
    icon: UserCheck,
    className: "bg-emerald-50 text-emerald-600 ring-emerald-100",
    description: (m) =>
      m?.jobPublicId
        ? `Application approved — job ${m.jobPublicId} created.`
        : "Application approved and job created.",
  },
  submission_created: {
    title: "Submission Received",
    icon: FileText,
    className: "bg-blue-50 text-blue-600 ring-blue-100",
    description: (m) => {
      const id = m?.submissionPublicId || "Submission";
      const assets =
        m?.assetCount != null ? ` (${m.assetCount} asset${m.assetCount === 1 ? "" : "s"})` : "";
      return `${id} was submitted${assets}.`;
    },
  },
  submission_resubmitted: {
    title: "Submission Resubmitted",
    icon: RefreshCw,
    className: "bg-sky-50 text-sky-600 ring-sky-100",
    description: (m) => {
      const id = m?.submissionPublicId || "Submission";
      const rev =
        m?.revisionNumber != null ? ` (revision ${m.revisionNumber})` : "";
      return `${id} was resubmitted${rev}.`;
    },
  },
  submission_approved: {
    title: "Submission Approved",
    icon: CheckCircle2,
    className: "bg-green-50 text-green-600 ring-green-100",
    description: (m) => {
      const id = m?.submissionPublicId || "Submission";
      return `${id} was approved.`;
    },
  },
  submission_auto_approved: {
    title: "Auto-Approved",
    icon: Sparkles,
    className: "bg-green-50 text-green-600 ring-green-100",
    description: (m) => {
      const id = m?.submissionPublicId || "Submission";
      return `${id} was auto-approved after the review deadline.`;
    },
  },
  revision_requested: {
    title: "Revision Requested",
    icon: RefreshCw,
    className: "bg-amber-50 text-amber-700 ring-amber-100",
    description: (m) => {
      const id = m?.submissionPublicId || "Submission";
      const snippet = m?.feedbackSnippet
        ? ` — "${m.feedbackSnippet}"`
        : "";
      return `Revision requested on ${id}${snippet}.`;
    },
  },
  submission_rejected: {
    title: "Submission Rejected",
    icon: XCircle,
    className: "bg-red-50 text-red-600 ring-red-100",
    description: (m) => {
      const id = m?.submissionPublicId || "Submission";
      const snippet = m?.feedbackSnippet
        ? ` — "${m.feedbackSnippet}"`
        : "";
      return `${id} was sent back for major changes${snippet}.`;
    },
  },
  reminder_sent: {
    title: "Review Reminder",
    icon: Bell,
    className: "bg-rose-50 text-rose-600 ring-rose-100",
    description: (m) => {
      const id = m?.submissionPublicId || "a submission";
      return `Creator sent a review reminder for ${id}.`;
    },
  },
};

const DEFAULT_EVENT = {
  title: "Activity",
  icon: Mail,
  className: "bg-gray-100 text-gray-600 ring-gray-200",
  description: () => "Campaign activity recorded.",
};

export function getActorLabel(actorType) {
  return ACTOR_LABELS[actorType] || "Unknown";
}

export function mapActivityEntry(entry) {
  const config = EVENT_CONFIG[entry?.eventType] || DEFAULT_EVENT;
  const metadata = entry?.metadata || {};

  return {
    id: entry?.id,
    eventType: entry?.eventType,
    actorType: entry?.actorType,
    actorLabel: getActorLabel(entry?.actorType),
    title: config.title,
    description: config.description(metadata),
    timelineLabel: entry?.timelineLabel || "—",
    createdAt: entry?.createdAt,
    metadata,
    icon: config.icon,
    iconClassName: config.className,
  };
}

export function parseActivityResponse(response) {
  return {
    activity: Array.isArray(response?.activity) ? response.activity : [],
    pagination: response?.pagination || {
      totalItems: 0,
      totalPages: 1,
      currentPage: 1,
    },
  };
}
