import { describe, expect, it } from "vitest";
import {
  extractBrandRequestDetailResponse,
  extractBrandRequestsResponse,
  mapBrandRequestToDetails,
  normalizeBrandRequest,
} from "../../src/pages/admin/components/requestManagement/brandRequestMappers";

const mockBrandRequest = {
  id: 5,
  companyName: "Acme Innovations",
  companyEmail: "contact@acme.com",
  country: "South Africa",
  city: "Cape Town",
  website: "https://acme.com",
  businessType: "single_brand",
  jobRole: "Marketing Director",
  brandPrimaryIndustry: ["Tech", "Ecommerce"],
  bio: "Leading tech apparel brand.",
  companyRegistrationNumber: "2026/123456/07",
  status: "pending",
  createdAt: "2026-08-08T18:00:00.000Z",
  userAccount: {
    id: 12,
    firstName: "Jane",
    lastName: "Doe",
    email: "jane@acme.com",
  },
  media: {
    logo: {
      mediaDetails: {
        secureUrl: "https://cdn.example.com/logo.png",
        name: "logo.png",
      },
    },
    operatingAttachment: null,
  },
};

describe("brandRequestMappers", () => {
  it("should normalize brand request row for admin table", () => {
    const row = normalizeBrandRequest(mockBrandRequest);

    expect(row.id).toBe("5");
    expect(row.type).toBe("brand");
    expect(row.roleLabel).toBe("Brand");
    expect(row.name).toBe("Acme Innovations");
    expect(row.email).toBe("contact@acme.com");
    expect(row.country).toBe("South Africa");
    expect(row.status).toBe("pending");
    expect(row.date).toMatch(/Aug \d{2}, 2026/);
  });

  it("should extract paginated brand requests response", () => {
    const result = extractBrandRequestsResponse(
      {
        totalItems: 15,
        totalPages: 2,
        currentPage: 1,
        data: [mockBrandRequest],
      },
      1,
      10
    );

    expect(result.items).toHaveLength(1);
    expect(result.items[0].type).toBe("brand");
    expect(result.pagination.total).toBe(15);
    expect(result.pagination.page).toBe(1);
    expect(result.pagination.totalPages).toBe(2);
  });

  it("should normalize clarification_requested status", () => {
    const row = normalizeBrandRequest({
      ...mockBrandRequest,
      status: "clarification_requested",
    });

    expect(row.status).toBe("clarification_requested");
  });

  it("should extract brand request detail response", () => {
    const detail = extractBrandRequestDetailResponse({ profile: mockBrandRequest });

    expect(detail.companyName).toBe("Acme Innovations");
    expect(detail.userAccount.firstName).toBe("Jane");
  });

  it("should map brand request to admin detail view", () => {
    const details = mapBrandRequestToDetails(mockBrandRequest);

    expect(details.type).toBe("brand");
    expect(details.roleLabel).toBe("Brand");
    expect(details.basicInfo.some((item) => item.label === "Company Name")).toBe(true);
    expect(details.locationDetails.some((item) => item.label === "City")).toBe(true);
    expect(details.contactPerson).toEqual([
      { label: "Contact Name", value: "Jane Doe" },
      { label: "Contact Email", value: "jane@acme.com" },
    ]);
    expect(details.industries).toEqual(["Tech", "Ecommerce"]);
    expect(details.documents).toHaveLength(1);
    expect(details.documents[0].url).toBe("https://cdn.example.com/logo.png");
    expect(details.documents[0].type).toBe("image");
  });

  it("should resolve numeric industry ids to labels", () => {
    const details = mapBrandRequestToDetails({
      ...mockBrandRequest,
      brandPrimaryIndustry: [6, 5, 4],
    });

    expect(details.industries).toEqual([
      "Apps & Digital Services",
      "Cosmetics & Beauty",
      "Apparel & Fashion",
    ]);
  });
});
