import { useQuery } from "@tanstack/react-query";

import { fetchWithThrow } from "@/lib/fetcher";

const useTerms = () => {
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["terms"],
    queryFn: async () => {
      const res = await fetchWithThrow(`${process.env.NEXT_PUBLIC_API_URL}terms-conditions/all`);
      return res.json();
    },
  });
  return {
    terms: data,
    isLoading,
    error,
    refetch

  };
};
export default useTerms;
