/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable security/detect-object-injection */
/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable complexity */
/* eslint-disable max-lines */
import { fetchWithThrow } from "@/lib/fetcher";
import { useQuery } from "@tanstack/react-query";

export interface BlogImage {
  url: string;
  altText: string;
}

export interface BlogSection {
  title: string;
  description: string;
  image: {
    altText: string;
    url?: string;
  };
}

export interface BlogTag {
  name: string;
  icon: string | File;
}

export interface BlogSEO {
  language: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  canonicalTag: string;
  structuredData: {
    "@context": string;
    "@type": string;
    name: string;
    description: string;
    provider: {
      "@type": string;
      name: string;
      url: string;
    };
  };
}

export interface Blog {
  _id: string;
  id: string;
  title: string;
  description: string;
  content: string;
  image: BlogImage;
  section: BlogSection[];
  categories: string[];
  author: string;
  seo: BlogSEO;
  similarArticles: string[];
  createdAt: string;
}

export interface BlogsResponse {
  blogs: Blog[];
  success: boolean;
  message?: string;
}



const useGetBlogs = () => {
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["blogs"],
    queryFn: async () => {
      const res = await fetchWithThrow(`${process.env.NEXT_PUBLIC_API_URL}blogs`);
      return res.json();
    },
  });
  return {
    blogs: data?.data?.blogs,
    isLoading,
    error,
    refetch,
  };
};


export default useGetBlogs;