import { describe, expect, it } from "vitest";
import { resolveProfileVerificationState } from "../../src/utils/profileVerificationState";

describe("resolveProfileVerificationState", () => {
  it("should detect pending review state", () => {
    const result = resolveProfileVerificationState(
      { status: "pending", clarificationRequested: false },
      { email: "creator@example.com" }
    );

    expect(result.isPending).toBe(true);
    expect(result.isClarification).toBe(false);
    expect(result.isRejected).toBe(false);
  });

  it("should detect clarification when clarificationRequested is true", () => {
    const result = resolveProfileVerificationState(
      {
        status: "pending",
        clarificationRequested: true,
        clarificationMessage: "Please upload your ID document again.",
      },
      { email: "creator@example.com" }
    );

    expect(result.isClarification).toBe(true);
    expect(result.isPending).toBe(false);
    expect(result.clarificationMessage).toContain("ID document");
    expect(result.notifyEmail).toBe("creator@example.com");
  });

  it("should detect clarification when status is clarification_requested", () => {
    const result = resolveProfileVerificationState(
      { status: "clarification_requested", clarificationRequested: true },
      { email: "brand@example.com" }
    );

    expect(result.isClarification).toBe(true);
    expect(result.status).toBe("clarification_requested");
  });

  it("should detect rejected state and reason", () => {
    const result = resolveProfileVerificationState(
      {
        status: "rejected",
        rejectionReason: "Incomplete profile information.",
      },
      { email: "creator@example.com" }
    );

    expect(result.isRejected).toBe(true);
    expect(result.isClarification).toBe(false);
    expect(result.rejectionReason).toContain("Incomplete profile");
  });

  it("should prefer company email for brand clarification notices", () => {
    const result = resolveProfileVerificationState(
      {
        status: "clarification_requested",
        clarificationRequested: true,
        companyEmail: "contact@brand.com",
      },
      { role: "brand", email: "owner@brand.com" }
    );

    expect(result.notifyEmail).toBe("contact@brand.com");
  });
});
