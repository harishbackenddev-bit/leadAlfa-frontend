import AddressForm from "../../../features/shipment/components/AddressForm";
import { useShipments } from "../../../features/shipment/useShipments";

export default function DeliveryAddress() {
  const { address, saveAddress } = useShipments("creator");

  return (
    <div className="mx-auto max-w-3xl p-6">
      <h1 className="text-2xl font-bold text-slate-900">Delivery address</h1>
      <p className="mt-1 text-sm text-slate-500">
        Where brands send you product. Brands can&apos;t book a courier until this is filled in.
      </p>

      <div className="mt-6">
        <AddressForm
          title="Where should brands send your product?"
          description="Only brands actively shipping to you can see this. It appears on the parcel label."
          initial={address}
          saved={Boolean(address)}
          onSave={saveAddress}
        />
      </div>
    </div>
  );
}
