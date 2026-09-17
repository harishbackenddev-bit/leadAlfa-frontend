import { describe, it, expect } from "vitest";
import {
  isTurnstileError,
  TURNSTILE_FAILED_MESSAGE,
  TURNSTILE_MISSING_TOKEN_MESSAGE,
} from "../../src/utils/turnstileErrors";

describe("turnstileErrors", () => {
  it("should export user-facing messages", () => {
    expect(TURNSTILE_MISSING_TOKEN_MESSAGE).toMatch(/security verification/i);
    expect(TURNSTILE_FAILED_MESSAGE).toMatch(/security verification/i);
  });

  it("should detect turnstile error from error message", () => {
    expect(isTurnstileError({ error: "Turnstile verification failed" })).toBe(true);
    expect(isTurnstileError({ message: "CAPTCHA token expired" })).toBe(true);
  });

  it("should detect turnstile error from errors array field", () => {
    expect(
      isTurnstileError({
        status: 400,
        errors: [{ field: "captchaToken", message: "Missing CAPTCHA token" }],
      })
    ).toBe(true);
  });

  it("should not treat unrelated login errors as turnstile errors", () => {
    expect(isTurnstileError({ error: "Invalid email or password" })).toBe(false);
    expect(isTurnstileError({ status: 401, error: "Unauthorized" })).toBe(false);
    expect(isTurnstileError(null)).toBe(false);
  });
});
