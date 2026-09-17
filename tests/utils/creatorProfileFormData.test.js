import { describe, expect, it } from "vitest";
import {
  buildCreatorPortfolioUploadFormData,
  buildCreatorProfileFormData,
  getCreatorIntroVideoUrl,
  getCreatorPortfolioVideos,
  getPortfolioVideoFileError,
  MAX_CREATOR_PORTFOLIO_VIDEOS,
} from "../../src/utils/creatorProfileFormData";

const profileWithMedia = {
  firstName: "Ada",
  lastName: "Lovelace",
  email: "ada@example.com",
  phoneNumber: "123",
  publicName: "ada",
  languages: ["en"],
  categories: [{ id: 1 }, { id: 2 }],
  skills: [{ id: 10 }],
  primaryNiches: ["Fashion"],
  secondaryNiches: ["Beauty"],
  media: {
    introVideo: {
      id: 9,
      mediaDetails: { url: "https://cdn.example.com/intro.mp4", type: "video" },
    },
    portfolio: [
      {
        id: 1,
        mediaDetails: { url: "https://cdn.example.com/p1.mp4", type: "video", name: "Reel 1" },
      },
      {
        id: 2,
        mediaDetails: { url: "https://cdn.example.com/photo.jpg", type: "image" },
      },
      {
        id: 3,
        mediaDetails: { url: "https://cdn.example.com/p2.mp4", type: "video" },
      },
    ],
  },
};

describe("getCreatorIntroVideoUrl", () => {
  it("should return intro video url from media details", () => {
    expect(getCreatorIntroVideoUrl(profileWithMedia)).toBe(
      "https://cdn.example.com/intro.mp4"
    );
  });

  it("should return null when intro video is missing", () => {
    expect(getCreatorIntroVideoUrl({})).toBeNull();
  });
});

describe("getCreatorPortfolioVideos", () => {
  it("should return only video portfolio items and skip images", () => {
    const videos = getCreatorPortfolioVideos(profileWithMedia);
    expect(videos).toHaveLength(2);
    expect(videos[0]).toEqual({
      id: 1,
      mediaId: 1,
      url: "https://cdn.example.com/p1.mp4",
      title: "Reel 1",
    });
    expect(videos[1].url).toBe("https://cdn.example.com/p2.mp4");
  });

  it("should cap portfolio videos at 5", () => {
    const profile = {
      media: {
        portfolio: [1, 2, 3, 4, 5, 6].map((n) => ({
          id: n,
          mediaDetails: {
            url: `https://cdn.example.com/${n}.mp4`,
            type: "video",
          },
        })),
      },
    };

    expect(getCreatorPortfolioVideos(profile)).toHaveLength(
      MAX_CREATOR_PORTFOLIO_VIDEOS
    );
  });

  it("should return an empty list when portfolio is missing", () => {
    expect(getCreatorPortfolioVideos({})).toEqual([]);
  });
});

describe("getPortfolioVideoFileError", () => {
  it("should reject non-video files", () => {
    const file = new File(["x"], "photo.png", { type: "image/png" });
    expect(getPortfolioVideoFileError(file)).toBe("Use MP4 or MOV format");
  });

  it("should accept mp4 under 120MB", () => {
    const file = new File(["x"], "clip.mp4", { type: "video/mp4" });
    expect(getPortfolioVideoFileError(file)).toBeNull();
  });
});

describe("buildCreatorProfileFormData", () => {
  it("should append delivery address fields to the profile payload", () => {
    const formData = buildCreatorProfileFormData({
      formData: {
        basicInfo: {
          firstName: "Ada",
          addressLine1: "24 Main Road",
          addressLine2: "Apartment 12",
          suburb: "Sea Point",
          city: "Cape Town",
          province: "Western Cape",
          postalCode: "8005",
          country: "South Africa",
          deliveryInstructions: "Leave with receptionist",
        },
      },
    });

    expect(formData.get("addressLine1")).toBe("24 Main Road");
    expect(formData.get("streetNumber")).toBe("24 Main Road");
    expect(formData.get("addressLine2")).toBe("Apartment 12");
    expect(formData.get("suburb")).toBe("Sea Point");
    expect(formData.get("city")).toBe("Cape Town");
    expect(formData.get("province")).toBe("Western Cape");
    expect(formData.get("postalCode")).toBe("8005");
    expect(formData.get("postalZipCode")).toBe("8005");
    expect(formData.get("country")).toBe("South Africa");
    expect(formData.get("deliveryInstructions")).toBe(
      "Leave with receptionist"
    );
  });
});

describe("buildCreatorPortfolioUploadFormData", () => {
  it("should append portfolio files without introVideo", () => {
    const file = new File(["video-bytes"], "work.mp4", { type: "video/mp4" });
    const formData = buildCreatorPortfolioUploadFormData({
      profile: profileWithMedia,
      user: { firstName: "Ada" },
      files: [file],
    });

    expect(formData.get("introVideo")).toBeNull();
    expect(formData.getAll("portfolio")).toHaveLength(1);
    expect(formData.get("portfolio")).toBe(file);
    expect(formData.get("firstName")).toBe("Ada");
    expect(formData.get("publicName")).toBe("ada");
  });

  it("should not append more files than remaining portfolio slots", () => {
    const fullProfile = {
      ...profileWithMedia,
      media: {
        ...profileWithMedia.media,
        portfolio: [1, 2, 3, 4, 5].map((n) => ({
          id: n,
          mediaDetails: {
            url: `https://cdn.example.com/${n}.mp4`,
            type: "video",
          },
        })),
      },
    };
    const file = new File(["video-bytes"], "extra.mp4", { type: "video/mp4" });
    const formData = buildCreatorPortfolioUploadFormData({
      profile: fullProfile,
      files: [file],
    });

    expect(formData.getAll("portfolio")).toHaveLength(0);
  });
});
