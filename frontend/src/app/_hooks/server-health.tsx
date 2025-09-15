import { useQuery } from "@tanstack/react-query";

export const useServerHealth = () =>
  useQuery({
    queryKey: ["server-health"],
    queryFn: async () => {
      const response = await fetch(
        new URL("/health", process.env.NEXT_PUBLIC_SERVER_URL),
        {
          method: "GET",
          credentials: "include",
        },
      );
      if (!response.ok) throw new Error("Server is not healthy");
      return response.json();
    },
    refetchInterval: 10000,
    retry: true,
    staleTime: 30000,
    refetchOnMount: true,
    refetchOnReconnect: true,
    refetchOnWindowFocus: true,
    refetchIntervalInBackground: true,
  });
