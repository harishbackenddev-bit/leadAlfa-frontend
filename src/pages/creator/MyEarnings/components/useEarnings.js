import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../../services/api/axiosInstance";
import { queryKeys } from "../../../services/tanstack/queryKeys";

const fetchCreator = (path, params) =>
  axiosInstance.get(`/tradesafe-payment/creator/${path}`, { params }).then(({ data }) => data.data);

export const useCreatorBalance = () =>
  useQuery({
    queryKey: queryKeys.creator.earningsBalance(),
    queryFn: () => fetchCreator("balance"),
    staleTime: 60 * 1000,
  });

export const useCreatorTransactions = () =>
  useQuery({
    queryKey: queryKeys.creator.earningsTransactions(),
    queryFn: () => fetchCreator("transactions", { page: 1, limit: 100 }),
    staleTime: 60 * 1000,
  });
