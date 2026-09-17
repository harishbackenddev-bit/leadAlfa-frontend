import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  approveBrandProfileRequest,
  clarifyBrandProfileRequest,
  deleteBrandProfileRequest,
  getBrandProfileRequestById,
  getBrandProfileRequests,
  rejectBrandProfileRequest,
} from "../../src/services/api/apiservices";

const mockAxiosGet = vi.fn();
const mockAxiosPut = vi.fn();
const mockAxiosDelete = vi.fn();

vi.mock("../../src/services/api/axiosInstance", () => ({
  default: {
    get: (...args) => mockAxiosGet(...args),
    put: (...args) => mockAxiosPut(...args),
    delete: (...args) => mockAxiosDelete(...args),
    interceptors: {
      request: { use: vi.fn() },
      response: { use: vi.fn() },
    },
  },
}));

describe("admin brand profile request APIs", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should GET paginated brand profile requests with filters", async () => {
    mockAxiosGet.mockResolvedValueOnce({
      data: {
        totalItems: 1,
        totalPages: 1,
        currentPage: 1,
        data: [{ id: 5, companyName: "Acme Innovations", status: "pending" }],
      },
    });

    const result = await getBrandProfileRequests({
      page: 1,
      limit: 10,
      status: "pending",
    });

    expect(mockAxiosGet).toHaveBeenCalledWith(
      expect.stringContaining("/api/admin/brand-profiles?status=pending&page=1&limit=10")
    );
    expect(result.data).toHaveLength(1);
  });

  it("should GET brand profile request detail by id", async () => {
    mockAxiosGet.mockResolvedValueOnce({
      data: { profile: { id: 5, companyName: "Acme Innovations" } },
    });

    const result = await getBrandProfileRequestById(5);

    expect(mockAxiosGet).toHaveBeenCalledWith(
      expect.stringContaining("/api/admin/brand-profiles/5")
    );
    expect(result.profile.companyName).toBe("Acme Innovations");
  });

  it("should PUT approve brand profile request", async () => {
    mockAxiosPut.mockResolvedValueOnce({
      data: {
        message: "Brand profile approved successfully",
        profile: { id: 5, status: "approved" },
      },
    });

    const result = await approveBrandProfileRequest(5);

    expect(mockAxiosPut).toHaveBeenCalledWith(
      expect.stringContaining("/api/admin/brand-profiles/5/approve"),
      {}
    );
    expect(result.message).toContain("approved successfully");
  });

  it("should PUT reject brand profile request with reason", async () => {
    mockAxiosPut.mockResolvedValueOnce({
      data: {
        message: "Brand profile rejected successfully",
        profile: { id: 5, status: "rejected" },
      },
    });

    const reason = "Provided company registration number could not be verified.";
    const result = await rejectBrandProfileRequest(5, reason);

    expect(mockAxiosPut).toHaveBeenCalledWith(
      expect.stringContaining("/api/admin/brand-profiles/5/reject"),
      { reason }
    );
    expect(result.message).toContain("rejected successfully");
  });

  it("should PUT clarify brand profile request with message", async () => {
    mockAxiosPut.mockResolvedValueOnce({
      data: {
        message: "Clarification requested successfully",
        profile: { id: 5, status: "clarification_requested" },
      },
    });

    const message = "Please provide an updated tax clearance certificate.";
    const result = await clarifyBrandProfileRequest(5, message);

    expect(mockAxiosPut).toHaveBeenCalledWith(
      expect.stringContaining("/api/admin/brand-profiles/5/clarify"),
      { message }
    );
    expect(result.message).toContain("Clarification requested");
  });

  it("should DELETE brand profile request", async () => {
    mockAxiosDelete.mockResolvedValueOnce({
      data: { message: "Brand profile request deleted successfully" },
    });

    const result = await deleteBrandProfileRequest(5);

    expect(mockAxiosDelete).toHaveBeenCalledWith(
      expect.stringContaining("/api/admin/brand-profiles/5")
    );
    expect(result.message).toContain("deleted successfully");
  });
});
