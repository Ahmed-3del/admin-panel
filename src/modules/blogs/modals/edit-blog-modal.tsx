/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable security/detect-object-injection */
/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable complexity */
/* eslint-disable max-lines */
"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useModal } from "@/hooks/use-modal";
import { BlogForm, BlogFormValues } from "@/modules/blogs/modals/blog-form";



export function EditBlogModal({ data, onConfirm, refetch }: any) {
  const { closeModal } = useModal();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [defaultValues, setDefaultValues] = useState<Partial<any>>();

  useEffect(() => {
    if (data) {
      setDefaultValues({
        titleAr: data.titleAr || "",
        titleEn: data.titleEn || "",
        descriptionAr: data.descriptionAr || "",
        descriptionEn: data.descriptionEn || "",
        contentAr: data.contentAr || "",
        contentEn: data.contentEn || "",
        author: data.author,
        categories: data.categories,
        image: data.image?.url || null,
        altText: data.altText || { en: "", ar: "" },
        section: data.section?.map((s :any) => ({
          titleAr: s.titleAr || "",
          titleEn: s.titleEn || "",
          descriptionAr: s.descriptionAr || "",
          descriptionEn: s.descriptionEn || "",
          alt: s.alt || { en: "", ar: "" },
          image: s.image?.url || null
        })) || [],
        tags: data.tags?.map((t :any) => ({
          nameAr: t.nameAr || "",
          nameEn: t.nameEn || "",
          icon: t.icon || null
        })) || [],
        seo: data.seo ? [{
          language: data.seo.language,
          metaTitle: data.seo.metaTitle,
          metaDescription: data.seo.metaDescription,
          keywords: data.seo.keywords,
          canonicalTag: data.seo.canonicalTag,
          structuredData: data.seo.structuredData
        }] : [{
          language: "en",
          metaTitle: "",
          metaDescription: "",
          keywords: "",
          canonicalTag: "",
          structuredData: {
            "@context": "https://schema.org",
            "@type": "Service",
            name: "",
            description: "",
            provider: {
              "@type": "Organization",
              name: "Your Company",
              url: "https://yourwebsite.com",
            },
          },
        }]
      });
    }
  }, [data]);

  const handleSubmit = async (formData: BlogFormValues) => {
    try {
      setIsSubmitting(true);
      const dataToSubmit = new FormData();

      dataToSubmit.append("titleAr", formData.titleAr);
      dataToSubmit.append("titleEn", formData.titleEn);
      dataToSubmit.append("descriptionAr", formData.descriptionAr);
      dataToSubmit.append("descriptionEn", formData.descriptionEn);
      dataToSubmit.append("contentAr", formData.contentAr);
      dataToSubmit.append("contentEn", formData.contentEn);
      dataToSubmit.append("author", formData.author);
      dataToSubmit.append("categories", formData.categories.join(","));

      if (formData.image instanceof File) {
        dataToSubmit.append("image", formData.image);
      }
      dataToSubmit.append("altText", JSON.stringify(formData.altText));

      const validSections = formData.section?.filter((s :any) => s.titleAr.trim() && s.titleEn.trim() && s.descriptionAr.trim() && s.descriptionEn.trim());
      
      if (validSections?.length) {
        validSections.forEach((section :any, index:any) => {
          if (section.image instanceof File) {
            dataToSubmit.append(`sectionImage[${index}]`, section.image);
          }
          dataToSubmit.append(`section[${index}]titleAr`, section.titleAr);
          dataToSubmit.append(`section[${index}]titleEn`, section.titleEn);
          dataToSubmit.append(`section[${index}]descriptionAr`, section.descriptionAr);
          dataToSubmit.append(`section[${index}]descriptionEn`, section.descriptionEn);
          dataToSubmit.append(`section[${index}]alt`, JSON.stringify(section.alt));
        });
      }

      const validTags = formData.tags?.filter((tag :any) => tag.nameAr.trim() && tag.nameEn.trim());
      
      if (validTags?.length) {
        validTags.forEach((tag :any, index:any) => {
          if (tag.icon instanceof File) {
            dataToSubmit.append(`tagIcons[${index}]`, tag.icon);
          }
          dataToSubmit.append(`tagnameAr[${index}]`, tag.nameAr);
          dataToSubmit.append(`tagnameEn[${index}]`, tag.nameEn);
        });
      }

      if (formData.seo?.[0]) {
        dataToSubmit.append("seo", JSON.stringify(formData.seo[0]));
      }

      await onConfirm({ id: data._id, formData: dataToSubmit });
      refetch?.();
      closeModal();
      toast.success("Blog updated successfully");
    } catch (error :any) {
      // console.error("Error updating blog:", error);
      toast.error(error?.response?.data?.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!defaultValues) {
    return (
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Blog</DialogTitle>
          <DialogDescription>Loading blog data...</DialogDescription>
        </DialogHeader>
      </DialogContent>
    );
  }

  return (
    <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Edit Blog</DialogTitle>
        <DialogDescription>
          Update blog details and content.
        </DialogDescription>
      </DialogHeader>

      <BlogForm 
        onSubmit={handleSubmit} 
        isSubmitting={isSubmitting} 
        mode="edit" 
        onCancel={closeModal} 
      />
    </DialogContent>
  );
}

