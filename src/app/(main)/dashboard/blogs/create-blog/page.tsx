"use client";
/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable security/detect-object-injection */
/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable complexity */
/* eslint-disable max-lines */

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Sparkles, Eye, Edit, Calendar, User } from "lucide-react";
import { BlogForm, BlogFormValues } from "@/modules/blogs/modals/blog-form";
import axios from 'axios';
import useGetBlogs from '@/modules/main/hooks/use-get-blogs';
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";

interface CreateBlogModalProps {
    onConfirm: (data: FormData) => Promise<void>;
    refetch?: () => void;
}

interface AIBlogData {
    titleAr: string;
    titleEn: string;
    descriptionAr: string;
    descriptionEn: string;
    contentAr: string;
    contentEn: string;
    author: string;
    categories: string[];
    sections?: Array<{
        titleAr: string;
        titleEn: string;
        descriptionAr: string;
        descriptionEn: string;
        alt: { en: string; ar: string };
    }>;
    section?: Array<{
        titleAr: string;
        titleEn: string;
        descriptionAr: string;
        descriptionEn: string;
        alt: { en: string; ar: string };
    }>;
    tags?: Array<{
        nameAr: string;
        nameEn: string;
    }>;
    altText: { en: string; ar: string };
    seo?: Array<{
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
    }>;
}

// Blog Preview Component
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
        }
        return null;
    };

    // Clean up object URLs when component unmounts or image changes
    const [imageUrls, setImageUrls] = useState<string[]>([]);

    useEffect(() => {
        // Clean up old URLs
        return () => {
            imageUrls.forEach(url => {
                try {
                    URL.revokeObjectURL(url);
                } catch (error) {
                    console.warn('Failed to revoke object URL:', error);
                }
            });
        };
    }, [imageUrls]);

    // Get main image URL
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
                                    // If image fails to load, show placeholder
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

export default function CreateBlogPage() {
    const { refetch } = useGetBlogs();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [isAnalyzingSections, setIsAnalyzingSections] = useState(false);
    const [showAIInput, setShowAIInput] = useState(false);
    const [showSectionsAIInput, setShowSectionsAIInput] = useState(false);
    const [aiContent, setAiContent] = useState("");
    const [sectionsAiContent, setSectionsAiContent] = useState("");
    const [aiGeneratedData, setAiGeneratedData] = useState<AIBlogData | null>(null);
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

    // Reset function to clear all state
    const resetForm = () => {
        setFormData({
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
        setShowAIInput(false);
        setShowSectionsAIInput(false);
        setAiContent("");
        setSectionsAiContent("");
        setAiGeneratedData(null);
        setIsAnalyzing(false);
        setIsAnalyzingSections(false);
    };

    const analyzeContentWithAI = async () => {
        if (!aiContent.trim()) {
            toast.error("Please enter content to analyze");
            return;
        }

        setIsAnalyzing(true);
        try {
            const response = await fetch('/api/blog-ai/analyze-content', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ content: aiContent }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to analyze content');
            }

            const data: AIBlogData = await response.json();
            setAiGeneratedData(data);
            setShowAIInput(false);
            toast.success("Content analyzed successfully! Fields have been auto-filled.");
        } catch (error) {
            console.error('AI Analysis Error:', error);
            toast.error(`Failed to analyze content: ${error instanceof Error ? error.message : String(error)}`);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const analyzeSectionsWithAI = async () => {
        if (!sectionsAiContent.trim()) {
            toast.error("Please enter content to analyze for sections");
            return;
        }
      
        setIsAnalyzingSections(true);
        try {
            const response = await fetch('/api/blog-ai/analyze-sections', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ content: sectionsAiContent }),
            });
      
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to analyze sections');
            }
      
            const data = await response.json();
            
            console.log('AI Sections Response:', data); // Debug log
            
            // Update the existing AI generated data with new sections
            if (aiGeneratedData) {
                const updatedData = {
                    ...aiGeneratedData,
                    // Use both 'sections' and 'section' to handle different response formats
                    section: data.section || data.sections || []
                };
                console.log('Updated AI Data:', updatedData); // Debug log
                setAiGeneratedData(updatedData);
            } else {
                // Create new data with just sections
                const newData = {
                    titleAr: "",
                    titleEn: "",
                    descriptionAr: "",
                    descriptionEn: "",
                    contentAr: "",
                    contentEn: "",
                    author: "",
                    categories: [],
                    altText: { en: "", ar: "" },
                    section: data.section || data.sections || []
                };
                console.log('New AI Data:', newData); // Debug log
                setAiGeneratedData(newData);
            }
            
            setShowSectionsAIInput(false);
            toast.success("Sections analyzed successfully! Section fields have been auto-filled.");
        } catch (error) {
            console.error('Sections AI Analysis Error:', error);
            toast.error(`Failed to analyze sections: ${error instanceof Error ? error.message : String(error)}`);
        } finally {
            setIsAnalyzingSections(false);
        }
    };

    const createBlog = async (formData: FormData) => {
        try {
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}blogs`, formData);
            refetch();
        } catch (error: unknown) {

            const message = axios.isAxiosError(error)
                ? error.response?.data?.data || error.message
                : "Failed to create blog";
            toast.error(message);
            throw error;
        }
    };

    const handleSubmit = async (data: BlogFormValues) => {
        try {
            setIsSubmitting(true);
            const formDataToSubmit = new FormData();

            // Basic fields
            formDataToSubmit.append("titleAr", data.titleAr);
            formDataToSubmit.append("titleEn", data.titleEn);
            formDataToSubmit.append("descriptionAr", data.descriptionAr);
            formDataToSubmit.append("descriptionEn", data.descriptionEn);
            formDataToSubmit.append("contentAr", data.contentAr);
            formDataToSubmit.append("contentEn", data.contentEn);
            formDataToSubmit.append("author", data.author);
            formDataToSubmit.append("categories", 'Web & App Development');

            // Handle main image
            if (data.image instanceof File) {
                formDataToSubmit.append("image", data.image);
            } else {
                try {
                    const imageUrl = '/assets/aboutUs/aboutHeader.png';
                    const res = await fetch(imageUrl);
                    const blob = await res.blob();
                    const file = new File([blob], 'aboutHeader.png', { type: blob.type });
                    formDataToSubmit.append("image", file);
                } catch (error) {
                    console.warn("Failed to load default image:", error);
                }
            }

            // Handle alt text
            formDataToSubmit.append("altText", JSON.stringify(data.altText || { en: "", ar: "" }));

            // Handle sections
            const validSections = data.section?.filter(s =>
                s.titleAr?.trim() && s.titleEn?.trim() && s.descriptionAr?.trim() && s.descriptionEn?.trim()
            );

            if (validSections?.length) {
                for (let index = 0; index < validSections.length; index++) {
                    const section = validSections[index];
                    if (section.image instanceof File) {
                        formDataToSubmit.append(`sectionImage[${index}]`, section.image);
                    } else {
                        try {
                            const imageUrl = '/assets/aboutUs/aboutHeader.png';
                            const res = await fetch(imageUrl);
                            const blob = await res.blob();
                            const file = new File([blob], `section-${index}.png`, { type: blob.type });
                            formDataToSubmit.append(`sectionImage[${index}]`, file);
                        } catch (error) {
                            console.warn(`Failed to load default image for section ${index}:`, error);
                        }
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

            const validTags = data.tags?.filter(tag => tag.nameAr?.trim() && tag.nameEn?.trim());

            if (validTags?.length) {
                for (let index = 0; index < validTags.length; index++) {
                    const tag = validTags[index];
                    if (tag.icon instanceof File) {
                        formDataToSubmit.append(`tagIcons[${index}]`, tag.icon);
                    } else {
                        try {
                            const imageUrl = '/assets/aboutUs/aboutHeader.png';
                            const res = await fetch(imageUrl);
                            const blob = await res.blob();
                            const file = new File([blob], `tag-${index}.png`, { type: blob.type });
                            formDataToSubmit.append(`tagIcons[${index}]`, file);
                        } catch (error) {
                            console.warn(`Failed to load default icon for tag ${index}:`, error);
                        }
                    }
                }

                validTags.forEach((tag, index) => {
                    formDataToSubmit.append(`tagnameAr`, tag.nameAr);
                    formDataToSubmit.append(`tagnameEn`, tag.nameEn);
                });
            }

            if (data.seo?.length) {
                const validSeoData = data.seo.filter(seoItem =>
                    seoItem.metaTitle?.trim() || seoItem.metaDescription?.trim() || seoItem.keywords?.trim()
                );

                if (validSeoData.length > 0) {
                    const completeSeoData = validSeoData.map(seoItem => ({
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
            }

            await createBlog(formDataToSubmit);
            refetch();
            toast.success("Blog created successfully");
            resetForm();
            router.push("/dashboard/blogs");
        } catch (error: any) {
            console.error("Submit error:", error);
            toast.error(error?.response?.data?.data || "Failed to create blog");
        } finally {
            setIsSubmitting(false);
        }
    };

    const router = useRouter();

    const handleFormDataChange = (data: BlogFormValues) => {
        if (JSON.stringify(data) !== JSON.stringify(formData)) {
            setFormData(data);
        }
    };

    return (
        <div className="flex min-h-screen">
            {/* Left Side - Form */}
            <div className="w-[70%] h-full border-r bg-gray-50">
                <div className="p-6 space-y-3">
                    <header className="sticky top-0 bg-gray-50 pb-4 border-b">
                        <h1 className="flex items-center gap-2 text-2xl font-bold">
                            Create Blog
                            <div className="ml-auto flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setShowAIInput(!showAIInput)}
                                >
                                    <Sparkles className="w-4 h-4 mr-2" />
                                    AI Auto-Fill Blog
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setShowSectionsAIInput(!showSectionsAIInput)}
                                >
                                    <Sparkles className="w-4 h-4 mr-2" />
                                    AI Auto-Fill Sections
                                </Button>
                            </div>
                        </h1>
                        <p className="text-sm text-muted-foreground mt-2">
                            Create a new blog post with all necessary details. See live preview on the right.
                        </p>
                    </header>

                    {showAIInput && (
                        <div className="space-y-4 p-4 border rounded-lg bg-white shadow-sm">
                            <div>
                                <label className="text-sm font-medium">Content to Analyze</label>
                                <Textarea
                                    placeholder="Paste your blog content here and AI will automatically fill all the fields..."
                                    value={aiContent}
                                    onChange={(e) => setAiContent(e.target.value)}
                                    rows={6}
                                    className="mt-1"
                                />
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    onClick={analyzeContentWithAI}
                                    disabled={isAnalyzing || !aiContent.trim()}
                                    className="flex items-center gap-2"
                                >
                                    {isAnalyzing ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <Sparkles className="w-4 h-4" />
                                    )}
                                    {isAnalyzing ? "Analyzing..." : "Analyze with AI"}
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => setShowAIInput(false)}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    )}

                    {showSectionsAIInput && (
                        <div className="space-y-4 p-4 border rounded-lg bg-blue-50 shadow-sm">
                            <div>
                                <label className="text-sm font-medium">Content to Analyze for Sections</label>
                                <Textarea
                                    placeholder="Paste your content here and AI will automatically create detailed sections..."
                                    value={sectionsAiContent}
                                    onChange={(e) => setSectionsAiContent(e.target.value)}
                                    rows={6}
                                    className="mt-1"
                                />
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    onClick={analyzeSectionsWithAI}
                                    disabled={isAnalyzingSections || !sectionsAiContent.trim()}
                                    className="flex items-center gap-2"
                                >
                                    {isAnalyzingSections ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <Sparkles className="w-4 h-4" />
                                    )}
                                    {isAnalyzingSections ? "Analyzing Sections..." : "Analyze Sections with AI"}
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => setShowSectionsAIInput(false)}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    )}

                    <BlogForm
                        onSubmit={handleSubmit}
                        isSubmitting={isSubmitting}
                        mode="create"
                        onCancel={() => {
                            resetForm();
                            router.push("/dashboard/blogs");
                        }}
                        initialData={aiGeneratedData}
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

