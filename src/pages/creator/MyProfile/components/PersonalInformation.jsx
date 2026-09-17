import React from "react";

const valueOrPlaceholder = (value) => value || "—";

const getCategoryNames = (profile) => {
  const categories = Array.isArray(profile?.categories) ? profile.categories : [];
  const names = categories
    .map((category) => {
      if (typeof category === "string") return category;
      return category?.name || category?.title || category?.categoryName;
    })
    .filter(Boolean);

  if (names.length) return names.join(", ");

  return [...(profile?.primaryNiches || []), ...(profile?.secondaryNiches || [])]
    .filter(Boolean)
    .join(", ");
};

const formatDate = (value) => {
  if (!value) return "—";
  const date = new Date(`${String(value).split("T")[0]}T00:00:00`);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-ZA", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
};

const formatUrl = (value) =>
  value ? String(value).replace(/^https?:\/\/(www\.)?/i, "").replace(/\/$/, "") : "—";

function Detail({ label, value }) {
  return (
    <div>
      <dt className="text-sm text-gray-500">{label}</dt>
      <dd className="mt-1 text-sm font-medium text-gray-900">{valueOrPlaceholder(value)}</dd>
    </div>
  );
}

export default function PersonalInformation({ user, profile }) {
  const fullName = [profile?.firstName || user?.firstName, profile?.lastName || user?.lastName]
    .filter(Boolean)
    .join(" ");

  const addressParts = [
    profile?.addressLine1 || profile?.streetNumber,
    profile?.addressLine2,
    profile?.suburb,
    profile?.city,
    profile?.province,
    profile?.postalZipCode || profile?.postalCode,
    profile?.country || "South Africa",
  ].filter(Boolean);

  const displayName = profile?.publicName || profile?.publicCreatorName || fullName;
  const location = addressParts.join(", ");
  const categories = getCategoryNames(profile);
  const followers =
    profile?.followersCount ??
    profile?.followerCount ??
    profile?.social?.followersCount;

  return (
    <div className="mb-6 space-y-6">
      <div className="grid gap-6 xl:grid-cols-2">
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <h4 className="text-lg font-medium text-gray-900">Personal Information</h4>
          <dl className="mt-7 grid gap-6 sm:grid-cols-2">
            <Detail label="Display Name" value={displayName} />
            <Detail label="Email Address" value={profile?.email || user?.email} />
            <Detail label="Phone Number" value={profile?.phoneNumber || user?.phoneNumber} />
            <Detail label="Location" value={location} />
            <Detail label="Date of Birth" value={formatDate(profile?.dateOfBirth)} />
          </dl>
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <h4 className="text-lg font-medium text-gray-900">Creator Information</h4>
          <dl className="mt-7 grid gap-6 sm:grid-cols-2">
            <Detail label="Content Categories" value={categories} />
            <Detail label="Instagram Handle" value={formatUrl(profile?.instagramUrl)} />
            <Detail label="TikTok Handle" value={formatUrl(profile?.tiktokUrl)} />
            <Detail label="YouTube Channel" value={formatUrl(profile?.youtubeChannelUrl || profile?.youtubeUrl)} />
            <Detail label="Total Followers" value={followers} />
          </dl>
        </section>
      </div>

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
        <h4 className="text-lg font-medium text-gray-900">About Me</h4>
        <p className="mt-5 text-sm leading-7 text-gray-600">{valueOrPlaceholder(profile?.bio)}</p>
      </section>
    </div>
  );
}
