export interface ImageData {
    url: string;
    altText?: string;
  }
  
  export interface SimilarArticle {
    id: string;
    title: string;
    url: string;
    image: ImageData;
  }
  
  export interface Section {
    title: string;
    description: string;
    image?: ImageData | null;
  }
  
  export interface Tag {
    name: string;
    icon: string | File | null;
  }
  
  export interface SEOConfig {
    _id?: string;
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
    title: string;
    description: string;
    content: string;
    author: string;
    categories: string[];
    createdAt: string;
    image?: ImageData;
    section?: Section[];
    tags?: Tag[];
    seo?: SEOConfig;
    similarArticles?: SimilarArticle[];
    publishedDate?: string;
    updatedAt?: string;
    id?: string;
  }


  export interface Service {
    _id: string;
    description: string;
    category: string;
    seo: {
      language: string;
      metaTitle: string;
      metaDescription: string;
      keywords: string;
      canonicalTag: string;
      structuredData: any;
      _id: string;
    };
  }
  
  export interface ServicesResponse {
    globalSeo: {
      language: string;
      metaTitle: string;
      metaDescription: string;
      keywords: string;
      canonicalTag: string;
      structuredData: any;
    };
    services: Service[];
  }
  
  export interface PortfolioItem {
    _id: string;
    name: string;
    description: string;
    seo: {
      language: string;
      metaTitle: string;
      metaDescription: string;
      keywords: string;
      canonicalTag: string;
      _id: string;
    };
    images: Array<{
      url: string;
      altText: string;
      caption: string;
      _id: string;
      id: string;
    }>;
    category: string;
    id: string;
  }
  
  export interface PortfolioResponse {
    globalSeo: {
      language: string;
      metaTitle: string;
      metaDescription: string;
      keywords: string;
      canonicalTag: string;
      structuredData: any;
    };
    portfolioItems: PortfolioItem[];
  }
  
  // export interface Blog {
  //   image: {
  //     url: string;
  //     altText: string;
  //   };
  //   _id: string;
  //   title: string;
  //   description: string;
  //   section: Array<{
  //     title: string;
  //     description: string;
  //     image: {
  //       url: string;
  //       altText: string;
  //     };
  //   }>;
  //   content: string;
  //   categories: string[];
  //   author: string;
  //   seo: {
  //     language: string;
  //     metaTitle: string;
  //     metaDescription: string;
  //     keywords: string;
  //     canonicalTag: string;
  //     structuredData: any;
  //     _id: string;
  //   };
  //   similarArticles: any[];
  //   createdAt: string;
  //   id: string;
  // }
  
  export interface BlogsResponse {
    globalSeo: {
      language: string;
      metaTitle: string;
      metaDescription: string;
      keywords: string;
      canonicalTag: string;
      structuredData: any;
    };
    blogs: Blog[];
  }