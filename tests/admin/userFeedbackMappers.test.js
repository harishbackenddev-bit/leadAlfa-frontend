import { describe, expect, it } from "vitest";
import {
  extractUserFeedbackDetail,
  extractUserFeedbackListResponse,
  mapUserFeedbackRow,
  resolveSubmitterName,
  formatDate,
  formatDateTime,
} from "../../src/pages/admin/components/userFeedback/userFeedbackMappers";

const mockFeedbackItem = {
  id: 1,
  publicId: "FBK-A82F91",
  type: "bug",
  description: "The profile save button does nothing after picking a category.",
  pageUrl: "/creator/profile",
  status: "new",
  userId: 42,
  adminNotes: null,
  resolvedAt: null,
  resolvedBy: null,
  createdAt: "2026-09-04T00:20:00.000Z",
  updatedAt: "2026-09-04T00:20:00.000Z",
  userAccount: {
    id: 42,
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
  },
};

describe("userFeedbackMappers", () => {
  it("should map user feedback row with type and status labels", () => {
    const row = mapUserFeedbackRow(mockFeedbackItem);

    expect(row.publicId).toBe("FBK-A82F91");
    expect(row.typeLabel).toBe("Bug Report");
    expect(row.statusLabel).toBe("New");
    expect(row.submitterName).toBe("John Doe");
    expect(row.submitterEmail).toBe("john@example.com");
    expect(row.pageUrl).toBe("/creator/profile");
  });

  it("should resolve submitter name correctly when full name or email is present", () => {
    expect(resolveSubmitterName({ firstName: "Jane", lastName: "Smith" })).toBe("Jane Smith");
    expect(resolveSubmitterName({ email: "test@example.com" })).toBe("test@example.com");
    expect(resolveSubmitterName(null)).toBe("Anonymous User");
  });

  it("should format dates cleanly", () => {
    expect(formatDate("2026-09-04T00:20:00.000Z")).toContain("2026");
    expect(formatDateTime("2026-09-04T00:20:00.000Z")).toContain("2026");
    expect(formatDate(null)).toBe("—");
  });

  it("should extract paginated user feedback list response", () => {
    const result = extractUserFeedbackListResponse(
      {
        totalItems: 1,
        totalPages: 1,
        currentPage: 1,
        limit: 10,
        data: [mockFeedbackItem],
      },
      1,
      10
    );

    expect(result.items).toHaveLength(1);
    expect(result.items[0].publicId).toBe("FBK-A82F91");
    expect(result.pagination.total).toBe(1);
    expect(result.pagination.page).toBe(1);
  });

  it("should extract single user feedback detail response", () => {
    const detail = extractUserFeedbackDetail({ feedback: mockFeedbackItem });

    expect(detail.publicId).toBe("FBK-A82F91");
    expect(detail.createdAtFormatted).toContain("2026");
    expect(detail.description).toContain("profile save button");
  });
});
