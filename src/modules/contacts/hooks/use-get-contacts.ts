import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const useGetContacts = () => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["contacts"],
    queryFn: async () => {
      const res = await axios.get(`/api/contacts`).then((response) => {
        if (response.status !== 200) {
          throw new Error(`Failed to fetch contacts: ${response.statusText}`);
        }
        return response.data;
      });
      return res.data;
    },
  });
  return {
    contacts: data?.data,
    isLoading,
    error,
    refetch,
  };
};

export default useGetContacts;
