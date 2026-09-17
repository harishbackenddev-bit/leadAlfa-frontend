import { useCallback, useRef, useState } from "react";
import { TURNSTILE_ENABLED } from "../constants/turnstile";
import { toAuthErrorMessage } from "../pages/auth/hooks/useAuthHook";
import {
  isTurnstileError,
  TURNSTILE_FAILED_MESSAGE,
  TURNSTILE_MISSING_TOKEN_MESSAGE,
} from "../utils/turnstileErrors";

export function useTurnstileCaptcha() {
  const turnstileRef = useRef(null);
  const [captchaToken, setCaptchaToken] = useState("");
  const [captchaError, setCaptchaError] = useState("");

  const resetTurnstile = useCallback(() => {
    setCaptchaToken("");
    turnstileRef.current?.reset();
  }, []);

  const clearCaptchaError = useCallback(() => {
    setCaptchaError("");
  }, []);

  const handleCaptchaSuccess = useCallback((token) => {
    setCaptchaToken(token);
    setCaptchaError((current) =>
      current === TURNSTILE_MISSING_TOKEN_MESSAGE ||
      current === TURNSTILE_FAILED_MESSAGE
        ? ""
        : current
    );
  }, []);

  const handleCaptchaExpire = useCallback(() => {
    setCaptchaToken("");
  }, []);

  const handleCaptchaError = useCallback(() => {
    setCaptchaToken("");
    setCaptchaError(TURNSTILE_FAILED_MESSAGE);
  }, []);

  const requireCaptchaToken = useCallback(() => {
    if (!TURNSTILE_ENABLED) return true;
    if (captchaToken) return true;
    setCaptchaError(TURNSTILE_MISSING_TOKEN_MESSAGE);
    return false;
  }, [captchaToken]);

  const withCaptchaPayload = useCallback(
    (payload) => ({
      ...payload,
      ...(captchaToken ? { captchaToken } : {}),
    }),
    [captchaToken]
  );

  const handleCaptchaApiError = useCallback(
    (err) => {
      if (!isTurnstileError(err)) return false;
      resetTurnstile();
      setCaptchaError(toAuthErrorMessage(err) || TURNSTILE_FAILED_MESSAGE);
      return true;
    },
    [resetTurnstile]
  );

  const isCaptchaReady = !TURNSTILE_ENABLED || Boolean(captchaToken);

  return {
    turnstileRef,
    captchaToken,
    captchaError,
    setCaptchaError,
    clearCaptchaError,
    resetTurnstile,
    handleCaptchaSuccess,
    handleCaptchaExpire,
    handleCaptchaError,
    requireCaptchaToken,
    withCaptchaPayload,
    handleCaptchaApiError,
    isCaptchaReady,
  };
}
