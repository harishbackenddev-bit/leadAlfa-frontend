import ShipmentStatusBadge from "./ShipmentStatusBadge";

export default function CreatorShipmentCard({ shipment, onConfirmReceived }) {
  const isDelivered = shipment.status === "delivered";
  const isContent = shipment.status === "content_creation";
  return <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
    <div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600">Incoming shipment</p><h2 className="mt-2 text-xl font-bold text-slate-900">{shipment.campaignTitle}</h2><p className="mt-1 text-sm text-slate-500">From {shipment.brand.name}</p></div><ShipmentStatusBadge status={shipment.status} /></div>
    <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-100"><div className={`h-full rounded-full ${isContent || isDelivered ? "w-full bg-emerald-400" : shipment.status === "in_transit" ? "w-2/3 bg-blue-500" : "w-1/3 bg-amber-400"}`} /></div>
    {shipment.courierName ? <div className="mt-5 grid gap-4 text-sm sm:grid-cols-3"><div><p className="text-slate-500">Courier</p><p className="font-semibold text-slate-900">{shipment.courierName}</p></div><div><p className="text-slate-500">Tracking number</p><p className="font-semibold text-slate-900">{shipment.trackingNumber}</p></div><div><p className="text-slate-500">Estimated delivery</p><p className="font-semibold text-slate-900">{shipment.estimatedDeliveryAt ? new Date(shipment.estimatedDeliveryAt).toLocaleDateString() : "To be confirmed"}</p></div></div> : <p className="mt-5 text-sm text-slate-600">Your shipment details will appear here once the brand dispatches your product.</p>}
    {isDelivered ? <button type="button" onClick={onConfirmReceived} className="mt-5 w-full rounded-xl bg-emerald-400 px-4 py-3 text-sm font-bold text-slate-950 hover:bg-emerald-300">Confirm product received</button> : null}
    {isContent ? <div className="mt-5 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-900">Product received. Your 7-day content creation window has started.</div> : null}
  </section>;
}

