import { describe, expect, it } from "vitest";
import {
  buildBookCallOriginalSummary,
  extractBookCallRequestDetail,
  extractBookCallRequestsResponse,
  mapBookCallRequestRow,
  resolveBookCallUserProfilePhoto,
} from "../../src/pages/admin/components/bookCallRequests/bookCallRequestMappers";
import { getBookCallAdminErrorMessage } from "../../src/constants/bookCallRequest";

const mockRequest = {
  id: 1,
  publicId: "CALL-A82F91",
  name: "John Doe",
  businessEmail: "john@company.com",
  companyName: "Acme Inc.",
  companyWebsite: "https://acme.com",
  status: "new",
  adminNotes: null,
  userId: null,
  createdAt: "2026-09-03T19:00:00.000Z",
  updatedAt: "2026-09-03T19:00:00.000Z",
  resolvedAt: null,
};

describe("bookCallRequestMappers", () => {
  it("should map call request row with email, company, and status labels", () => {
    const row = mapBookCallRequestRow(mockRequest);

    expect(row.publicId).toBe("CALL-A82F91");
    expect(row.businessEmail).toBe("john@company.com");
    expect(row.companyName).toBe("Acme Inc.");
    expect(row.statusLabel).toBe("New");
    expect(row.date).toMatch(/Sep \d{2}, 2026/);
  });

  it("should extract paginated list response", () => {
    const result = extractBookCallRequestsResponse(
      {
        totalItems: 1,
        totalPages: 1,
        currentPage: 1,
        limit: 10,
        data: [mockRequest],
      },
      1,
      10
    );

    expect(result.items).toHaveLength(1);
    expect(result.pagination.total).toBe(1);
    expect(result.pagination.page).toBe(1);
  });

  it("should extract call request detail response", () => {
    const detail = extractBookCallRequestDetail({ request: mockRequest });

    expect(detail.publicId).toBe("CALL-A82F91");
    expect(detail.createdAtFormatted).toContain("2026");
    expect(detail.companyWebsite).toBe("https://acme.com");
  });

  it("should build an original request summary for history", () => {
    expect(buildBookCallOriginalSummary(mockRequest)).toContain("Acme Inc.");
    expect(buildBookCallOriginalSummary(mockRequest)).toContain("https://acme.com");
  });

  it("should resolve profile photo from linked user account", () => {
    const photoUrl = resolveBookCallUserProfilePhoto({
      role: "brand",
      profile: {
        media: {
          profilePhoto: {
            mediaDetails: { url: "https://cdn.example.com/avatar.jpg" },
          },
        },
      },
    });

    expect(photoUrl).toBe("https://cdn.example.com/avatar.jpg");
  });
});

describe("getBookCallAdminErrorMessage", () => {
  it("should map 403 to Access Denied", () => {
    expect(getBookCallAdminErrorMessage({ status: 403 })).toBe("Access Denied");
  });

  it("should map 404 to not found copy", () => {
    expect(getBookCallAdminErrorMessage({ status: 404, error: "Book a call request not found" }))
      .toBe("Book a call request not found");
  });

  it("should use the first validation error message", () => {
    expect(
      getBookCallAdminErrorMessage({
        status: 400,
        errors: [{ field: "adminNotes", message: "Admin notes cannot exceed 1000 characters." }],
      })
    ).toBe("Admin notes cannot exceed 1000 characters.");
  });
});
