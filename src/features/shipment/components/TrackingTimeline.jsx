import { Check, MapPin, Truck } from "lucide-react";
import ShipmentStatusBadge from "./ShipmentStatusBadge";

const ARRIVED = ["delivered", "content_creation"];

const stamp = (value) => {
  if (!value) return "";
  const date = new Date(value);
  const day = date.toLocaleDateString("en-ZA", { day: "numeric", month: "short", year: "numeric" });
  const time = date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
  return `${day} · ${time}`;
};

const shortDate = (value) =>
  new Date(value).toLocaleDateString("en-ZA", { day: "numeric", month: "short", year: "numeric" });

function withExpectedStep(shipment) {
  const done = (shipment.events || []).map((event) => ({ ...event, done: true }));
  if (!shipment.estimatedDeliveryAt || ARRIVED.includes(shipment.status)) return done;
  return [
    ...done,
    {
      type: "expected",
      label: "Expected delivery",
      when: `Est. ${shortDate(shipment.estimatedDeliveryAt)}`,
      location: "Creator Location",
      done: false,
    },
  ];
}

export default function TrackingTimeline({ shipment, creator = false }) {
  const items = withExpectedStep(shipment);

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-[0_1px_2px_0_rgb(16_24_40_/_0.04)] sm:p-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 text-xl font-bold text-[#111827]">
          <Truck className="h-[22px] w-[22px] text-[#0c7bb3]" />
          Tracking Updates
        </h2>
        <ShipmentStatusBadge status={shipment.status} creator={creator} />
      </div>

      <ol>
        {items.map((item, index) => (
          <li key={`${item.type}-${item.occurredAt || item.when}`} className="relative flex gap-3 pb-6 last:pb-0">
            {index < items.length - 1 && (
              <span className="absolute bottom-0 left-[10px] top-[24px] w-0.5 bg-[#0c7bb3]/60" aria-hidden />
            )}
            <span
              className={`relative z-10 mt-0.5 flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full ${
                item.done ? "bg-[#0c7bb3] text-white" : "border-2 border-gray-300 bg-white"
              }`}
            >
              {item.done && <Check className="h-3 w-3" strokeWidth={3} />}
            </span>
            <div className="min-w-0">
              <p className={`text-[17px] font-semibold ${item.done ? "text-[#111827]" : "text-[#6B7280]"}`}>
                {item.label}
              </p>
              <p className={`mt-0.5 text-[15px] ${item.done ? "text-[#5B7C99]" : "text-[#6B7280]"}`}>
                {item.when || stamp(item.occurredAt)}
              </p>
              {item.location && (
                <p
                  className={`mt-1 flex items-center gap-1 text-[13px] ${
                    item.done ? "text-[#606977]" : "text-[#6B7280]"
                  }`}
                >
                  <MapPin className="h-3.5 w-3.5" />
                  {item.location}
                </p>
              )}
            </div>
          </li>
        ))}
      </ol>

      {!items.length && <p className="text-sm text-[#606977]">No tracking updates yet.</p>}
    </section>
  );
}
