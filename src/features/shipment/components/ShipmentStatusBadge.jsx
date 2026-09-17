import { CircleAlert, CircleCheck, Clapperboard, Clock, Package, Truck } from "lucide-react";

const tones = {
  neutral: "border-slate-200 bg-slate-50 text-slate-600",
  amber: "border-amber-300 bg-amber-50 text-amber-700",
  blue: "border-blue-200 bg-blue-50 text-blue-700",
  green: "border-emerald-200 bg-emerald-50 text-emerald-700",
  violet: "border-violet-200 bg-violet-50 text-violet-700",
};

const brandStates = {
  awaiting_payment: { label: "Unpaid", tone: "amber", Icon: Clock },
  pending: { label: "Pending Shipment", tone: "neutral", Icon: Package },
  awaiting_shipment: { label: "Booked", tone: "green", Icon: CircleCheck },
  in_transit: { label: "In Transit", tone: "blue", Icon: Truck },
  out_for_delivery: { label: "Out for Delivery", tone: "blue", Icon: Truck },
  delivered: { label: "Delivered", tone: "green", Icon: CircleCheck },
  content_creation: { label: "Content Creation", tone: "violet", Icon: Clapperboard },
};

const creatorStates = {
  ...brandStates,
  pending: { label: "Pending", tone: "amber", Icon: Clock },
  awaiting_shipment: { label: "Pending", tone: "amber", Icon: Clock },
  delivered: { label: "Awaiting Your Confirmation", tone: "amber", Icon: CircleAlert },
  content_creation: { label: "Delivered", tone: "green", Icon: CircleCheck },
};

export default function ShipmentStatusBadge({ status, creator = false }) {
  const state = (creator ? creatorStates : brandStates)[status];
  if (!state) return null;

  const { label, tone, Icon } = state;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${tones[tone]}`}
    >
      <Icon className="h-3 w-3" />
      {label}
    </span>
  );
}
