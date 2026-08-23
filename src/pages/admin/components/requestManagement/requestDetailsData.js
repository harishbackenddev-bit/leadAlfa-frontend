import { requestItems } from "./requestData";
import { mapCreatorRequestToDetails } from "./creatorRequestMappers";

const ADMIN_CREATOR_REQUESTS_CACHE_KEY = "admin_creator_requests_cache";

const requestDetailsById = {
  "req-creator-1": {
    id: "req-creator-1",
    type: "creator",
    roleLabel: "Creator",
    name: "Sarah Johnson",
    email: "sarah.j@gmail.com",
    appliedOn: "2025-02-14",
    status: "pending",
    basicInfo: [
      { label: "Full Name", value: "Sarah Johnson" },
      
    ],
    locationDetails: [
      { label: "Country", value: "South Africa" },
      { label: "Province", value: "Western Cape" },
      { label: "City / Town", value: "Cape Town" },
      { label: "Street Address", value: "123 Main Street, Sea Point" },
      { label: "Postal Code", value: "8005" },
    ],
    contentNiche: {
      languages: ["English", "Afrikaans", "Xhosa"],
      primaryNiche: "Lifestyle & Fashion",
      secondaryNiche: "Beauty & Wellness",
    },
    skillsAndContentTypes: ["Aesthetic / Vlog", "Unboxing", "Product Reviews", "Tutorials"],
    demographics: [
      { label: "Pets", value: "Yes - Dogs" },
      { label: "Children", value: "Yes" },
      { label: "Age Ranges", value: "5-10 years, 11-15 years" },
    ],
    socialLinks: [
      { platform: "TikTok", value: "@sarah_lifestyle", url: "https://tiktok.com/@sarah_lifestyle" },
      { platform: "Instagram", value: "@sarahjohnson", url: "https://instagram.com/sarahjohnson" },
      { platform: "YouTube", value: "Sarah Johnson Vlogs", url: "https://youtube.com/@sarahjohnson" },
    ],
    portfolio: {
      files: [
        { name: "UGC Example 1.mp4", type: "video", url: "#" },
        { name: "UGC Example 2.mp4", type: "video", url: "#" },
      ],
      externalLink: "https://sarahjohnson.com/portfolio",
    },
    identityVerification: {
      idNumber: "9505125896083",
      documents: [{ name: "ID_Copy_Front.pdf", type: "document", url: "#" }],
    },
    taxInformation: [
      { label: "Income Tax Number", value: "9876543210" },
      { label: "VAT Registered", value: "No" },
    ],
    legalDeclarations: [
      { label: "Tax invoice authorization", accepted: true },
      { label: "Data processing consent", accepted: true },
      { label: "Terms of service agreement", accepted: true },
    ],
  },
};

const buildFallbackDetails = (requestId) => {
  const request = requestItems.find((item) => item.id === requestId);

  if (!request) return null;

  return {
    id: request.id,
    type: request.type,
    roleLabel: request.type === "brand" ? "Brand" : "Creator",
    name: request.name,
    email: request.email,
    appliedOn: request.date,
    status: request.status,
    basicInfo: [
      { label: "Full Name", value: request.name },
      {
        label: request.type === "brand" ? "Brand Handle" : "Public / Creator Name",
        value: request.channel,
      },
    ],
    locationDetails: [{ label: "Country", value: request.country }],
    contentNiche: {
      languages: [],
      primaryNiche: "—",
      secondaryNiche: "—",
    },
    skillsAndContentTypes: [],
    demographics: [],
    socialLinks: [],
    portfolio: {
      files: [],
      externalLink: "",
    },
    identityVerification: {
      idNumber: "—",
      documents: [],
    },
    taxInformation: [
      { label: "Income Tax Number", value: "—" },
      { label: "VAT Registered", value: "—" },
    ],
    legalDeclarations: [],
  };
};

export const getRequestDetails = (requestId) => {
  try {
    const cached = JSON.parse(
      sessionStorage.getItem(ADMIN_CREATOR_REQUESTS_CACHE_KEY) || "[]"
    );

    const found = Array.isArray(cached)
      ? cached.find((item) => String(item.id) === String(requestId))
      : null;

    if (found) {
      return mapCreatorRequestToDetails(found);
    }
  } catch (error) {
    console.log("Failed to parse request cache", error);
  }

  return requestDetailsById[requestId] || buildFallbackDetails(requestId);
};
