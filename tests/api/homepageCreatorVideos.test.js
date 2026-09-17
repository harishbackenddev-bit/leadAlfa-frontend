import { describe, it, expect, vi, beforeEach } from "vitest";
import axios from "axios";
import { getHomepageCreatorVideos } from "../../src/services/api/apiservices";

vi.mock("axios", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    create: vi.fn(() => ({
      get: vi.fn(),
      post: vi.fn(),
      interceptors: {
        request: { use: vi.fn() },
        response: { use: vi.fn() },
      },
    })),
  },
}));

describe("getHomepageCreatorVideos API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should GET /api/home/creator-videos without parameters on default call", async () => {
    axios.get.mockResolvedValueOnce({
      data: {
        success: true,
        data: [
          {
            id: "creator-101",
            videoUrl: "https://cdn.example.com/video1.mp4",
            name: "Jane Doe",
            location: "Cape Town",
            category: "beauty-cosmetics",
            source: "creator",
          },
        ],
      },
    });

    const result = await getHomepageCreatorVideos();

    expect(axios.get).toHaveBeenCalledWith(
      expect.stringContaining("/api/home/creator-videos"),
      { params: {} }
    );
    expect(result.success).toBe(true);
    expect(result.data).toHaveLength(1);
    expect(result.data[0].id).toBe("creator-101");
  });

  it("should pass category parameter when category slug is provided", async () => {
    axios.get.mockResolvedValueOnce({
      data: {
        success: true,
        data: [
          {
            id: "creator-102",
            videoUrl: "https://cdn.example.com/video2.mp4",
            name: "Alex Smith",
            location: "Johannesburg",
            category: "apparel-fashion",
            source: "creator",
          },
        ],
      },
    });

    const result = await getHomepageCreatorVideos("apparel-fashion");

    expect(axios.get).toHaveBeenCalledWith(
      expect.stringContaining("/api/home/creator-videos"),
      { params: { category: "apparel-fashion" } }
    );
    expect(result.success).toBe(true);
    expect(result.data[0].category).toBe("apparel-fashion");
  });

  it("should handle network error gracefully and return error structure", async () => {
    axios.get.mockRejectedValueOnce({
      response: {
        data: { error: "Service unavailable" },
      },
    });

    const result = await getHomepageCreatorVideos();

    expect(result.success).toBe(false);
    expect(result.data).toEqual([]);
    expect(result.error).toBe("Service unavailable");
  });
});
