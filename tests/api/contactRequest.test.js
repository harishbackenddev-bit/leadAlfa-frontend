import { describe, it, expect, vi, beforeEach } from "vitest";
import axios from "axios";
import {
  submitContactRequest,
  getContactRequests,
  getContactRequestByPublicId,
  updateContactRequest,
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
  name: "Alex Smith",
  email: "alex.smith@example.com",
  inquiryType: "talk_to_sales",
  message: "Hello, I am interested in enterprise pricing and custom campaign solutions.",
};

describe("submitContactRequest API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("should POST contact payload to /api/contact-requests on success", async () => {
    axios.post.mockResolvedValueOnce({
      data: {
        message: "Your request has been received. Our team will contact you shortly.",
        request: { publicId: "REQ-7F8E9D", status: "new" },
      },
    });

    const result = await submitContactRequest(validPayload);

    expect(axios.post).toHaveBeenCalledWith(
      expect.stringContaining("/api/contact-requests"),
      validPayload,
      expect.objectContaining({
        headers: expect.objectContaining({ "Content-Type": "application/json" }),
      })
    );
    expect(result.message).toContain("received");
  });

  it("should include Authorization header when access_token is stored", async () => {
    localStorage.setItem("access_token", "test-token");
    axios.post.mockResolvedValueOnce({ data: { message: "ok" } });

    await submitContactRequest(validPayload);

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
          errors: [{ field: "email", message: "Please provide a valid email address." }],
        },
      },
    });

    await expect(submitContactRequest(validPayload)).rejects.toMatchObject({
      status: 400,
      errors: [{ field: "email", message: "Please provide a valid email address." }],
    });
  });

  it("should throw rate limit error with status on 429 response", async () => {
    axios.post.mockRejectedValueOnce({
      response: {
        status: 429,
        data: {
          error: "Too many contact requests submitted. Please try again after 15 minutes.",
        },
      },
    });

    await expect(submitContactRequest(validPayload)).rejects.toMatchObject({
      status: 429,
      error: expect.stringContaining("Too many contact requests submitted"),
    });
  });
});

describe("admin contact request APIs", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should GET paginated contact requests with filters", async () => {
    mockAxiosGet.mockResolvedValueOnce({
      data: {
        totalItems: 1,
        totalPages: 1,
        currentPage: 1,
        limit: 10,
        data: [{ publicId: "REQ-7F8E9D", status: "new" }],
      },
    });

    const result = await getContactRequests({
      page: 1,
      limit: 10,
      status: "new",
      search: "alex",
    });

    expect(mockAxiosGet).toHaveBeenCalledWith(
      expect.stringContaining("/api/admin/contact-requests?page=1&limit=10&status=new&search=alex")
    );
    expect(result.data).toHaveLength(1);
  });

  it("should GET contact request detail by publicId", async () => {
    mockAxiosGet.mockResolvedValueOnce({
      data: { request: { publicId: "REQ-7F8E9D", name: "Alex Smith" } },
    });

    const result = await getContactRequestByPublicId("REQ-7F8E9D");

    expect(mockAxiosGet).toHaveBeenCalledWith(
      expect.stringContaining("/api/admin/contact-requests/REQ-7F8E9D")
    );
    expect(result.request.publicId).toBe("REQ-7F8E9D");
  });

  it("should PATCH contact request status and admin notes", async () => {
    mockAxiosPatch.mockResolvedValueOnce({
      data: {
        message: "Contact request updated successfully.",
        request: { publicId: "REQ-7F8E9D", status: "resolved" },
      },
    });

    const payload = {
      status: "resolved",
      adminNotes: "Contacted Alex via email.",
    };
    const result = await updateContactRequest("REQ-7F8E9D", payload);

    expect(mockAxiosPatch).toHaveBeenCalledWith(
      expect.stringContaining("/api/admin/contact-requests/REQ-7F8E9D"),
      payload
    );
    expect(result.message).toContain("updated successfully");
  });
});
