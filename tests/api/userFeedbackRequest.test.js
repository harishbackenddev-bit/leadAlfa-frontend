import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  submitUserFeedback,
  getUserFeedbackList,
  getUserFeedbackByPublicId,
  updateUserFeedback,
} from "../../src/services/api/apiservices";

const mockAxiosPost = vi.fn();
const mockAxiosGet = vi.fn();
const mockAxiosPatch = vi.fn();

vi.mock("../../src/services/api/axiosInstance", () => ({
  default: {
    post: (...args) => mockAxiosPost(...args),
    get: (...args) => mockAxiosGet(...args),
    patch: (...args) => mockAxiosPatch(...args),
    interceptors: {
      request: { use: vi.fn() },
      response: { use: vi.fn() },
    },
  },
}));

const validUserPayload = {
  type: "bug",
  description: "The profile save button does nothing after picking a category.",
  pageUrl: "/creator/profile",
};

describe("User Feedback APIs", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("submitUserFeedback", () => {
    it("should POST payload to /api/user-feedback", async () => {
      mockAxiosPost.mockResolvedValueOnce({
        data: {
          success: true,
          message: "Thank you for your feedback.",
          publicId: "FBK-A82F91",
        },
      });

      const result = await submitUserFeedback(validUserPayload);

      expect(mockAxiosPost).toHaveBeenCalledWith(
        expect.stringContaining("/api/user-feedback"),
        validUserPayload
      );
      expect(result.publicId).toBe("FBK-A82F91");
    });
  });

  describe("admin user feedback APIs", () => {
    it("should GET paginated user feedback list with filters", async () => {
      mockAxiosGet.mockResolvedValueOnce({
        data: {
          totalItems: 1,
          totalPages: 1,
          currentPage: 1,
          limit: 10,
          data: [{ publicId: "FBK-A82F91", status: "new", type: "bug" }],
        },
      });

      const result = await getUserFeedbackList({
        page: 1,
        limit: 10,
        status: "new",
        type: "bug",
        search: "profile",
      });

      expect(mockAxiosGet).toHaveBeenCalledWith(
        expect.stringContaining(
          "/api/admin/user-feedback?page=1&limit=10&status=new&type=bug&search=profile"
        )
      );
      expect(result.data).toHaveLength(1);
    });

    it("should GET user feedback detail by publicId", async () => {
      mockAxiosGet.mockResolvedValueOnce({
        data: { feedback: { publicId: "FBK-A82F91", type: "bug" } },
      });

      const result = await getUserFeedbackByPublicId("FBK-A82F91");

      expect(mockAxiosGet).toHaveBeenCalledWith(
        expect.stringContaining("/api/admin/user-feedback/FBK-A82F91")
      );
      expect(result.feedback.publicId).toBe("FBK-A82F91");
    });

    it("should PATCH user feedback status and admin notes", async () => {
      mockAxiosPatch.mockResolvedValueOnce({
        data: {
          message: "User feedback updated successfully.",
          feedback: { publicId: "FBK-A82F91", status: "resolved" },
        },
      });

      const updatePayload = {
        status: "resolved",
        adminNotes: "Fixed in production release v1.4.2.",
      };
      const result = await updateUserFeedback("FBK-A82F91", updatePayload);

      expect(mockAxiosPatch).toHaveBeenCalledWith(
        expect.stringContaining("/api/admin/user-feedback/FBK-A82F91"),
        updatePayload
      );
      expect(result.message).toContain("updated successfully");
    });
  });
});
