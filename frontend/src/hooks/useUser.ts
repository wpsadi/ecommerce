import { authClient } from "@/lib/auth-client";

export const useUser = () => {
  const { useSession } = authClient;
  const { refetch } = useSession();

  // now we implement a useQuery that will refetch the user data every 5 minutes
  // useQuery({
  //     queryKey: ['user'],
  //     queryFn: ()=>{
  //         refetch();
  //         return "refetched";
  //     },
  //     staleTime: 5*60*1000, // 5 minutes
  //     refetchOnWindowFocus: false,
  //     refetchOnReconnect: false,
  //     refetchInterval: false,
  //     enabled: true, // fetch immediately
  // })

  return useSession();
};
