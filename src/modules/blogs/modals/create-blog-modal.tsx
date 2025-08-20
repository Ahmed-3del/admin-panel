// create-blog-modal.tsx (Updated version with proper FormData construction)

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable security/detect-object-injection */
/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable complexity */
/* eslint-disable max-lines */
"use client";

import { useState } from "react";
import { toast } from "sonner";
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Sparkles } from "lucide-react";
import { useModal } from "@/hooks/use-modal";
import { BlogForm, BlogFormValues } from "@/modules/blogs/modals/blog-form";

interface CreateBlogModalProps {
  onConfirm: (data: FormData) => Promise<void>;
  refetch?: () => void;
}

// Updated interface to match comprehensive AI response structure
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

export function CreateBlogModal({ onConfirm, refetch }: CreateBlogModalProps) {
  const { closeModal } = useModal();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isAnalyzingSections, setIsAnalyzingSections] = useState(false);
  const [showAIInput, setShowAIInput] = useState(false);
  const [showSectionsAIInput, setShowSectionsAIInput] = useState(false);
  const [aiContent, setAiContent] = useState("");
  const [sectionsAiContent, setSectionsAiContent] = useState("");
  const [aiGeneratedData, setAiGeneratedData] = useState<AIBlogData | null>(null);

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
      
      // Update the existing AI generated data with new sections
      if (aiGeneratedData) {
        setAiGeneratedData({
          ...aiGeneratedData,
          sections: data.sections
        });
      } else {
        // Create new data with just sections
        setAiGeneratedData({
          titleAr: "",
          titleEn: "",
          descriptionAr: "",
          descriptionEn: "",
          contentAr: "",
          contentEn: "",
          author: "",
          categories: [],
          altText: { en: "", ar: "" },
          sections: data.sections
        });
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

  const handleSubmit = async (data: BlogFormValues) => {
    try {
      setIsSubmitting(true);
      const formData = new FormData();

      // Basic fields
      formData.append("titleAr", data.titleAr);
      formData.append("titleEn", data.titleEn);
      formData.append("descriptionAr", data.descriptionAr);
      formData.append("descriptionEn", data.descriptionEn);
      formData.append("contentAr", data.contentAr);
      formData.append("contentEn", data.contentEn);
      formData.append("author", data.author);
      formData.append("categories", 'Web & App Development');
      
      // Handle main image
      if (data.image instanceof File) {
        formData.append("image", data.image);
      } else {
        // Fallback to default image if no image is uploaded
        try {
          const imageUrl = '/assets/aboutUs/aboutHeader.png';
          const res = await fetch(imageUrl);
          const blob = await res.blob();
          const file = new File([blob], 'aboutHeader.png', { type: blob.type });
          formData.append("image", file);
        } catch (error) {
          console.warn("Failed to load default image:", error);
        }
      }
      
      // Handle alt text
      formData.append("altText", JSON.stringify(data.altText || { en: "", ar: "" }));

      // Handle sections with proper validation and image handling
      const validSections = data.section?.filter(s => 
        s.titleAr?.trim() && s.titleEn?.trim() && s.descriptionAr?.trim() && s.descriptionEn?.trim()
      );

      if (validSections?.length) {
        // Handle section images - append each image with correct index
        for (let index = 0; index < validSections.length; index++) {
          const section = validSections[index];
          if (section.image instanceof File) {
            formData.append(`sectionImage[${index}]`, section.image);
          } else {
            // Fallback to default image for sections
            try {
              const imageUrl = '/assets/aboutUs/aboutHeader.png';
              const res = await fetch(imageUrl);
              const blob = await res.blob();
              const file = new File([blob], `section-${index}.png`, { type: blob.type });
              formData.append(`sectionImage[${index}]`, file);
            } catch (error) {
              console.warn(`Failed to load default image for section ${index}:`, error);
            }
          }
        }

        // Handle section data
        validSections.forEach((section, index) => {
          formData.append(`section[${index}]titleAr`, section.titleAr);
          formData.append(`section[${index}]titleEn`, section.titleEn);
          formData.append(`section[${index}]descriptionAr`, section.descriptionAr);
          formData.append(`section[${index}]descriptionEn`, section.descriptionEn);
          formData.append(`section[${index}]alt`, JSON.stringify(section.alt || { en: "", ar: "" }));
        });
      }

      // Handle tags with proper validation and icon handling
      const validTags = data.tags?.filter(tag => tag.nameAr?.trim() && tag.nameEn?.trim());
      
      if (validTags?.length) {
        // Handle tag icons - append each icon with correct index
        for (let index = 0; index < validTags.length; index++) {
          const tag = validTags[index];
          if (tag.icon instanceof File) {
            formData.append(`tagIcons[${index}]`, tag.icon);
          } else {
            // Fallback to default icon for tags
            try {
              const imageUrl = '/assets/aboutUs/aboutHeader.png';
              const res = await fetch(imageUrl);
              const blob = await res.blob();
              const file = new File([blob], `tag-${index}.png`, { type: blob.type });
              formData.append(`tagIcons[${index}]`, file);
            } catch (error) {
              console.warn(`Failed to load default icon for tag ${index}:`, error);
            }
          }
        }

        // Handle tag data
        validTags.forEach((tag, index) => {
          formData.append(`tagnameAr[${index}]`, tag.nameAr);
          formData.append(`tagnameEn[${index}]`, tag.nameEn);
        });
      }

      // Handle comprehensive SEO data
      if (data.seo?.length) {
        const validSeoData = data.seo.filter(seoItem => 
          seoItem.metaTitle?.trim() || seoItem.metaDescription?.trim() || seoItem.keywords?.trim()
        );
        
        if (validSeoData.length > 0) {
          // Ensure all required fields are present for each SEO item
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
          
          formData.append("seo", JSON.stringify(completeSeoData));
        }
      }

      // Debug: Log FormData contents
      console.log("FormData contents:");
      for (const [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(`${key}: File(${value.name}, ${value.size} bytes)`);
        } else {
          console.log(`${key}: ${value}`);
        }
      }

      await onConfirm(formData);
      refetch?.();
      closeModal();
      toast.success("Blog created successfully");
    } catch (error: any) {
      console.error("Submit error:", error);
      toast.error(error?.response?.data?.message || error.message || "Failed to create blog");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
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
        </DialogTitle>
        <DialogDescription>
          Create a new blog post with all necessary details. Use AI to automatically fill fields from your content.
        </DialogDescription>
      </DialogHeader>

      {showAIInput && (
        <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
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
        <div className="space-y-4 p-4 border rounded-lg bg-blue-50">
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
        onCancel={closeModal}
        initialData={aiGeneratedData}
      />
    </DialogContent>
  );
}

