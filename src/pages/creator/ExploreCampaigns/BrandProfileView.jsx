import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  Award,
  BadgeCheck,
  ExternalLink,
  Globe,
  Star,
  TrendingUp,
  Users,
} from "lucide-react";
import { Button } from "../../../components/ui/button";
import { getActiveCampaigns } from "../../../services/api/apiservices";
import { mergeBrandProfile } from "../../../utils/brandProfileMapper";

const STAT_CARDS = [
  {
    key: "totalCampaigns",
    label: "Total Campaigns",
    icon: TrendingUp,
  },
  {
    key: "activeCreators",
    label: "Active Creators",
    icon: Users,
  },
  {
    key: "averageRating",
    label: "Average Rating",
    icon: Star,
  },
  {
    key: "totalInvestment",
    label: "Total Investment",
    icon: Award,
  },
];

export default function BrandProfileView() {
  const { brandId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);

  const from = location.state?.from || "/creator/campaigns";
  const backLabel =
    location.state?.backLabel || "Back to Explore Campaigns";

  useEffect(() => {
    let cancelled = false;

    const loadProfile = async () => {
      try {
        setLoading(true);
        let apiBrand = location.state?.brand || null;

        if (!apiBrand) {
          try {
            const response = await getActiveCampaigns();
            const campaigns = response.campaigns || [];
            const match = campaigns.find((campaign) => {
              const id = campaign?.brand?.id ?? campaign?.brandId;
              return String(id) === String(brandId);
            });
            if (match?.brand) {
              apiBrand = match.brand;
            }
          } catch (err) {
            console.error("Failed to resolve brand from campaigns:", err);
          }
        }

        if (!cancelled) {
          setProfile(mergeBrandProfile(apiBrand, brandId));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadProfile();
    return () => {
      cancelled = true;
    };
  }, [brandId, location.state?.brand]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F9FAFB]">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600" />
          <p className="mt-4 text-gray-600">Loading brand profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F9FAFB]">
        <div className="text-center">
          <p className="mb-4 text-red-600">Brand profile not found.</p>
          <Button type="button" onClick={() => navigate(from)}>
            {backLabel}
          </Button>
        </div>
      </div>
    );
  }

  const visibleStats = STAT_CARDS.filter(
    ({ key }) => profile.stats[key] != null && profile.stats[key] !== ""
  );

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <div className="mx-auto max-w-[1920px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <button
          type="button"
          onClick={() => navigate(from)}
          className="mb-6 inline-flex items-center gap-2 text-sm text-gray-500 transition-colors hover:text-gray-700"
        >
          ← {backLabel}
        </button>

        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6 lg:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex min-w-0 flex-1 flex-col gap-4 sm:flex-row sm:items-start">
              <div className="h-16 w-16 shrink-0 overflow-hidden rounded-full border border-gray-200 bg-gray-50 sm:h-20 sm:w-20">
                {profile.brandLogo ? (
                  <img
                    src={profile.brandLogo}
                    alt={profile.companyName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gray-100 text-xl font-bold text-gray-500">
                    {profile.companyName?.charAt(0) || "B"}
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-extrabold text-gray-900 sm:text-3xl">
                    {profile.companyName}
                  </h1>
                  {profile.isVerified ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-[#0c7bb3]">
                      <BadgeCheck className="h-3.5 w-3.5" aria-hidden />
                      Verified
                    </span>
                  ) : null}
                </div>

                {(profile.industries?.length > 0 || profile.location) && (
                  <p className="mt-2 text-sm text-gray-500 sm:text-base">
                    {[
                      profile.industries?.length
                        ? profile.industries.join(", ")
                        : null,
                      profile.location,
                    ]
                      .filter(Boolean)
                      .join(" | ")}
                  </p>
                )}

                {profile.description ? (
                  <p className="mt-4 max-w-3xl text-sm leading-relaxed text-gray-600 sm:text-base">
                    {profile.description}
                  </p>
                ) : null}
              </div>
            </div>

            {profile.website ? (
              <Button
                type="button"
                variant="outline"
                className="w-full shrink-0 gap-2 rounded-xl border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-800 hover:bg-gray-50 sm:w-auto"
                onClick={() =>
                  window.open(profile.website, "_blank", "noopener,noreferrer")
                }
              >
                <Globe className="h-4 w-4" aria-hidden />
                Visit Website
                <ExternalLink className="h-4 w-4" aria-hidden />
              </Button>
            ) : null}
          </div>

          {visibleStats.length > 0 ? (
            <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">
              {visibleStats.map(({ key, label, icon: Icon }) => (
                <div
                  key={key}
                  className="rounded-xl border border-gray-100 bg-gray-50/80 p-4 sm:p-5"
                >
                  <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-white shadow-sm">
                    <Icon className="h-4 w-4 text-[#0c7bb3]" aria-hidden />
                  </div>
                  <p className="text-2xl font-extrabold text-gray-900 sm:text-3xl">
                    {key === "averageRating"
                      ? Number(profile.stats[key]).toFixed(1)
                      : profile.stats[key]}
                  </p>
                  <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
