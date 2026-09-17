export const STAGES = [
  { label: "Order Placed", note: "Shipment created", types: ["created", "booked"] },
  { label: "Collected", note: "Courier has the parcel", types: ["collected", "collection-assigned"] },
  { label: "In Transit", note: "On its way", types: ["in-transit", "at-hub", "at-destination-hub"] },
  { label: "Out for Delivery", note: "Arriving today", types: ["out-for-delivery", "ready-for-pickup"] },
  { label: "Delivered", note: "Awaiting delivery", types: ["delivered", "finalised"] },
];

export const eventForStage = (events, stage) =>
  (events || []).find((event) => stage.types.includes(event.type));

export const reachedFor = (status) =>
  ({
    awaiting_payment: 0,
    pending: 0,
    awaiting_shipment: 1,
    in_transit: 2,
    out_for_delivery: 3,
    delivered: 4,
    content_creation: 4,
    exception: 2,
  }[status] ?? 0);
