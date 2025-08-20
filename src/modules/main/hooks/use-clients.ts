import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const useClients = () => {
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["clients"],
    queryFn: async () => {
      const res = await axios.get(`/api/clients`).then((response) => {
        if (response.status !== 200) {
          throw new Error(`Failed to fetch clients: ${response.statusText}`);
        }
        return response.data;
      });
      return res;
    },
  });
  return {
    clients: isLoading ? [] : data,
    isLoading,
    error,
    refetch,
  };
};
export default useClients;
