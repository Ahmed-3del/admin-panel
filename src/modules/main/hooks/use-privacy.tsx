import { useQuery } from "@tanstack/react-query";

import { fetchWithThrow } from "@/lib/fetcher";

const usePrivacy = () => {
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["privacy"],
    queryFn: async () => {
      const res = await fetchWithThrow(`${process.env.NEXT_PUBLIC_API_URL}privacy-policy/all`);
      return res.json();
    },
  });
  return {
    privacy: data,
    isLoading,
    error,
    refetch

  };
};
export default usePrivacy;
