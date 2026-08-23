import { useEffect, useMemo, useState } from "react";
import illustration from "../../../assets/SVGs/brands/sidebarIcons/Illustration.svg";
import { getCreatorProfile } from "../../../services/api/apiservices";

const formatSubmittedAt = (value) => {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });
};

export default function ProfileVerification() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    let mounted = true;

    const loadProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getCreatorProfile();
        const profileData = response?.profile || response?.data?.profile || response?.data || response;

        if (mounted) {
          setProfile(profileData || null);
        }
      } catch (err) {
        if (mounted) {
          setError(err?.message || err?.error || "Failed to load profile status.");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadProfile();

    return () => {
      mounted = false;
    };
  }, []);

  const status = useMemo(
    () => String(profile?.status || "").trim().toLowerCase(),
    [profile?.status]
  );

  const submittedAt = useMemo(() => formatSubmittedAt(profile?.createdAt), [profile?.createdAt]);

  if (loading) {
    return (
      <div className="min-h-full bg-gray-50 p-6 text-sm text-gray-600">Loading profile status...</div>
    );
  }

  if (error) {
    return (
      <div className="min-h-full bg-gray-50 p-6">
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      </div>
    );
  }

  if (status !== "pending") {
    return (
      <div className="min-h-full bg-gray-50 p-6">
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          Profile verification is not pending.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-gray-50">
      {/* Top banner with blue status */}
      <div className="mb-8 bg-blue-50 rounded-lg px-6 py-4 shadow-sm">
        <div className="flex items-center">
          <div className="flex items-center gap-3">
            <div className="px-2 py-1 bg-blue-100 text-blue-700 rounded-3xl text-sm font-medium">
              Application Pending
            </div>
          </div>

          <div className="flex-1 text-center">
            <h1 className="text-xl font-[900] text-gray-900 tracking-tighter">
              Profile Verification is Under Review
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">Have Any Questions?</span>
            <button className="px-4 py-2 border border-blue-600 text-[#0c7bb3] rounded-full text-sm font-medium hover:bg-blue-50 transition-colors">
              Contact Support
            </button>
          </div>
        </div>
      </div>

      {/* Main content card */}
      <div className="bg-white rounded-lg shadow-sm p-10 m-4 relative">
        <div className="flex items-start justify-between">
          {/* Left column */}
          <div className="flex-1 pr-8">
            <div className="flex items-center gap-4 mb-4">
              <h2 className="text-2xl font-[900] text-black font-anton">
                Profile Verification Status
              </h2>
              <span className="px-3 py-0.5 bg-blue-50 text-[#0c7bb3] rounded-xl text-sm font-medium tracking-wide">
                Pending
              </span>
            </div>

            <p className="text-sm text-gray-600 mb-8">
              Your application is submitted: {submittedAt}
            </p>

            <div className="border-b-3 border-gray-200 mb-8" />

            <div className="space-y-4">
              <p className="text-sm text-gray-700">
                Your profile is being reviewed before it is published to leads
                alpha. You will receive an email notification within 24 hours.
              </p>
              <p className="text-sm text-gray-700">
                In the meantime, explore your Brand Portal and Dashboards.
              </p>
            </div>

            <div className="mt-8">
              <button className="px-6 py-3 border-2 border-blue-500 text-blue-500 rounded-full text-sm font-medium hover:bg-blue-50 transition-colors">
                Contact Support
              </button>
            </div>
          </div>

          {/* Right column: circular icon */}
          <div className="flex-shrink-0 -ml-26">
            <div className="bg-gray-50 rounded-full">
              <img
                src={illustration}
                alt="illustration"
                className="w-18 h-18 object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
