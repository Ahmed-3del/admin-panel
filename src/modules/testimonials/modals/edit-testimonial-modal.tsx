/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable security/detect-object-injection */
/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable complexity */
/* eslint-disable max-lines */
"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useModal } from "@/hooks/use-modal";
import Image from "next/image";

const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

const testimonialSchema = z.object({
  name: z.string().min(1, "Name is required"),
  content: z.string().min(1, "Content is required"),
  rating: z.coerce.number().min(1, "Rating must be at least 1").max(5, "Max rating is 5"),
  icon: z.union([
    z.instanceof(File).refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), {
      message: "Only JPEG, PNG, and WebP images are allowed",
    }),
    z.string().url("Invalid image URL"),
    z.null()
  ]).optional(),
});

type TestimonialFormValues = z.infer<typeof testimonialSchema>;

interface EditTestimonialModalProps {
  data: any;
  onConfirm: (data: any) => Promise<void>;
  refetch?: () => void;
}

export function EditTestimonialModal({ data, onConfirm, refetch }: EditTestimonialModalProps) {
  const { closeModal } = useModal();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [hasNewFile, setHasNewFile] = useState(false);

  const form = useForm<TestimonialFormValues>({
    resolver: zodResolver(testimonialSchema),
    defaultValues: {
      name: data?.name ?? "",
      content: data?.content ?? "",
      rating: data?.rating ?? 1,
      icon: data?.icon ?? null,
    },
  });

  useEffect(() => {
    if (typeof data?.icon === "string" && data.icon) {
      setPreviewUrl(data.icon);
      setHasNewFile(false);
    }
  }, [data]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      form.setError("icon", { type: "manual", message: "Only JPEG, PNG, and WebP images are allowed" });
      return;
    }

    form.clearErrors("icon");
    
    form.setValue("icon", file, { shouldValidate: true });
    setHasNewFile(true);
    
    if (previewUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }
    
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const removeImage = () => {
    form.setValue("icon", null, { shouldValidate: true });
    setHasNewFile(false);
    
    if (previewUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
  };

  const onSubmit = async (formData: TestimonialFormValues) => {
    try {
      const payload = {
        id: data?._id,
        name: formData.name,
        content: formData.content,
        rating: formData.rating,
        ...(hasNewFile && formData.icon instanceof File && { icon: formData.icon }),
        ...(formData.icon === null && { removeIcon: true }),
      };
      
      await onConfirm(payload);
      refetch?.();
      closeModal();
      
      if (previewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    } catch (error) {
      console.error("Error updating testimonial:", error);
    }
  };

  return (
    <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Edit Testimonial</DialogTitle>
        <DialogDescription>Update testimonial details below.</DialogDescription>
      </DialogHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name *</FormLabel>
                <FormControl>
                  <Input placeholder="Enter name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Content *</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter content"
                    {...field}
                    className="min-h-[120px]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="rating"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rating (1–5) *</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={1}
                    max={5}
                    placeholder="Enter rating"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="icon"
            render={() => (
              <FormItem>
                <FormLabel>Icon</FormLabel>
                <FormControl>
                  <div className="space-y-4">
                    <Input
                      type="file"
                      accept={ACCEPTED_IMAGE_TYPES.join(",")}
                      onChange={handleFileChange}
                    />
                    {previewUrl && (
                      <div className="mt-2 space-y-2">
                        <div className="relative w-24 h-24 rounded-md overflow-hidden border">
                          <Image
                            src={previewUrl}
                            alt="Preview"
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={removeImage}
                          >
                            Remove Image
                          </Button>
                          {hasNewFile && (
                            <span className="text-sm text-green-600 flex items-center">
                              New file selected
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <DialogFooter>
            <Button type="button" variant="outline" onClick={closeModal}>
              Cancel
            </Button>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Updating..." : "Update"}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
}