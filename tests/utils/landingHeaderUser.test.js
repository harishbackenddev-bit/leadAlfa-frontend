import { describe, expect, it } from "vitest";
import { resolveLandingHeaderUserDisplay } from "../../src/utils/landingHeaderUser";

describe("resolveLandingHeaderUserDisplay", () => {
  it("should use brand company logo and name when logo exists", () => {
    const result = resolveLandingHeaderUserDisplay({
      role: "brand",
      firstName: "Jane",
      lastName: "Doe",
      profile: {
        companyName: "Lava Co.",
        media: {
          logo: {
            url: "https://cdn.example.com/logo.jpg",
          },
        },
      },
    });

    expect(result.avatarUrl).toBe("https://cdn.example.com/logo.jpg");
    expect(result.displayName).toBe("Lava Co.");
    expect(result.initials).toBe("LC");
    expect(result.roleLabel).toBe("Brand");
  });

  it("should fall back to brand initials when logo is missing", () => {
    const result = resolveLandingHeaderUserDisplay({
      role: "brand",
      firstName: "Jane",
      lastName: "Doe",
      profile: {
        companyName: "Lava Esto",
      },
    });

    expect(result.avatarUrl).toBeNull();
    expect(result.displayName).toBe("Lava Esto");
    expect(result.initials).toBe("LE");
  });

  it("should use creator profile photo when available", () => {
    const result = resolveLandingHeaderUserDisplay({
      role: "creator",
      firstName: "Sarah",
      lastName: "Johnson",
      profile: {
        media: {
          profilePhoto: {
            mediaDetails: {
              url: "https://cdn.example.com/avatar.jpg",
            },
          },
        },
      },
    });

    expect(result.avatarUrl).toBe("https://cdn.example.com/avatar.jpg");
    expect(result.displayName).toBe("Sarah Johnson");
    expect(result.initials).toBe("SJ");
    expect(result.roleLabel).toBe("Creator");
  });

  it("should fall back to creator initials when photo is missing", () => {
    const result = resolveLandingHeaderUserDisplay({
      role: "creator",
      firstName: "Sarah",
      lastName: "Johnson",
      profile: {},
    });

    expect(result.avatarUrl).toBeNull();
    expect(result.initials).toBe("SJ");
  });
});
