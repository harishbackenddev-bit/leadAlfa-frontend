import { describe, expect, it } from "vitest";
import {
  isProfileApproved,
  normalizeProfileFromApiResponse,
} from "../../src/utils/onboardingProfile";

describe("isProfileApproved", () => {
  it("should return true when profile status is approved", () => {
    expect(isProfileApproved({ status: "approved", isVerified: true })).toBe(true);
  });

  it("should return false when profile status is pending", () => {
    expect(isProfileApproved({ status: "pending", isVerified: false })).toBe(false);
  });

  it("should return false when profile status is rejected", () => {
    expect(isProfileApproved({ status: "rejected", isVerified: false })).toBe(false);
  });

  it("should return false when profile status is clarification_requested", () => {
    expect(isProfileApproved({ status: "clarification_requested", isVerified: false })).toBe(
      false
    );
  });

  it("should return false for missing profile", () => {
    expect(isProfileApproved(null)).toBe(false);
    expect(isProfileApproved(undefined)).toBe(false);
  });
});

describe("normalizeProfileFromApiResponse", () => {
  it("should merge sibling media into brand profile", () => {
    const normalized = normalizeProfileFromApiResponse({
      profile: {
        id: 47,
        companyName: "Lava Co.",
        status: "pending",
      },
      media: {
        logo: {
          url: "https://cdn.example.com/logo.jpg",
        },
      },
    });

    expect(normalized.media.logo.url).toBe("https://cdn.example.com/logo.jpg");
    expect(normalized.companyName).toBe("Lava Co.");
  });
});
