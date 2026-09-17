import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useTurnstileCaptcha } from "../../src/hooks/useTurnstileCaptcha";
import {
  TURNSTILE_FAILED_MESSAGE,
  TURNSTILE_MISSING_TOKEN_MESSAGE,
} from "../../src/utils/turnstileErrors";

describe("useTurnstileCaptcha", () => {
  it("should require captcha token when enabled", () => {
    const { result } = renderHook(() => useTurnstileCaptcha());

    let allowed = false;
    act(() => {
      allowed = result.current.requireCaptchaToken();
    });

    expect(allowed).toBe(false);
    expect(result.current.captchaError).toBe(TURNSTILE_MISSING_TOKEN_MESSAGE);
  });

  it("should attach captchaToken to payload after success", () => {
    const { result } = renderHook(() => useTurnstileCaptcha());

    act(() => {
      result.current.handleCaptchaSuccess("token-123");
    });

    expect(result.current.withCaptchaPayload({ email: "a@b.com" })).toEqual({
      email: "a@b.com",
      captchaToken: "token-123",
    });
    expect(result.current.isCaptchaReady).toBe(true);
  });

  it("should handle widget error and clear token", () => {
    const { result } = renderHook(() => useTurnstileCaptcha());

    act(() => {
      result.current.handleCaptchaSuccess("token-123");
      result.current.handleCaptchaError();
    });

    expect(result.current.captchaError).toBe(TURNSTILE_FAILED_MESSAGE);
    expect(result.current.isCaptchaReady).toBe(false);
  });

  it("should handle backend captcha api error", () => {
    const { result } = renderHook(() => useTurnstileCaptcha());

    act(() => {
      result.current.handleCaptchaSuccess("token-123");
    });

    let handled = false;
    act(() => {
      handled = result.current.handleCaptchaApiError({
        status: 400,
        error: "Turnstile verification failed",
      });
    });

    expect(handled).toBe(true);
    expect(result.current.captchaError).toBe("Turnstile verification failed");
    expect(result.current.isCaptchaReady).toBe(false);
  });

  it("should not handle unrelated api errors as captcha errors", () => {
    const { result } = renderHook(() => useTurnstileCaptcha());

    let handled = false;
    act(() => {
      handled = result.current.handleCaptchaApiError({
        error: "Invalid email or password",
      });
    });

    expect(handled).toBe(false);
    expect(result.current.captchaError).toBe("");
  });
});
