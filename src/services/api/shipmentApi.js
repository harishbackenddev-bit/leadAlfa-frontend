import axiosInstance from "./axiosInstance";

const extractError = (error, fallback) => {
  const data = error?.response?.data;
  if (data?.error) return data.error;
  if (data?.errors?.length) return data.errors[0].message;
  if (data?.message) return data.message;
  return fallback;
};

const call = async (promise, fallback) => {
  try {
    const { data } = await promise;
    return data;
  } catch (error) {
    throw new Error(extractError(error, fallback));
  }
};

export const fetchAddress = (role) =>
  call(axiosInstance.get(`/${role}/shipping-address`), "Failed to load your address.").then((d) => d.address);

export const saveAddress = (role, address) =>
  call(axiosInstance.put(`/${role}/shipping-address`, address), "Failed to save your address.").then((d) => d.address);

export const fetchCreatorDeliveryAddress = (campaignId, creatorId) =>
  call(
    axiosInstance.get(`/brand/campaigns/${campaignId}/creators/${creatorId}/shipping-address`),
    "Failed to load that creator's delivery address."
  ).then((d) => d.address);

export const fetchBrandShipments = () =>
  call(axiosInstance.get("/brand/shipments"), "Failed to load shipments.").then((d) => d.shipments);

export const fetchCreatorShipments = () =>
  call(axiosInstance.get("/creator/shipments"), "Failed to load your parcels.").then((d) => d.shipments);

export const quoteRates = (parcel) =>
  call(axiosInstance.post("/brand/shipment-rates", parcel), "Failed to load courier prices.").then((d) => d.rates);

export const createShipments = (payload) =>
  call(axiosInstance.post("/brand/shipments", payload), "Failed to create shipment.");

export const markShipmentDelivered = (id) =>
  call(axiosInstance.post(`/brand/shipments/${id}/mark-delivered`), "Failed to update shipment.").then((d) => d.shipment);

export const confirmShipmentReceived = (id) =>
  call(axiosInstance.post(`/creator/shipments/${id}/confirm-receipt`), "Failed to confirm receipt.").then((d) => d.shipment);
