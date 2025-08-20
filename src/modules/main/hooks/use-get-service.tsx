import { useQuery } from "@tanstack/react-query";

import { fetchWithThrow } from "@/lib/fetcher";

const useGetService = (serviceId:any) => {
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["services", serviceId],
    queryFn: async () => {
      const res = await fetchWithThrow(`/api/services/all/${serviceId}`);
      return res.json();
    },
  });
  return {
    service: data,
    isLoading,
    error,
    refetch,
  };
};
export default useGetService;
