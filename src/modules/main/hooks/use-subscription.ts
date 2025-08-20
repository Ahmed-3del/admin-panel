import { useQuery } from "@tanstack/react-query";

import { fetchWithThrow } from "@/lib/fetcher";

const useSubscription = () => {
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["subscription"],
    queryFn: async () => {
      const res = await fetchWithThrow(`${process.env.NEXT_PUBLIC_API_URL}mailing-list`);
      return res.json();
    },
  });
  return {
    subscription: data,
    isLoading,
    error,
    refetch

  };
};
export default useSubscription;
