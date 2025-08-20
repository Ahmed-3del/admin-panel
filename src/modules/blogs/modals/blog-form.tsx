// blog-form.tsx (Updated version with image previews and fixed sections handling)

/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Plus, Trash2, Upload, X } from "lucide-react";

// Updated comprehensive SEO schema to match backend expectations
const seoSchema = z.object({
  language: z.string().min(1, "Language is required"),
  metaTitle: z.string().min(1, "Meta title is required"),
  metaDescription: z.string().min(1, "Meta description is required"),
  keywords: z.string().min(1, "Keywords are required"),
  canonicalTag: z.string().url("Must be a valid URL").optional(),
  structuredData: z.object({
    "@context": z.string().default("https://schema.org"),
    "@type": z.string().default("Service"),
    name: z.string(),
    description: z.string(),
    provider: z.object({
      "@type": z.string().default("Organization"),
      name: z.string(),
      url: z.string().url().optional(),
    }),
  }).optional(),
});

const blogFormSchema = z.object({
  titleAr: z.string().min(1, "Arabic title is required"),
  titleEn: z.string().min(1, "English title is required"),
  descriptionAr: z.string().min(1, "Arabic description is required"),
  descriptionEn: z.string().min(1, "English description is required"),
  contentAr: z.string().min(1, "Arabic content is required"),
  contentEn: z.string().min(1, "English content is required"),
  author: z.string().min(1, "Author is required"),
  categories: z.array(z.string()).min(1, "At least one category is required"),
  image: z.any().optional(),
  altText: z.object({
    en: z.string().optional(),
    ar: z.string().optional(),
  }),
  section: z.array(z.object({
    titleAr: z.string(),
    titleEn: z.string(),
    descriptionAr: z.string(),
    descriptionEn: z.string(),
    alt: z.object({
      en: z.string().optional(),
      ar: z.string().optional(),
    }),
    image: z.any().optional(),
  })).optional(),
  tags: z.array(z.object({
    nameAr: z.string(),
    nameEn: z.string(),
    icon: z.any().optional(),
  })).optional(),
  seo: z.array(seoSchema).optional(),
});

export type BlogFormValues = z.infer<typeof blogFormSchema>;

interface BlogFormProps {
  onSubmit: (data: BlogFormValues) => Promise<void>;
  isSubmitting: boolean;
  mode: "create" | "edit";
  onCancel: () => void;
  onChange?: (data: BlogFormValues) => void;
  initialData?: any;
}

// Image Preview Component
interface ImagePreviewProps {
  image: any;
  altText?: string;
  onRemove?: () => void;
  className?: string;
}

function ImagePreview({ image, altText, onRemove, className = "w-32 h-32" }: ImagePreviewProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (image instanceof File || image instanceof Blob) {
      try {
        const url = URL.createObjectURL(image);
        setImageUrl(url);
        return () => URL.revokeObjectURL(url);
      } catch (error) {
        console.warn('Failed to create object URL:', error);
      }
    } else if (typeof image === 'string' && image) {
      setImageUrl(image);
    } else {
      setImageUrl(null);
    }
  }, [image]);

  if (!imageUrl) return null;

  return (
    <div className={`relative ${className} border rounded-lg overflow-hidden bg-gray-50`}>
      <img
        src={imageUrl}
        alt={altText || 'Preview'}
        className="w-full h-full object-cover"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
        }}
      />
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </div>
  );
}

export function BlogForm({ onSubmit, isSubmitting, mode, onCancel, initialData, onChange }: BlogFormProps) {
  const form = useForm<BlogFormValues>({
    resolver: zodResolver(blogFormSchema),
    defaultValues: {
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
    },
  });

  useEffect(() => {
    if (initialData) {
      console.log('Initial Data received in BlogForm:', initialData); // Debug log
      
      // Handle sections data - check both 'section' and 'sections' properties
      let sectionsData = [];
      if (initialData.section && Array.isArray(initialData.section)) {
        sectionsData = initialData.section;
      } else if (initialData.sections && Array.isArray(initialData.sections)) {
        sectionsData = initialData.sections;
      }
      
      console.log('Sections data to be set:', sectionsData); // Debug log
      
      const formData = {
        titleAr: initialData.titleAr || "",
        titleEn: initialData.titleEn || "",
        descriptionAr: initialData.descriptionAr || "",
        descriptionEn: initialData.descriptionEn || "",
        contentAr: initialData.contentAr || "",
        contentEn: initialData.contentEn || "",
        author: initialData.author || "",
        categories: Array.isArray(initialData.categories) ? initialData.categories : [],
        image: initialData.image || undefined,
        altText: initialData.altText || { en: "", ar: "" },
        section: sectionsData.map((section: any) => ({
          titleAr: section.titleAr || "",
          titleEn: section.titleEn || "",
          descriptionAr: section.descriptionAr || "",
          descriptionEn: section.descriptionEn || "",
          alt: section.alt || { en: "", ar: "" },
          image: section.image || undefined,
        })),
        tags: Array.isArray(initialData.tags) ? initialData.tags.map((tag: any) => ({
          nameAr: tag.nameAr || "",
          nameEn: tag.nameEn || "",
          icon: tag.icon || undefined,
        })) : [],
        seo: Array.isArray(initialData.seo) ? initialData.seo.map((seoItem: any) => ({
          language: seoItem.language || "en",
          metaTitle: seoItem.metaTitle || "",
          metaDescription: seoItem.metaDescription || "",
          keywords: seoItem.keywords || "",
          canonicalTag: seoItem.canonicalTag || "",
          structuredData: seoItem.structuredData || {
            "@context": "https://schema.org",
            "@type": "Service",
            name: "",
            description: "",
            provider: {
              "@type": "Organization",
              name: "Your Company",
              url: "",
            },
          },
        })) : [],
      };
      
      form.reset(formData);
    } else {
      form.reset({
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
    }
  }, [initialData, form]);

  useEffect(() => {
    if (onChange) {
      const subscription = form.watch((data: any) => onChange(data as BlogFormValues));
      return () => subscription.unsubscribe();
    }
  }, [form, onChange]);

  const { fields: sectionFields, append: appendSection, remove: removeSection } = useFieldArray({
    control: form.control,
    name: "section",
  });

  const { fields: tagFields, append: appendTag, remove: removeTag } = useFieldArray({
    control: form.control,
    name: "tags",
  });

  const { fields: seoFields, append: appendSeo, remove: removeSeo } = useFieldArray({
    control: form.control,
    name: "seo",
  });

  const addSection = () => {
    appendSection({
      titleAr: "",
      titleEn: "",
      descriptionAr: "",
      descriptionEn: "",
      alt: { en: "", ar: "" },
    });
  };

  const addTag = () => {
    appendTag({
      nameAr: "",
      nameEn: "",
    });
  };

  const addSeo = () => {
    appendSeo({
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
          url: "",
        },
      },
    });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const file = event.target.files?.[0];
    if (file) {
      form.setValue(fieldName as any, file);
    }
  };

  const removeImage = (fieldName: string) => {
    form.setValue(fieldName as any, undefined);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 h-full">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="titleAr"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Arabic Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Arabic title" {...field} value={field.value || ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="titleEn"
            render={({ field }) => (
              <FormItem>
                <FormLabel>English Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter English title" {...field} value={field.value || ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="descriptionAr"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Arabic Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Enter Arabic description" {...field} value={field.value || ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="descriptionEn"
            render={({ field }) => (
              <FormItem>
                <FormLabel>English Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Enter English description" {...field} value={field.value || ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="contentAr"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Arabic Content</FormLabel>
                <FormControl>
                  <Textarea rows={6} placeholder="Enter Arabic content" {...field} value={field.value || ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="contentEn"
            render={({ field }) => (
              <FormItem>
                <FormLabel>English Content</FormLabel>
                <FormControl>
                  <Textarea rows={6} placeholder="Enter English content" {...field} value={field.value || ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="author"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Author</FormLabel>
              <FormControl>
                <Input placeholder="Enter author name" {...field} value={field.value || ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Main Image Upload */}
        <div className="space-y-2">
          <FormLabel>Main Image</FormLabel>
          <div className="flex items-center space-x-2">
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e, "image")}
              className="flex-1"
            />
            <Upload className="w-4 h-4" />
          </div>
          {/* Main Image Preview */}
          <ImagePreview
            image={form.watch("image")}
            altText="Main blog image"
            onRemove={() => removeImage("image")}
            className="w-40 h-32"
          />
        </div>

        {/* Alt Text */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="altText.en"
            render={({ field }) => (
              <FormItem>
                <FormLabel>English Alt Text</FormLabel>
                <FormControl>
                  <Input placeholder="Enter English alt text" {...field} value={field.value || ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="altText.ar"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Arabic Alt Text</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Arabic alt text" {...field} value={field.value || ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Sections */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Sections ({sectionFields.length})</h3>
            <Button type="button" variant="outline" size="sm" onClick={addSection}>
              <Plus className="w-4 h-4 mr-2" />
              Add Section
            </Button>
          </div>
          {sectionFields.map((field, index) => (
            <div key={field.id} className="border p-4 rounded-lg space-y-4 bg-blue-50">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">Section {index + 1}</h4>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => removeSection(index)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              {/* Section Image Upload */}
              <div className="space-y-2">
                <FormLabel>Section Image</FormLabel>
                <div className="flex items-center space-x-2">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, `section.${index}.image`)}
                    className="flex-1"
                  />
                  <Upload className="w-4 h-4" />
                </div>
                {/* Section Image Preview */}
                <ImagePreview
                  image={form.watch(`section.${index}.image`)}
                  altText={`Section ${index + 1} image`}
                  onRemove={() => removeImage(`section.${index}.image`)}
                  className="w-32 h-24"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name={`section.${index}.titleAr`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Arabic Section Title</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value || ""} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`section.${index}.titleEn`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>English Section Title</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value || ""} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name={`section.${index}.descriptionAr`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Arabic Section Description</FormLabel>
                      <FormControl>
                        <Textarea {...field} value={field.value || ""} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`section.${index}.descriptionEn`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>English Section Description</FormLabel>
                      <FormControl>
                        <Textarea {...field} value={field.value || ""} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name={`section.${index}.alt.en`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>English Section Alt Text</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value || ""} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`section.${index}.alt.ar`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Arabic Section Alt Text</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value || ""} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Tags */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Tags</h3>
            <Button type="button" variant="outline" size="sm" onClick={addTag}>
              <Plus className="w-4 h-4 mr-2" />
              Add Tag
            </Button>
          </div>
          {tagFields.map((field, index) => (
            <div key={field.id} className="border p-4 rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-medium">Tag {index + 1}</h4>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => removeTag(index)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              {/* Tag Icon Upload */}
              <div className="space-y-2 mb-4">
                <FormLabel>Tag Icon</FormLabel>
                <div className="flex items-center space-x-2">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, `tags.${index}.icon`)}
                    className="flex-1"
                  />
                  <Upload className="w-4 h-4" />
                </div>
                {/* Tag Icon Preview */}
                <ImagePreview
                  image={form.watch(`tags.${index}.icon`)}
                  altText={`Tag ${index + 1} icon`}
                  onRemove={() => removeImage(`tags.${index}.icon`)}
                  className="w-16 h-16"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name={`tags.${index}.nameAr`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Arabic Tag Name</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value || ""} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`tags.${index}.nameEn`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>English Tag Name</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value || ""} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Comprehensive SEO */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">SEO Metadata</h3>
            <Button type="button" variant="outline" size="sm" onClick={addSeo}>
              <Plus className="w-4 h-4 mr-2" />
              Add SEO Field
            </Button>
          </div>
          {seoFields.map((field, index) => (
            <div key={field.id} className="border p-4 rounded-lg space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">SEO Field {index + 1}</h4>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => removeSeo(index)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name={`seo.${index}.language`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Language</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., en, ar" {...field} value={field.value || ""} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`seo.${index}.metaTitle`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Meta Title</FormLabel>
                      <FormControl>
                        <Input placeholder="SEO friendly title" {...field} value={field.value || ""} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name={`seo.${index}.metaDescription`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Meta Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Concise meta description" {...field} value={field.value || ""} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name={`seo.${index}.keywords`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Keywords</FormLabel>
                      <FormControl>
                        <Input placeholder="comma, separated, keywords" {...field} value={field.value || ""} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`seo.${index}.canonicalTag`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Canonical URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://yourwebsite.com/page" {...field} value={field.value || ""} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              {/* Structured Data */}
              <div className="space-y-4 border-t pt-4">
                <h5 className="font-medium">Structured Data</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name={`seo.${index}.structuredData.name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Service Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Service name" {...field} value={field.value || ""} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`seo.${index}.structuredData.provider.name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Provider Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your Company" {...field} value={field.value || ""} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name={`seo.${index}.structuredData.description`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Service Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Service description for structured data" {...field} value={field.value || ""} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`seo.${index}.structuredData.provider.url`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Provider URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://yourwebsite.com" {...field} value={field.value || ""} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting} onClick={() => {
            onSubmit(form.getValues())
          }}>
            {isSubmitting ? "Submitting..." : mode === "create" ? "Create Blog" : "Update Blog"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

