import { useQuery } from "@tanstack/react-query";

import { fetchWithThrow } from "@/lib/fetcher";

const useServices = () => {
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      const res = await fetchWithThrow(`/api/services`);
      return res.json();
    },
  });
  return {
    services: data,
    isLoading,
    error,
    refetch,
  };
};
export default useServices;
