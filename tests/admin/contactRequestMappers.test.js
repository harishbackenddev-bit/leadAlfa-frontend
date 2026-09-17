import { describe, expect, it } from "vitest";
import {
  extractContactRequestDetail,
  extractContactRequestsResponse,
  mapContactRequestRow,
  resolveContactUserProfilePhoto,
} from "../../src/pages/admin/components/contactRequests/contactRequestMappers";

const mockRequest = {
  id: 1,
  publicId: "REQ-7F8E9D",
  name: "Alex Smith",
  email: "alex.smith@example.com",
  inquiryType: "talk_to_sales",
  message: "Hello, I am interested in enterprise pricing.",
  status: "new",
  adminNotes: null,
  userId: null,
  createdAt: "2026-08-09T20:50:00.000Z",
  updatedAt: "2026-08-09T20:50:00.000Z",
  resolvedAt: null,
};

describe("contactRequestMappers", () => {
  it("should map contact request row with inquiry and status labels", () => {
    const row = mapContactRequestRow(mockRequest);

    expect(row.publicId).toBe("REQ-7F8E9D");
    expect(row.inquiryTypeLabel).toBe("Talk to Sales");
    expect(row.statusLabel).toBe("New");
    expect(row.date).toMatch(/Aug \d{2}, 2026/);
  });

  it("should extract paginated list response", () => {
    const result = extractContactRequestsResponse(
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

  it("should extract contact request detail response", () => {
    const detail = extractContactRequestDetail({ request: mockRequest });

    expect(detail.publicId).toBe("REQ-7F8E9D");
    expect(detail.createdAtFormatted).toContain("2026");
    expect(detail.message).toContain("enterprise pricing");
  });

  it("should resolve profile photo from linked user account", () => {
    const photoUrl = resolveContactUserProfilePhoto({
      role: "creator",
      profile: {
        media: {
          profilePhoto: {
            mediaDetails: { url: "https://cdn.example.com/avatar.jpg" },
          },
        },
      },
    });

    expect(photoUrl).toBe("https://cdn.example.com/avatar.jpg");

    const detail = extractContactRequestDetail({
      request: {
        ...mockRequest,
        userId: 121,
        userAccount: {
          role: "creator",
          profile: {
            media: {
              profilePhoto: {
                mediaDetails: { url: "https://cdn.example.com/creator-two.jpg" },
              },
            },
          },
        },
      },
    });

    expect(detail.profilePhotoUrl).toBe("https://cdn.example.com/creator-two.jpg");
    expect(detail.roleLabel).toBe("Creator");
  });
});
