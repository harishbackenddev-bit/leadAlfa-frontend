import { describe, it, expect, vi, beforeEach } from "vitest";
import axios from "axios";
import {
  submitBookCallRequest,
  getBookCallRequests,
  getBookCallRequestByPublicId,
  updateBookCallRequest,
} from "../../src/services/api/apiservices";

const mockAxiosGet = vi.fn();
const mockAxiosPatch = vi.fn();

vi.mock("axios", () => ({
  default: {
    post: vi.fn(),
    create: vi.fn(() => ({
      post: vi.fn(),
      get: vi.fn(),
      patch: vi.fn(),
      interceptors: {
        request: { use: vi.fn() },
        response: { use: vi.fn() },
      },
    })),
  },
}));

vi.mock("../../src/services/api/axiosInstance", () => ({
  default: {
    get: (...args) => mockAxiosGet(...args),
    patch: (...args) => mockAxiosPatch(...args),
    interceptors: {
      request: { use: vi.fn() },
      response: { use: vi.fn() },
    },
  },
}));

const validPayload = {
  name: "John Doe",
  businessEmail: "john@company.com",
  companyName: "Acme Inc.",
  companyWebsite: "https://acme.com",
};

describe("submitBookCallRequest API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("should POST call request payload to /api/book-call-requests on success", async () => {
    axios.post.mockResolvedValueOnce({
      data: {
        success: true,
        message: "Your call request has been received. Our team will contact you shortly.",
        publicId: "CALL-A82F91",
      },
    });

    const result = await submitBookCallRequest(validPayload);

    expect(axios.post).toHaveBeenCalledWith(
      expect.stringContaining("/api/book-call-requests"),
      validPayload,
      expect.objectContaining({
        headers: expect.objectContaining({ "Content-Type": "application/json" }),
      })
    );
    expect(result.publicId).toBe("CALL-A82F91");
  });

  it("should include Authorization header when access_token is stored", async () => {
    localStorage.setItem("access_token", "test-token");
    axios.post.mockResolvedValueOnce({ data: { success: true } });

    await submitBookCallRequest(validPayload);

    expect(axios.post).toHaveBeenCalledWith(
      expect.any(String),
      validPayload,
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "Bearer test-token",
        }),
      })
    );
  });

  it("should throw validation error with status on 400 response", async () => {
    axios.post.mockRejectedValueOnce({
      response: {
        status: 400,
        data: {
          errors: [
            { field: "businessEmail", message: "Please provide a valid email address." },
          ],
        },
      },
    });

    await expect(submitBookCallRequest(validPayload)).rejects.toMatchObject({
      status: 400,
      errors: [{ field: "businessEmail", message: "Please provide a valid email address." }],
    });
  });

  it("should throw rate limit error with status on 429 response", async () => {
    axios.post.mockRejectedValueOnce({
      response: {
        status: 429,
        data: {
          error: "Too many call requests submitted. Please try again after 15 minutes.",
        },
      },
    });

    await expect(submitBookCallRequest(validPayload)).rejects.toMatchObject({
      status: 429,
      error: expect.stringContaining("Too many call requests submitted"),
    });
  });
});

describe("admin book call request APIs", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should GET paginated call requests with filters", async () => {
    mockAxiosGet.mockResolvedValueOnce({
      data: {
        totalItems: 1,
        totalPages: 1,
        currentPage: 1,
        limit: 10,
        data: [{ publicId: "CALL-A82F91", status: "new" }],
      },
    });

    const result = await getBookCallRequests({
      page: 1,
      limit: 10,
      status: "new",
      search: "Acme",
    });

    expect(mockAxiosGet).toHaveBeenCalledWith(
      expect.stringContaining("/api/admin/book-call-requests?page=1&limit=10&status=new&search=Acme")
    );
    expect(result.data).toHaveLength(1);
  });

  it("should GET call request detail by publicId", async () => {
    mockAxiosGet.mockResolvedValueOnce({
      data: { request: { publicId: "CALL-A82F91", name: "John Doe" } },
    });

    const result = await getBookCallRequestByPublicId("CALL-A82F91");

    expect(mockAxiosGet).toHaveBeenCalledWith(
      expect.stringContaining("/api/admin/book-call-requests/CALL-A82F91")
    );
    expect(result.request.publicId).toBe("CALL-A82F91");
  });

  it("should throw 404 with status when request is missing", async () => {
    mockAxiosGet.mockRejectedValueOnce({
      response: {
        status: 404,
        data: { error: "Book a call request not found" },
      },
    });

    await expect(getBookCallRequestByPublicId("CALL-MISSING")).rejects.toMatchObject({
      status: 404,
      error: "Book a call request not found",
    });
  });

  it("should PATCH call request status and admin notes", async () => {
    mockAxiosPatch.mockResolvedValueOnce({
      data: {
        message: "Book a call request updated successfully.",
        request: { publicId: "CALL-A82F91", status: "resolved" },
      },
    });

    const payload = {
      status: "resolved",
      adminNotes: "Contacted John via email. Discovery call conducted externally on Monday.",
    };
    const result = await updateBookCallRequest("CALL-A82F91", payload);

    expect(mockAxiosPatch).toHaveBeenCalledWith(
      expect.stringContaining("/api/admin/book-call-requests/CALL-A82F91"),
      payload
    );
    expect(result.message).toContain("updated successfully");
  });

  it("should throw 403 with status when the user is not an admin", async () => {
    mockAxiosGet.mockRejectedValueOnce({
      response: {
        status: 403,
        data: { error: "Forbidden" },
      },
    });

    await expect(getBookCallRequests({ page: 1 })).rejects.toMatchObject({
      status: 403,
    });
  });
});
