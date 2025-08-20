import { useQuery } from "@tanstack/react-query";

import { fetchWithThrow } from "@/lib/fetcher";

const useTestimonials = () => {
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["testimonials"],
    queryFn: async () => {
      const res = await fetchWithThrow(
        `${process.env.NEXT_PUBLIC_API_URL}testimonial`
      );
      return res.json();
    },
  });
  return {
    testimonials: data,
    isLoading,
    error,
    refetch,
  };
};
export default useTestimonials;
