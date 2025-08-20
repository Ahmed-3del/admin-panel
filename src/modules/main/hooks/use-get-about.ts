import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const useGetAbout = () => {
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["about-us"],
    queryFn: async () => {
      const res = await axios.get(`/api/about`).then((response) => {
        if (response.status !== 200) {
          throw new Error(
            `Failed to fetch about: ${response.statusText}`
          );
        }
        return response.data;
      });
      return res;
    },
  });
  return {
    about: data?.data,
    isLoading,
    error,
    refetch,
  };
};

export default useGetAbout;
