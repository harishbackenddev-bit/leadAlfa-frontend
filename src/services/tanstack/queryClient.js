import { QueryClient } from "@tanstack/react-query";

/**
 * Global React Query Configuration
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: true,
      refetchOnMount: "always", // Always hit API on trigger
      refetchOnReconnect: true,
      refetchInterval: false, // Disable polling
      refetchIntervalInBackground: false,
      suspense: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

export default queryClient;
