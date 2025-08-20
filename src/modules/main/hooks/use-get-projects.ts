/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const useGetProjects = () => {
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const res = await axios.get(`/api/projects?`).then((response) => {
        if (response.status !== 200) {
          throw new Error(`Failed to fetch projects: ${response.statusText}`);
        }
        return response.data;
      });
      return res;
    },
  });
  return {
    projects: data,
    isLoading,
    error,
    refetch,
  };
};

export default useGetProjects;

export const useGetProjectById = (id: any) => {
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["project", id],
    queryFn: async () => {
      const res = await axios.get(`/api/projects/${id}`).then((response) => {
        if (response.status !== 200) {
          throw new Error(`Failed to fetch project: ${response.statusText}`);
        }
        return response.data;
      });
      return res;
    },
  });
  return {
    project: data?.data,
    isLoading,
    error,
    refetch,
  };
};
