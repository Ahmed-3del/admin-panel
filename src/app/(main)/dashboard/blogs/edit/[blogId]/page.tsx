/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable security/detect-object-injection */
/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable complexity */
/* eslint-disable max-lines */

"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Sparkles, Eye, Edit, Calendar, User } from "lucide-react";
import { BlogForm, BlogFormValues } from "@/modules/blogs/modals/blog-form";
import axios from 'axios';
import useGetBlogs, { Blog } from '@/modules/main/hooks/use-get-blogs';
import { useRouter, useParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";

interface BlogPreviewProps {
    formData: BlogFormValues;
    language: 'en' | 'ar';
}

function BlogPreview({ formData, language }: BlogPreviewProps) {
    const isRTL = language === 'ar';

    const getImageUrl = (imageFile: any) => {
        if (imageFile instanceof File || imageFile instanceof Blob) {
            try {
                return URL.createObjectURL(imageFile);
            } catch (error) {
                console.warn('Failed to create object URL:', error);
                return null;
            }
        } else if (typeof imageFile === 'string') {
            return imageFile; // Assuming it's a URL from backend
        }
        return null;
    };

    const mainImageUrl = getImageUrl(formData.image);

    return (
        <div className={`h-full bg-white ${isRTL ? 'rtl' : 'ltr'}`}>
            <div className="max-w-4xl mx-auto p-6">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                        <Calendar className="w-4 h-4" />
                        {new Date().toLocaleDateString()}
                        <span className="mx-2">•</span>
                        <User className="w-4 h-4" />
                        {formData.author || 'Author Name'}
                    </div>

                    <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
                        {language === 'en' ? (formData.titleEn || 'Blog Title') : (formData.titleAr || 'عنوان المدونة')}
                    </h1>

                    <p className="text-xl text-gray-600 leading-relaxed">
                        {language === 'en' ? (formData.descriptionEn || 'Blog description will appear here...') : (formData.descriptionAr || 'وصف المدونة سيظهر هنا...')}
                    </p>

                    {/* Tags */}
                    {formData.tags && formData.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-4">
                            {formData.tags.map((tag, index) => (
                                <Badge key={index} variant="secondary" className="text-sm">
                                    {language === 'en' ? tag.nameEn || 'Tag' : tag.nameAr || 'علامة'}
                                </Badge>
                            ))}
                        </div>
                    )}
                </div>

                {/* Main Image */}
                <div className="mb-8">
                    <div className="w-full h-64 relative bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg overflow-hidden">
                        {mainImageUrl ? (
                            <img
                                src={mainImageUrl}
                                alt={formData.altText?.[language] || 'Main image'}
                                className="w-full h-full object-cover object-center"
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.style.display = 'none';
                                }}
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <div className="text-white text-center">
                                    <div className="w-16 h-16 mx-auto mb-2 bg-white/20 rounded-lg flex items-center justify-center">
                                        <Eye className="w-8 h-8" />
                                    </div>
                                    <p className="text-sm opacity-90">Main Image Preview</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Main Content */}
                <div className="prose prose-lg max-w-none mb-12">
                    <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {language === 'en'
                            ? (formData.contentEn || 'Your blog content will appear here. Start typing in the form to see the preview update in real-time.')
                            : (formData.contentAr || 'محتوى المدونة سيظهر هنا. ابدأ بالكتابة في النموذج لترى المعاينة تتحدث في الوقت الفعلي.')
                        }
                    </div>
                </div>

                {/* Sections */}
                {formData.section && formData.section.length > 0 && (
                    <div className="space-y-12">
                        <h2 className="text-2xl font-bold text-gray-900 border-b pb-2">
                            {language === 'en' ? 'Sections' : 'الأقسام'}
                        </h2>
                        {formData.section.map((section, index) => {
                            const sectionImageUrl = getImageUrl(section.image);

                            return (
                                <div key={index} className="border-l-4 border-blue-500 pl-6">
                                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                                        {language === 'en'
                                            ? (section.titleEn || `Section ${index + 1}`)
                                            : (section.titleAr || `القسم ${index + 1}`)
                                        }
                                    </h3>

                                    {/* Section Image */}
                                    <div className="w-full h-48 relative bg-gradient-to-br from-green-400 to-blue-500 rounded-lg mb-4 overflow-hidden">
                                        {sectionImageUrl ? (
                                            <img
                                                src={sectionImageUrl}
                                                alt={section.alt?.[language] || 'Section image'}
                                                className="w-full h-full object-cover object-center"
                                                onError={(e) => {
                                                    const target = e.target as HTMLImageElement;
                                                    target.style.display = 'none';
                                                }}
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <div className="text-white text-center">
                                                    <div className="w-12 h-12 mx-auto mb-2 bg-white/20 rounded-lg flex items-center justify-center">
                                                        <Eye className="w-6 h-6" />
                                                    </div>
                                                    <p className="text-sm opacity-90">
                                                        {section.alt?.[language] || 'Section Image'}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <p className="text-gray-700 leading-relaxed">
                                        {language === 'en'
                                            ? (section.descriptionEn || 'Section description will appear here...')
                                            : (section.descriptionAr || 'وصف القسم سيظهر هنا...')
                                        }
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

export default function EditBlogPage() {
    const router = useRouter();
    const params = useParams();
    const blogId = params.blogId as string;

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [blogData, setBlogData] = useState<BlogFormValues | null>(null);
    const [previewLanguage, setPreviewLanguage] = useState<'en' | 'ar'>('en');
    const [formData, setFormData] = useState<BlogFormValues>({
        titleAr: "",
        titleEn: "",
        descriptionAr: "",
        descriptionEn: "",
        contentAr: "",
        contentEn: "",
        author: "",
        categories: [],
        altText: { en: "", ar: "" },
        section: [],
        tags: [],
        seo: [],
    });

    useEffect(() => {
        const fetchBlogData = async () => {
            try {
                console.log("Fetching blog data for ID:", blogId);
                const response = await axios.get(`https://backend.abwabdigital.com/api/v1/blogs/all/${blogId}`);
                const data = response.data.data;
                console.log("Fetched blog data:", data);

                // Map fetched data to BlogFormValues based on the actual API response structure
                const mappedData: BlogFormValues = {
                    titleAr: data.ar?.title || "",
                    titleEn: data.en?.title || "",
                    descriptionAr: data.ar?.description || "",
                    descriptionEn: data.en?.description || "",
                    contentAr: data.ar?.content || "",
                    contentEn: data.en?.content || "",
                    author: data.ar?.author || data.en?.author || "",
                    categories: data.ar?.categories || data.en?.categories || [],
                    image: data.ar?.image?.url || data.en?.image?.url || undefined,
                    altText: { 
                        en: data.en?.image?.altText || "", 
                        ar: data.ar?.image?.altText || "" 
                    },
                    section: (data.ar?.section || []).map((s: any, index: number) => {
                        console.log(`Processing section ${index}:`, s);
                        return {
                            titleAr: s.title || "",
                            titleEn: data.en?.section?.[index]?.title || "",
                            descriptionAr: s.description || "",
                            descriptionEn: data.en?.section?.[index]?.description || "",
                            alt: { 
                                en: data.en?.section?.[index]?.image?.altText || s.image?.altText || "", 
                                ar: s.image?.altText || data.en?.section?.[index]?.image?.altText || "" 
                            },
                            image: s.image?.url || data.en?.section?.[index]?.image?.url || undefined,
                        };
                    }),
                    tags: (data.ar?.tags || []).map((t: any, index: number) => ({
                        nameAr: t.name || "",
                        nameEn: data.en?.tags?.[index]?.name || "",
                        icon: t.icon || data.en?.tags?.[index]?.icon || undefined,
                    })),
                    seo: [
                        ...(data.ar?.seo ? [{
                            language: "ar",
                            metaTitle: data.ar.seo.metaTitle || "",
                            metaDescription: data.ar.seo.metaDescription || "",
                            keywords: data.ar.seo.keywords || "",
                            canonicalTag: data.ar.seo.canonicalTag || "",
                            structuredData: data.ar.seo.structuredData || {
                                "@context": "https://schema.org",
                                "@type": "Service",
                                name: data.ar.seo.metaTitle || "",
                                description: data.ar.seo.metaDescription || "",
                                provider: {
                                    "@type": "Organization",
                                    name: "Your Company",
                                    url: data.ar.seo.canonicalTag || "",
                                },
                            },
                        }] : []),
                        ...(data.en?.seo ? [{
                            language: "en",
                            metaTitle: data.en.seo.metaTitle || "",
                            metaDescription: data.en.seo.metaDescription || "",
                            keywords: data.en.seo.keywords || "",
                            canonicalTag: data.en.seo.canonicalTag || "",
                            structuredData: data.en.seo.structuredData || {
                                "@context": "https://schema.org",
                                "@type": "Service",
                                name: data.en.seo.metaTitle || "",
                                description: data.en.seo.metaDescription || "",
                                provider: {
                                    "@type": "Organization",
                                    name: "Your Company",
                                    url: data.en.seo.canonicalTag || "",
                                },
                            },
                        }] : []),
                    ],
                };
                
                console.log("Mapped data sections:", mappedData.section);
                setBlogData(mappedData);
                setFormData(mappedData); // Initialize formData with fetched data for preview
            } catch (error) {
                console.error("Error fetching blog data:", error);
                toast.error("Failed to load blog data.");
            }
        };

        if (blogId) {
            fetchBlogData();
        }
    }, [blogId]);

    const updateBlog = async (formData: FormData) => {
        try {
            await axios.put(`https://backend.abwabdigital.com/api/v1/blogs/blogs/${blogId}`, formData, {
                headers: { "Content-Type": "multipart/form-data", 
                   
                }
            });
            toast.success("Blog updated successfully");
            router.push("/dashboard/blogs");
        } catch (error: unknown) {
            const message = axios.isAxiosError(error)
                ? error.response?.data?.data || error.message
                : "Failed to update blog";
            toast.error(message);
            throw error;
        }
    };

    const handleSubmit = async (data: BlogFormValues) => {
        try {
            setIsSubmitting(true);
            const formDataToSubmit = new FormData();

            // Basic fields - following the API structure from the user's requirements
            formDataToSubmit.append("titleAr", data.titleAr);
            formDataToSubmit.append("titleEn", data.titleEn);
            formDataToSubmit.append("descriptionAr", data.descriptionAr);
            formDataToSubmit.append("descriptionEn", data.descriptionEn);
            formDataToSubmit.append("contentAr", data.contentAr);
            formDataToSubmit.append("contentEn", data.contentEn);
            formDataToSubmit.append("author", data.author);
            formDataToSubmit.append("categories", data.categories[0] || 'Digital Marketing Services');

            // Handle main image
            if (data.image instanceof File) {
                formDataToSubmit.append("image", data.image);
            }

            // Handle alt text
            formDataToSubmit.append("altText", JSON.stringify(data.altText || { en: "", ar: "" }));

            // Handle sections
            const validSections = data.section?.filter(s =>
                s.titleAr?.trim() || s.titleEn?.trim() || s.descriptionAr?.trim() || s.descriptionEn?.trim()
            );

            if (validSections?.length) {
                for (let index = 0; index < validSections.length; index++) {
                    const section = validSections[index];
                    if (section.image instanceof File) {
                        formDataToSubmit.append(`sectionImage[${index}]`, section.image);
                    }
                }

                validSections.forEach((section, index) => {
                    formDataToSubmit.append(`section[${index}]titleAr`, section.titleAr);
                    formDataToSubmit.append(`section[${index}]titleEn`, section.titleEn);
                    formDataToSubmit.append(`section[${index}]descriptionAr`, section.descriptionAr);
                    formDataToSubmit.append(`section[${index}]descriptionEn`, section.descriptionEn);
                    formDataToSubmit.append(`section[${index}]alt`, JSON.stringify(section.alt || { en: "", ar: "" }));
                });
            }

            const validTags = data.tags?.filter(tag => tag.nameAr?.trim() || tag.nameEn?.trim());

            if (validTags?.length) {
                for (let index = 0; index < validTags.length; index++) {
                    const tag = validTags[index];
                    if (tag.icon instanceof File) {
                        formDataToSubmit.append(`tagIcons[${index}]`, tag.icon);
                    }
                }

                validTags.forEach((tag, index) => {
                    formDataToSubmit.append(`tagnameAr`, tag.nameAr);
                    formDataToSubmit.append(`tagnameEn`, tag.nameEn);
                });
            }

            if (data.seo?.length) {
                const completeSeoData = data.seo.map(seoItem => ({
                    language: seoItem.language || "en",
                    metaTitle: seoItem.metaTitle || "",
                    metaDescription: seoItem.metaDescription || "",
                    keywords: seoItem.keywords || "",
                    canonicalTag: seoItem.canonicalTag || "",
                    structuredData: seoItem.structuredData || {
                        "@context": "https://schema.org",
                        "@type": "Service",
                        name: seoItem.metaTitle || "",
                        description: seoItem.metaDescription || "",
                        provider: {
                            "@type": "Organization",
                            name: "Your Company",
                            url: seoItem.canonicalTag || "",
                        },
                    },
                }));

                formDataToSubmit.append("seo", JSON.stringify(completeSeoData));
            }

            await updateBlog(formDataToSubmit);
        } catch (error: any) {
            console.error("Submit error:", error);
            // Don't clear form data on error - keep user's changes
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleFormDataChange = (data: BlogFormValues) => {
        setFormData(data);
    };

    if (!blogData) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="w-8 h-8 animate-spin" />
                <p className="ml-2">Loading blog data...</p>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen">
            {/* Left Side - Form */}
            <div className="w-[70%] h-full border-r bg-gray-50">
                <div className="p-6 space-y-3">
                    <header className="sticky top-0 bg-gray-50 pb-4 border-b">
                        <h1 className="flex items-center gap-2 text-2xl font-bold">
                            Edit Blog
                        </h1>
                        <p className="text-sm text-muted-foreground mt-2">
                            Edit the blog post details. See live preview on the right.
                        </p>
                    </header>

                    <BlogForm
                        onSubmit={handleSubmit}
                        isSubmitting={isSubmitting}
                        mode="edit"
                        onCancel={() => {
                            router.push("/dashboard/blogs");
                        }}
                        initialData={blogData}
                        onChange={handleFormDataChange}
                    />
                </div>
            </div>

            {/* Right Side - Preview */}
            <div className="w-1/3 h-full">
                <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between z-10">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                        <Eye className="w-5 h-5" />
                        Live Preview
                    </h2>
                    <div className="flex gap-2">
                        <Button
                            variant={previewLanguage === 'en' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setPreviewLanguage('en')}
                        >
                            English
                        </Button>
                        <Button
                            variant={previewLanguage === 'ar' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setPreviewLanguage('ar')}
                        >
                            العربية
                        </Button>
                    </div>
                </div>

                <BlogPreview formData={formData} language={previewLanguage} />
            </div>
        </div>
    );
}

