import { vi } from "vitest";
import { useEffect } from "react";

export let turnstileAutoSuccess = true;

export const resetTurnstileMock = () => {
  turnstileAutoSuccess = true;
};

export const mockTurnstileWidget = () => {
  vi.mock("../../src/components/common/TurnstileWidget", () => ({
    default: ({ onSuccess, onExpire, onError }) => {
      useEffect(() => {
        if (turnstileAutoSuccess) {
          onSuccess?.("test-captcha-token");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);

      return (
        <div data-testid="turnstile-widget">
          <button type="button" onClick={() => onSuccess?.("manual-captcha-token")}>
            Complete verification
          </button>
          <button type="button" onClick={() => onExpire?.()}>
            Expire verification
          </button>
          <button type="button" onClick={() => onError?.()}>
            Fail verification
          </button>
        </div>
      );
    },
  }));
};
