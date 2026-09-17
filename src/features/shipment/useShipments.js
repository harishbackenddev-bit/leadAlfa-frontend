import { useCallback, useEffect, useState } from "react";
import {
  confirmShipmentReceived,
  createShipments as createShipmentsApi,
  fetchBrandShipments,
  fetchCreatorShipments,
  fetchAddress,
  markShipmentDelivered,
  saveAddress as saveAddressApi,
} from "../../services/api/shipmentApi";
import { paymentsEnabled } from "./payments";

const MOVING = ["awaiting_shipment", "in_transit", "out_for_delivery"];

export function useShipments(role) {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [address, setAddress] = useState(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const list = role === "creator" ? await fetchCreatorShipments() : await fetchBrandShipments();
      setShipments(list);
      setError("");
      return list;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [role]);

  useEffect(() => {
    refresh();
    fetchAddress(role).then(setAddress).catch(() => setAddress(null));
  }, [refresh, role]);

  const watching = shipments.some((item) => MOVING.includes(item.status));
  useEffect(() => {
    if (!watching || typeof document === "undefined") return;
    const timer = setInterval(() => {
      if (!document.hidden) refresh();
    }, 30000);
    return () => clearInterval(timer);
  }, [watching, refresh]);

  const run = useCallback(
    async (action) => {
      try {
        const updated = await action();
        setShipments((current) => {
          const list = Array.isArray(updated) ? updated : [updated];
          const byId = new Map(current.map((item) => [item.id, item]));
          list.forEach((item) => byId.set(item.id, item));
          return [...byId.values()].sort((a, b) => b.id - a.id);
        });
        setError("");
        return updated;
      } catch (err) {
        setError(err.message);
        throw err;
      }
    },
    []
  );

  const saveRoleAddress = useCallback(
    async (values) => {
      const saved = await saveAddressApi(role, values);
      setAddress(saved);
      return saved;
    },
    [role]
  );

  return {
    shipments,
    loading,
    error,
    refresh,
    address,
    paymentsEnabled,
    saveAddress: saveRoleAddress,
    createShipments: async (payload) => {
      const result = await createShipmentsApi(payload);
      if (result?.checkout) return result;
      await refresh();
      return result;
    },
    markDelivered: (id) => run(() => markShipmentDelivered(id)),
    confirmReceived: (id) => run(() => confirmShipmentReceived(id)),
  };
}
