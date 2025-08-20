import { useQuery } from "@tanstack/react-query";

import { fetchWithThrow } from "@/lib/fetcher";

const useEmployees = () => {
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["employees"],
    queryFn: async () => {
      const res = await fetchWithThrow(`/api/employees`)
      return res.json();
    },
  });

  return {
    employees: data,
    isLoading,
    error,
    refetch,
  };
};

export default useEmployees;
