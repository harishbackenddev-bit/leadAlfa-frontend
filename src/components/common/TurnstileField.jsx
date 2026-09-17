import TurnstileWidget from "./TurnstileWidget";
import { TURNSTILE_ENABLED } from "../../constants/turnstile";

export default function TurnstileField({ captcha, className = "" }) {
  if (!TURNSTILE_ENABLED || !captcha) return null;

  return (
    <div className={className}>
      {captcha.captchaError ? (
        <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
          {captcha.captchaError}
        </div>
      ) : null}
      <TurnstileWidget
        ref={captcha.turnstileRef}
        onSuccess={captcha.handleCaptchaSuccess}
        onExpire={captcha.handleCaptchaExpire}
        onError={captcha.handleCaptchaError}
      />
    </div>
  );
}
