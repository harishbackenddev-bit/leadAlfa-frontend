import { forwardRef } from "react";
import { Turnstile } from "@marsidev/react-turnstile";
import { TURNSTILE_ENABLED, TURNSTILE_SITE_KEY } from "../../constants/turnstile";

const TurnstileWidget = forwardRef(function TurnstileWidget(
  { onSuccess, onExpire, onError, className = "" },
  ref
) {
  if (!TURNSTILE_ENABLED) return null;

  return (
    <div
      className={`turnstile-widget-host w-full overflow-visible ${className}`}
    >
      <div className="w-full min-h-[65px] rounded-md border border-gray-200 bg-slate-50/80 px-3 py-2 overflow-visible">
        <Turnstile
          ref={ref}
          siteKey={TURNSTILE_SITE_KEY}
          onSuccess={onSuccess}
          onExpire={onExpire}
          onError={onError}
          options={{
            theme: "light",
            size: "flexible",
          }}
          className="w-full"
        />
      </div>
    </div>
  );
});

export default TurnstileWidget;
