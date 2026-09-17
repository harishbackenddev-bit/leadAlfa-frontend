import { describe, expect, it } from "vitest";
import { creatorBasicInfoSchema } from "../../src/schemas/basicInfoSchema";

describe("creatorBasicInfoSchema address validation", () => {
  const dummyFile = new File(["dummy"], "photo.png", { type: "image/png" });
  const dummyVideo = new File(["dummy"], "video.mp4", { type: "video/mp4" });

  const validPayload = {
    firstName: "Jane",
    lastName: "Doe",
    email: "jane@example.com",
    phoneNumber: "+27821234567",
    publicCreatorName: "janedoe",
    dateOfBirth: "1995-05-15",
    ethnicity: "black",
    appearance: "curvy",
    gender: "female",
    bio: "This is a valid test bio with more than 10 characters.",
    saCitizen: "yes",
    saIdNumber: "9001015009086",
    addressLine1: "24 Main Road",
    addressLine2: "Apt 3",
    suburb: "Sea Point",
    city: "Cape Town",
    province: "Western Cape",
    postalCode: "8005",
    deliveryInstructions: "Leave at door",
    languageSpoken: ["English"],
    primaryNiche: "1",
    hasPets: "no",
    hasChildren: "no",
    skillsUrl: "https://example.com/skills",
    profilePhoto: dummyFile,
    introVideo: dummyVideo,
  };

  it("should validate a valid address payload successfully", () => {
    const result = creatorBasicInfoSchema.safeParse(validPayload);
    expect(result.success).toBe(true);
  });

  it("should fail validation when postalCode is not 4 digits", () => {
    const invalidPayload = { ...validPayload, postalCode: "123" };
    const result = creatorBasicInfoSchema.safeParse(invalidPayload);
    expect(result.success).toBe(false);
    if (!result.success) {
      const fieldError = result.error.format().postalCode;
      expect(fieldError?._errors[0]).toBe(
        "Postal code must be a 4-digit South African postal code (e.g. 8001)"
      );
    }
  });

  it("should fail validation when required address fields are missing", () => {
    const missingAddress1 = { ...validPayload, addressLine1: "" };
    const missingSuburb = { ...validPayload, suburb: "" };

    expect(creatorBasicInfoSchema.safeParse(missingAddress1).success).toBe(false);
    expect(creatorBasicInfoSchema.safeParse(missingSuburb).success).toBe(false);
  });
});
