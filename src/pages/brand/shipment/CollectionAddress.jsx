import AddressForm from "../../../features/shipment/components/AddressForm";
import { useShipments } from "../../../features/shipment/useShipments";

export default function CollectionAddress() {
  const { address, saveAddress } = useShipments("brand");

  return (
    <div className="mx-auto max-w-3xl p-6">
      <h1 className="text-2xl font-bold text-slate-900">Collection address</h1>
      <p className="mt-1 text-sm text-slate-500">
        Where couriers pick up your parcels. You can change it per shipment later.
      </p>

      <div className="mt-6">
        <AddressForm
          title="Where should couriers collect from?"
          description="This is the pickup address printed on the waybill."
          initial={address}
          saved={Boolean(address)}
          onSave={saveAddress}
        />
      </div>
    </div>
  );
}
