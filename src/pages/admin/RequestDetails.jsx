import { ArrowLeft, CalendarDays, CheckCircle2, Mail } from "lucide-react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "../../components/ui/button";
import SectionCard from "./components/requestDetails/SectionCard";
import LabelValueList from "./components/requestDetails/LabelValueList";
import TagList from "./components/requestDetails/TagList";
import SocialLinkItem from "./components/requestDetails/SocialLinkItem";
import FileItem from "./components/requestDetails/FileItem";
import { getRequestDetails } from "./components/requestManagement/requestDetailsData";
import {
  approveCreatorProfileRequest,
  clarifyCreatorProfileRequest,
  deleteCreatorProfileRequest,
  getCreatorProfileRequestById,
  rejectCreatorProfileRequest,
} from "../../services/api/apiservices";
import {
  extractCreatorRequestDetailResponse,
  mapCreatorRequestToDetails,
} from "./components/requestManagement/creatorRequestMappers";

const statusClassMap = {
  pending: "bg-amber-100 text-amber-700",
  approved: "bg-emerald-100 text-emerald-700",
  rejected: "bg-red-100 text-red-600",
  clarification_requested: "bg-blue-100 text-blue-700",
  clarification: "bg-blue-100 text-blue-700",
};

const capitalize = (value = "") => value.charAt(0).toUpperCase() + value.slice(1);

const RequestDetails = () => {
  const { requestId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [actionLoading, setActionLoading] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(true);
  const [detailsError, setDetailsError] = useState("");
  const [activeModal, setActiveModal] = useState(null);
  const [modalInput, setModalInput] = useState("");

  const [data, setData] = useState(() => {
    if (location.state?.request && String(location.state.request.id) === String(requestId)) {
      return mapCreatorRequestToDetails(location.state.request);
    }

    return getRequestDetails(requestId);
  });

  useEffect(() => {
    let mounted = true;

    const loadRequestDetails = async () => {
      if (!requestId) {
        setLoadingDetails(false);
        return;
      }

      try {
        setLoadingDetails(true);
        setDetailsError("");

        const response = await getCreatorProfileRequestById(requestId);
        const rawDetails = extractCreatorRequestDetailResponse(response);

        if (mounted && rawDetails) {
          setData(mapCreatorRequestToDetails(rawDetails));
        }
      } catch (err) {
        if (mounted) {
          setDetailsError(err?.message || err?.error || "Failed to fetch full creator details.");
        }
      } finally {
        if (mounted) {
          setLoadingDetails(false);
        }
      }
    };

    loadRequestDetails();

    return () => {
      mounted = false;
    };
  }, [requestId]);

  const runAction = async (action) => {
    if (!data?.id) return;

    try {
      setActionLoading(true);
      await action();
      navigate("/admin/users", { replace: true });
    } catch (err) {
      window.alert(err?.message || err?.error || "Failed to update request.");
    } finally {
      setActionLoading(false);
    }
  };

  const openModal = (type) => {
    setActiveModal(type);
    setModalInput("");
  };

  const closeModal = () => {
    if (actionLoading) return;
    setActiveModal(null);
    setModalInput("");
  };

  const handleModalSubmit = async () => {
    if (!data?.id) return;

    const trimmedValue = modalInput.trim();
    if (!trimmedValue) return;

    if (activeModal === "reject") {
      await runAction(() => rejectCreatorProfileRequest(data.id, trimmedValue));
      return;
    }

    if (activeModal === "request-info") {
      await runAction(() => clarifyCreatorProfileRequest(data.id, trimmedValue));
    }
  };

  if (loadingDetails && !data) {
    return (
      <div className="p-6 md:p-8">
        <Button variant="outline" onClick={() => navigate("/admin/users")}>Back</Button>
        <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-8 text-gray-600">
          Loading creator details...
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-6 md:p-8">
        <Button variant="outline" onClick={() => navigate("/admin/users")}>Back</Button>
        <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-8 text-gray-600">
          Request details not found.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 md:p-8">
      {detailsError ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
          {detailsError}
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => navigate("/admin/users")}
        className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Request Management
      </button>

      <SectionCard>
        <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
          <div className="flex items-start gap-4">
            <div className=" text-4xl font-medium text-white w-[80px] h-[80px] md:w-[100px] md:h-[100px] rounded-full bg-gradient-to-br from-[#0353a4] to-[#4b96e3] flex items-center justify-center flex-shrink-0">
              {data.name.charAt(0)}
            </div>

            <div>
              <div className="flex items-center gap-3">
                <h1 className="font-['Manrope:Bold',sans-serif] sm:text-[24px] text-sm  md:text-[28px] text-[#1a1a1a] tracking-[-0.8px]">{data.name}</h1>
                <span className="inline-flex items-center justify-center h-[28px] px-3 rounded-full font-['Manrope:Medium',sans-serif] text-[12px] bg-[#dbeafe] text-[#0353a4]">
                  {data.roleLabel}
                </span>
              </div>

              <div className="mt-4 space-y-2 text-gray-500">
                <div className="flex items-center gap-2 text-lg">
                  <Mail className="h-4 w-4" />
                  <span className="font-['Manrope:Regular',sans-serif] text-[14px]">{data.email}</span>
                </div>
                <div className="flex items-center gap-2 text-lg">
                  <CalendarDays className="h-4 w-4" />
                  <span className="font-['Manrope:Regular',sans-serif] text-[14px]">Applied on {data.appliedOn}</span>
                </div>
                <div>
                  <span
                    className={`inline-flex items-center justify-center h-[24px] px-3 rounded-full font-['Manrope:Medium',sans-serif] text-[11px] bg-[#fef3c7] text-[#f59e0b] ${statusClassMap[data.status]
                      }`}
                  >
                    {capitalize(data.status)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {data.status !== "approved" && data.status !== "rejected" ? (
            <div className="flex flex-wrap items-center gap-3">
              <Button
                variant="outline"
                disabled={actionLoading}
                onClick={() => openModal("reject")}
                className="rounded-xl px-5 text-red-500 hover:bg-red-50"
              >
                Reject
              </Button>
              <Button
                variant="outline"
                disabled={actionLoading}
                onClick={() => openModal("request-info")}
                className="rounded-xl px-5"
              >
                Request Info
              </Button>

              <Button
                disabled={actionLoading}
                onClick={() => runAction(() => approveCreatorProfileRequest(data.id))}
                className="rounded-xl px-5 bg-gradient-to-b from-[#0353a4] to-[#4b96e3]"
              >
                Approve Application
              </Button>

              <Button
                variant="outline"
                disabled={actionLoading}
                onClick={() => {
                  const shouldDelete = window.confirm(
                    "Are you sure you want to delete this creator profile request?"
                  );
                  if (!shouldDelete) return;
                  runAction(() => deleteCreatorProfileRequest(data.id));
                }}
                className="hidden rounded-xl px-5 text-red-500 hover:bg-red-50"
              >
                Delete Request
              </Button>
            </div>
          ) : null}
        </div>
      </SectionCard>

      <div className="grid gap-6 xl:grid-cols-2">
        <SectionCard title="Basic Information" titleClassName="font-['Manrope:SemiBold',sans-serif] text-[16px] text-[#1a1a1a]">
          <LabelValueList items={data.basicInfo} />
        </SectionCard>

        <SectionCard title="Location Details" titleClassName="font-['Manrope:SemiBold',sans-serif] text-[16px] text-[#1a1a1a]">
          <LabelValueList items={data.locationDetails} />
        </SectionCard>

        <SectionCard title="Content & Niche" titleClassName="font-['Manrope:SemiBold',sans-serif] text-[16px] text-[#1a1a1a]">
          <div className="space-y-4">
            <div>
              <div className="font-['Manrope:Regular',sans-serif] text-[14px] mb-2 text-[#1a1a1a]">Languages Spoken</div>
              {data.contentNiche.languages.length ? <TagList items={data.contentNiche.languages} /> : "—"}
            </div>

            <LabelValueList
              items={[
                { label: "Primary Niche", value: data.contentNiche.primaryNiche },
                { label: "Secondary Niche", value: data.contentNiche.secondaryNiche },
                { label: "Other Niche", value: data.contentNiche.otherNiche || "—" },
              ]}
            />
          </div>
        </SectionCard>

        <SectionCard title="Skills & Content Types" titleClassName="font-['Manrope:SemiBold',sans-serif] text-[16px] text-[#1a1a1a]">
          {data.skillsAndContentTypes.length ? (
            <TagList items={data.skillsAndContentTypes} />
          ) : (
            <p className="text-gray-500">No content tags provided.</p>
          )}
        </SectionCard>

        <SectionCard title="Demographics" titleClassName="font-['Manrope:SemiBold',sans-serif] text-[16px] text-[#1a1a1a]">
          {data.demographics.length ? (
            <LabelValueList items={data.demographics} />
          ) : (
            <p className="text-gray-500">No demographics submitted.</p>
          )}
        </SectionCard>

        {(data.identityVerification?.idNumber &&
          data.identityVerification.idNumber !== "—") ||
        data.identityVerification?.documents?.length ? (
          <SectionCard
            title="Identity Verification"
            titleClassName="font-['Manrope:SemiBold',sans-serif] text-[16px] text-[#1a1a1a]"
          >
            <LabelValueList
              items={[
                {
                  label: "South African Citizen",
                  value: data.identityVerification.isSouthAfricanCitizen || "—",
                },
                { label: "ID / Passport Number", value: data.identityVerification.idNumber },
              ]}
            />
            {data.identityVerification.documents?.length ? (
              <div className="mt-4 grid gap-3">
                {data.identityVerification.documents.map((file) => (
                  <FileItem key={`${file.name}-${file.url}`} {...file} />
                ))}
              </div>
            ) : null}
          </SectionCard>
        ) : null}

        <SectionCard title="Social Media Links" titleClassName="font-['Manrope:SemiBold',sans-serif] text-[16px] text-[#1a1a1a]">
          <div className="space-y-3">
            {data.socialLinks.length ? (
              data.socialLinks.map((item) => (
                <SocialLinkItem
                  key={item.platform}
                  platform={item.platform}
                  value={item.value}
                  url={item.url}
                />
              ))
            ) : (
              <p className="text-gray-500">No social links submitted.</p>
            )}
          </div>
        </SectionCard>
      </div>

      <SectionCard title="Portfolio / Showreel" titleClassName="font-['Manrope:SemiBold',sans-serif] text-[16px] text-[#1a1a1a]">
        <div className="grid gap-3 xl:grid-cols-2">
          {data.portfolio.files.length ? (
            data.portfolio.files.map((file) => <FileItem key={file.name} {...file} />)
          ) : (
            <p className="text-gray-500">No portfolio files submitted.</p>
          )}
        </div>

        {data.portfolio.externalLink ? (
          <div className="mt-4 text-lg">
            <span className="text-gray-500">External Portfolio Link</span>
            <Link
              to={data.portfolio.externalLink}
              target="_blank"
              className="ml-4 font-medium text-blue-600 hover:underline"
            >
              {data.portfolio.externalLink}
            </Link>
          </div>
        ) : null}
      </SectionCard>





      {activeModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-[28px] bg-white p-7 md:p-8">
            <h2 className="font-['Manrope:Bold',sans-serif] text-[22px] text-[#1a1a1a] mb-3">
              {activeModal === "reject" ? "Reject Application" : "Request More Information"}
            </h2>

            <p className="font-['Manrope:Regular',sans-serif] text-[14px] text-[#64748b] mb-4">
              {activeModal === "reject"
                ? "Please provide a reason for rejecting this application:"
                : "Send a message to the applicant requesting additional information:"}
            </p>

            <textarea
              value={modalInput}
              onChange={(event) => setModalInput(event.target.value)}
              placeholder={
                activeModal === "reject" ? "Enter rejection reason..." : "Enter your message..."
              }
              rows={6}
              className="w-full px-4 py-3 border border-[#e5e7eb] rounded-[8px] font-['Manrope:Regular',sans-serif] text-[14px] text-[#1a1a1a] placeholder:text-[#94a3b8] focus:outline-none focus:border-[#0353a4] focus:ring-2 focus:ring-[#0353a4]/20 resize-none"
            />

            <div className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-2">
              <button
                type="button"
                onClick={closeModal}
                disabled={actionLoading}
                className="flex-1 h-[48px] border border-[#e5e7eb] rounded-[8px] font-['Manrope:Medium',sans-serif] text-[14px] text-[#64748b] hover:bg-[#f8f9fb] transition-colors"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleModalSubmit}
                disabled={actionLoading || !modalInput.trim()}
                className={`flex-1 h-[48px]  rounded-[8px] font-['Manrope:Medium',sans-serif] text-[14px] text-white hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed ${activeModal === "reject"
                    ? "bg-gradient-to-b from-[#dc2626] to-[#b91c1c]"
                    : "bg-gradient-to-b from-[#0353a4] to-[#4b96e3]"
                  }`}
              >
                {actionLoading
                  ? "Please wait..."
                  : activeModal === "reject"
                    ? "Reject Application"
                    : "Send Request"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default RequestDetails;
