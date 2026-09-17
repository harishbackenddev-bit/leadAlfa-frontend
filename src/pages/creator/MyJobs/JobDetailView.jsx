import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { RotateCcw } from "lucide-react";
import CreatorCampaignDetailBanner from "../ExploreCampaigns/components/CreatorCampaignDetailBanner";
import CampaignViewContent from "../../../components/campaign/CampaignViewContent";
import { getSidebarPaymentRange } from "../../../components/campaign/campaignViewUtils";
import PingBrandModal from "./components/PingBrandModal";
import RevisionBrandFeedback from "./components/revision/RevisionBrandFeedback";
import RevisionSubmission from "./components/revision/RevisionSubmission";
import RevisionResubmitForm from "./components/revision/RevisionResubmitForm";
import RevisionSidebar from "./components/revision/RevisionSidebar";
import {
  getActiveCampaignsQueryOptions,
  getCreatorJobsQueryOptions,
  getMyJobsQueryOptions,
  getWorkSubmissionQueryOptions,
  invalidateMyJobs,
  invalidateWorkSubmission,
} from "../../../services/tanstack/queryService";
import {
  calculateCampaignDaysLeft,
  getCampaignBrandInfo,
} from "../../../utils/creatorCampaignMappers";
import {
  buildJobCardForRoute,
  enrichJobWithActiveCampaign,
  findActiveCampaignByRouteId,
  findActiveCampaignForJob,
  findCreatorJobPublicIdForRoute,
  isPendingApplication,
  isRejectedApplication,
  mapApplicationToJob,
  mapJobToCard,
  resolveJobFromRouteId,
} from "./myJobsMapper";
import {
  enrichJobWithSubmission,
  getLatestRevision,
  mapSubmissionToRevisionUI,
  mapSubmissionToYourSubmissionUI,
  mapRevisionStatusToJobStatus,
  parseWorkSubmissionResponse,
  resolveJobPublicId,
  isCreatorJobPublicId,
  revisionNeedsResubmit,
} from "./workSubmissionMapper";
import { resubmitWork } from "../../../services/api/workSubmissionService";
import { useNotification } from "../../../context/NotificationContext";
import {
  canPingBrand,
  formatNextPingLabel,
  getNextReminderAvailableAt,
  readStoredNextReminderAt,
} from "./reminderCooldown";
import bannerImage from "../../../assets/images/campaign/bannerImage.jpg";

export default function JobDetailView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { showNotification } = useNotification();
  const [showPingModal, setShowPingModal] = useState(
    location.state?.openPingModal === true
  );
  const [resubmitOpen, setResubmitOpen] = useState(true);
  const [pingCooldownAt, setPingCooldownAt] = useState(null);
  const resubmitRef = useRef(null);
  const didAutoOpenResubmit = useRef(false);

  const { data: jobsResp, isLoading: jobsLoading } = useQuery(
    getMyJobsQueryOptions({ page: 1, limit: 100 })
  );

  const { data: creatorJobsResp, isLoading: creatorJobsLoading } = useQuery(
    getCreatorJobsQueryOptions({ page: 1, limit: 100 })
  );

  const { data: activeCampaignsResp, isLoading: activeCampaignsLoading } =
    useQuery(getActiveCampaignsQueryOptions());

  const jobs = jobsResp?.jobs || [];
  const creatorJobs = creatorJobsResp?.jobs || [];
  const activeCampaignsList =
    activeCampaignsResp?.campaigns ||
    activeCampaignsResp?.data?.campaigns ||
    [];

  // Merge my-jobs + creator/jobs so JOB-… id and workStatus are available.
  const baseJobMeta = useMemo(() => {
    const fromMyJobs = buildJobCardForRoute(id, jobs, activeCampaignsList);
    const fromCreatorJobs = buildJobCardForRoute(
      id,
      creatorJobs,
      activeCampaignsList
    );

    if (!fromMyJobs && !fromCreatorJobs) return null;

    const jobPublicId =
      resolveJobPublicId(fromCreatorJobs) ||
      resolveJobPublicId(fromMyJobs) ||
      fromCreatorJobs?.jobPublicId ||
      fromMyJobs?.jobPublicId ||
      null;

    return {
      ...(fromMyJobs || {}),
      ...(fromCreatorJobs || {}),
      jobPublicId,
      publicId: jobPublicId || fromCreatorJobs?.publicId || fromMyJobs?.publicId,
      workStatus:
        fromCreatorJobs?.workStatus !== undefined
          ? fromCreatorJobs.workStatus
          : fromMyJobs?.workStatus,
      payment: fromCreatorJobs?.payment || fromMyJobs?.payment,
      brandName: fromCreatorJobs?.brandName || fromMyJobs?.brandName,
      brandLogo: fromCreatorJobs?.brandLogo || fromMyJobs?.brandLogo,
      // Application lifecycle (pending/rejected/accepted) comes from my-applications.
      status: fromMyJobs?.status || fromCreatorJobs?.status,
      campaign: {
        ...(fromMyJobs?.campaign || {}),
        ...(fromCreatorJobs?.campaign || {}),
      },
      raw: fromCreatorJobs?.raw || fromMyJobs?.raw,
    };
  }, [id, jobs, creatorJobs, activeCampaignsList]);

  const jobPublicId = useMemo(() => {
    if (isCreatorJobPublicId(location.state?.jobPublicId)) {
      return location.state.jobPublicId;
    }
    return (
      resolveJobPublicId(baseJobMeta) ||
      findCreatorJobPublicIdForRoute(id, creatorJobs, activeCampaignsList) ||
      findCreatorJobPublicIdForRoute(id, jobs, activeCampaignsList)
    );
  }, [
    baseJobMeta,
    id,
    jobs,
    creatorJobs,
    activeCampaignsList,
    location.state?.jobPublicId,
  ]);

  const {
    data: submissionResp,
    isLoading: submissionLoading,
    isFetching: submissionFetching,
    isError: submissionError,
  } = useQuery(getWorkSubmissionQueryOptions(jobPublicId));

  const jobMeta = useMemo(() => {
    if (!baseJobMeta) return null;
    if (!submissionResp) return baseJobMeta;
    return enrichJobWithSubmission(baseJobMeta, submissionResp);
  }, [baseJobMeta, submissionResp]);

  const campaign = useMemo(() => {
    const fromCard = jobMeta?.campaign;
    if (fromCard?.campaignGoal || fromCard?.creativeDirection) {
      return fromCard;
    }

    const fromActive =
      findActiveCampaignByRouteId(activeCampaignsList, id) ||
      (fromCard?.id != null
        ? activeCampaignsList.find(
            (c) => String(c.id) === String(fromCard.id)
          )
        : null);

    if (fromActive) {
      return { ...fromCard, ...fromActive };
    }

    if (fromCard) return fromCard;

    const activeOnly = findActiveCampaignByRouteId(activeCampaignsList, id);
    if (activeOnly) {
      return activeOnly;
    }

    return null;
  }, [jobMeta, activeCampaignsList, id]);

  const pendingJobMeta = useMemo(() => {
    if (jobMeta) return null;

    const rawApplication = resolveJobFromRouteId(id, jobs, activeCampaignsList);
    if (rawApplication) {
      let card = mapJobToCard(rawApplication);
      const activeCampaign =
        findActiveCampaignByRouteId(activeCampaignsList, id) ||
        findActiveCampaignForJob(activeCampaignsList, card);
      if (activeCampaign) {
        card = enrichJobWithActiveCampaign(card, activeCampaign);
      }
      return card;
    }

    const activeOnly = findActiveCampaignByRouteId(activeCampaignsList, id);
    if (!activeOnly) return null;
    return mapApplicationToJob({
      campaign: activeOnly,
      applicationStatus: "pending",
    });
  }, [jobMeta, activeCampaignsList, id, jobs]);

  const displayJobMeta = jobMeta || pendingJobMeta;
  const displayCampaign = campaign || pendingJobMeta?.campaign;
  const applicationPending = isPendingApplication(displayJobMeta);
  const applicationRejected = isRejectedApplication(displayJobMeta);

  const submission = parseWorkSubmissionResponse(submissionResp).submission;
  const latestRevision = getLatestRevision(submission);
  const statusFromSubmission = mapRevisionStatusToJobStatus(
    latestRevision?.status
  );
  const status =
    statusFromSubmission ||
    displayJobMeta?.status ||
    (displayJobMeta?.workStatus === "resubmit" ? "in_revision" : null);

  const isRevision =
    displayJobMeta?.workStatus === "resubmit" ||
    status === "in_revision" ||
    revisionNeedsResubmit(latestRevision);

  const revision = useMemo(() => {
    if (!isRevision || !submission) return null;
    return mapSubmissionToRevisionUI(submission, {
      ...displayJobMeta,
      brandName:
        displayJobMeta?.brandName ||
        displayCampaign?.brand?.companyName ||
        displayCampaign?.brand?.name,
    });
  }, [isRevision, submission, displayJobMeta, displayCampaign]);

  // Always show full submission history (all attempts, notes, approved assets).
  const yourSubmission = useMemo(
    () => mapSubmissionToYourSubmissionUI(submission),
    [submission]
  );

  useEffect(() => {
    if (!isRevision || didAutoOpenResubmit.current) return;
    if (location.state?.openResubmit === false) return;
    didAutoOpenResubmit.current = true;
    setResubmitOpen(true);
  }, [isRevision, location.state?.openResubmit]);

  const pingJobMeta = useMemo(() => {
    if (!displayJobMeta) return null;
    const stored = jobPublicId
      ? readStoredNextReminderAt(jobPublicId)?.toISOString()
      : null;
    return {
      ...displayJobMeta,
      jobPublicId: jobPublicId || displayJobMeta.jobPublicId,
      lastReminderSentAt:
        latestRevision?.lastReminderSentAt || displayJobMeta.lastReminderSentAt,
      nextReminderAvailableAt:
        pingCooldownAt ||
        stored ||
        displayJobMeta.nextReminderAvailableAt ||
        null,
    };
  }, [displayJobMeta, jobPublicId, latestRevision, pingCooldownAt]);

  const pingAllowed = canPingBrand(pingJobMeta || {});
  const pingCooldownLabel = formatNextPingLabel(
    getNextReminderAvailableAt(pingJobMeta || {})
  );

  const loading =
    jobsLoading ||
    activeCampaignsLoading ||
    creatorJobsLoading ||
    (jobsResp == null && activeCampaignsResp == null);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="inline-block h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!displayCampaign) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-red-600">Job not found.</p>
      </div>
    );
  }

  const bannerUrl =
    displayCampaign?.media?.coverImage?.url ||
    displayCampaign?.media?.moodboards?.[0]?.url ||
    displayCampaign?.thumbnail?.url ||
    bannerImage;

  const { brandId, companyName, brandLogo, isVerified, brand } =
    getCampaignBrandInfo(displayCampaign);
  const daysLeft = calculateCampaignDaysLeft(displayCampaign);

  const paymentLabel =
    displayJobMeta?.payment && displayJobMeta.payment !== "—"
      ? displayJobMeta.payment
      : getSidebarPaymentRange(displayCampaign);

  const submissionPending =
    Boolean(jobPublicId) &&
    (submissionLoading || submissionFetching) &&
    !submissionResp;

  const handleSubmitAssignment = () => {
    navigate(`/creator/my-jobs/${id}/submit`, {
      state: { showNote: true, jobPublicId },
    });
  };

  const openResubmit = () => {
    setResubmitOpen(true);
    requestAnimationFrame(() => {
      resubmitRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const handleResubmit = async (payload) => {
    if (!jobPublicId) {
      throw new Error("Job ID is missing. Please refresh and try again.");
    }
    await resubmitWork(jobPublicId, payload);
    await Promise.all([
      invalidateMyJobs(),
      invalidateWorkSubmission(jobPublicId),
    ]);
    showNotification({
      type: "success",
      message: "Revision submitted",
      description: "Your updated work has been sent to the brand for review.",
    });
    setResubmitOpen(false);
    navigate("/creator/my-jobs");
  };

  const sidebarApplyLabel =
    applicationPending ||
    applicationRejected ||
    status === "in_review" ||
    status === "completed" ||
    isRevision
      ? null
      : "Submit Assignment";

  const brandFeedback =
    isRevision && revision?.feedback?.length ? (
      <RevisionBrandFeedback feedback={revision.feedback} />
    ) : isRevision && !submissionPending ? (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-900">
        The brand requested changes. Please re-submit your revised content
        below.
      </div>
    ) : null;

  const revisionBottom = (
    <div className="space-y-6">
      {yourSubmission ? (
        <RevisionSubmission submission={yourSubmission} />
      ) : null}
      {isRevision ? (
        <div ref={resubmitRef}>
          <RevisionResubmitForm
            open={resubmitOpen}
            onToggle={() => setResubmitOpen((v) => !v)}
            currentRevision={revision?.currentRevision}
            maxRevisions={revision?.maxRevisions ?? 3}
            jobPublicId={jobPublicId}
            onCancel={() => setResubmitOpen(false)}
            onSubmit={handleResubmit}
          />
        </div>
      ) : null}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-[1920px] px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-4 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => navigate("/creator/my-jobs")}
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700"
          >
            ← Back to My Jobs
          </button>
          {isRevision ? (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-300 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
              <RotateCcw className="h-3.5 w-3.5" aria-hidden />
              Revision Requested
            </span>
          ) : null}
        </div>

        <CreatorCampaignDetailBanner
          imageUrl={bannerUrl}
          altText={
            displayCampaign?.campaignTitle ||
            displayCampaign?.title ||
            "Job banner"
          }
          campaignTitle={
            displayCampaign?.campaignTitle ||
            displayCampaign?.title ||
            "Campaign"
          }
          companyName={companyName || displayJobMeta?.brandName}
          brandLogo={brandLogo || displayJobMeta?.brandLogo}
          isVerified={isVerified}
          status={displayCampaign?.status}
          daysLeft={daysLeft}
          brandProfileTo={`/creator/brands/${brandId || id}`}
          brandProfileState={{
            from: location.pathname,
            backLabel: "Back to Job Details",
            brand: { ...brand, companyName, brandLogo, isVerified },
          }}
        />

        {status === "in_review" && !isRevision ? (
          <div className="mb-6 flex flex-col items-end gap-1.5">
            <button
              type="button"
              onClick={() => setShowPingModal(true)}
              disabled={!pingAllowed}
              className={`rounded-xl border px-5 py-2.5 text-sm font-semibold ${
                pingAllowed
                  ? "border-[#0c7bb3] text-[#0c7bb3] hover:bg-blue-50"
                  : "cursor-not-allowed border-gray-200 text-gray-400"
              }`}
            >
              Ping Brand
            </button>
            {!pingAllowed && pingCooldownLabel ? (
              <p className="text-xs text-gray-500">{pingCooldownLabel}</p>
            ) : null}
          </div>
        ) : null}

        {submissionPending ? (
          <div className="mb-6 rounded-xl border border-gray-200 bg-white px-4 py-8 text-center text-sm text-gray-500">
            Loading submission details...
          </div>
        ) : null}

        {applicationRejected ? (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            The brand declined your application for this campaign.
          </div>
        ) : null}

        {applicationPending ? (
          <div className="mb-6 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-900">
            Your proposal is with the brand for review. You&apos;ll be able to
            submit work once they accept your application.
          </div>
        ) : null}

        {!jobPublicId &&
        !submissionPending &&
        !applicationPending &&
        !applicationRejected ? (
          <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            Could not resolve this job&apos;s submission ID. Open the job from
            My Jobs, or refresh the page.
          </div>
        ) : null}

        {submissionError ? (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            Failed to load submission details. Please try again.
          </div>
        ) : null}

        <CampaignViewContent
          campaign={displayCampaign}
          onApplyClick={
            sidebarApplyLabel &&
            status === "active" &&
            !applicationPending &&
            !applicationRejected
              ? handleSubmitAssignment
              : undefined
          }
          applyLabel="Submit Assignment"
          topSlot={brandFeedback}
          sidebarSlot={
            isRevision ? (
              <RevisionSidebar
                revision={
                  revision || {
                    compensation: paymentLabel,
                    releaseNote: "Released upon brand approval",
                    timeline: [],
                  }
                }
                paymentLabel={paymentLabel}
                onSubmitRevisions={openResubmit}
              />
            ) : null
          }
          bottomSlot={
            yourSubmission || isRevision ? revisionBottom : null
          }
        />
      </div>

      {showPingModal && pingJobMeta ? (
        <PingBrandModal
          job={pingJobMeta}
          jobPublicId={jobPublicId}
          onClose={() => setShowPingModal(false)}
          onSend={(_message, result) => {
            if (result?.nextReminderAvailableAt) {
              setPingCooldownAt(result.nextReminderAvailableAt);
            }
            showNotification({
              type: "success",
              message: "Reminder sent",
              description:
                formatNextPingLabel(result?.nextReminderAvailableAt) ||
                "You can send another reminder in 24 hours.",
            });
          }}
        />
      ) : null}
    </div>
  );
}
