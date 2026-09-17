import { Link } from "react-router-dom";
import BrandAvatar from "../../../components/brand/BrandAvatar";
import { useBrandProfile } from "../MyProfile/hooks/useBrandProfile";
import {
  BRAND_PROFILE_DISPLAY_FALLBACK,
  mapBrandProfileForDisplay,
} from "../../../utils/brandProfileDisplay";

const CARD = "rounded-[14px] border border-[#e5e7eb] bg-white p-5 sm:p-6";
const HEADING =
  "text-[20px] font-bold leading-[30px] tracking-[-0.4px] text-[#1f1f1f] sm:text-[24px] sm:leading-[36px]";

function InfoCard({ title, fields }) {
  return (
    <div className={CARD}>
      <h2 className={HEADING}>{title}</h2>
      <div className="space-y-4 pt-5">
        {fields.map(([label, value]) => (
          <div key={label}>
            <p className="text-[14px] leading-[21px] text-[#64748b]">{label}</p>
            <p className="pt-0.5 text-[15px] font-medium leading-[24px] text-[#1f2937]">
              {value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ProfileSettings() {
  const { user, profile, loading } = useBrandProfile();
  const { personal, company } = mapBrandProfileForDisplay(user, profile);

  return (
    <>
      <h1 className="text-[24px] font-bold leading-[36px] tracking-[-0.8px] text-[#1f1f1f] sm:text-[32px] sm:leading-[48px]">
        Profile
      </h1>
      <p className="pt-1 text-[14px] leading-[21px] text-[#64748b]">
        Manage your personal information and preferences
      </p>

      {loading ? (
        <div className={`mt-6 ${CARD} text-[14px] text-[#64748b]`}>
          Loading profile...
        </div>
      ) : (
        <div className={`mt-6 ${CARD}`}>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-4">
              <BrandAvatar profile={profile} size="lg" />
              <div>
                <h2 className={HEADING}>{profile?.companyName || "Brand"}</h2>
                <p className="max-w-[820px] pt-1 text-[14px] leading-[22px] text-[#64748b]">
                  {profile?.bio || profile?.description || "N/A"}
                </p>
              </div>
            </div>
            <Link
              to="/brand/edit-profile"
              className="btn-gradient inline-flex h-11 w-fit shrink-0 items-center justify-center rounded-[10px] px-6 text-[14px] font-semibold"
            >
              Edit Profile
            </Link>
          </div>
        </div>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <InfoCard
          title="Personal Information"
          fields={[
            [
              "First Name",
              user?.firstName?.trim() || BRAND_PROFILE_DISPLAY_FALLBACK,
            ],
            ["Work Email", personal.workEmail],
            ["Phone Number", personal.phoneNumber],
            ["Address", personal.address],
            ["City", personal.city],
            ["Country", personal.state],
          ]}
        />
        <InfoCard
          title="Company Information"
          fields={[
            ["Company Name", company.companyName],
            ["Company Website", company.companyWebsite],
            ["Company Email", company.companyEmail],
            ["Address", company.address],
            ["City", personal.city],
            ["Country", company.state],
          ]}
        />
      </div>
    </>
  );
}
