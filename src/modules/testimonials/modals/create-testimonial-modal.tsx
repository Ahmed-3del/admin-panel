/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable security/detect-object-injection */
/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable complexity */
/* eslint-disable max-lines */
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {  z } from "zod";
import { Button } from "@/components/ui/button";
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
import { useModal } from "@/hooks/use-modal";
import Image from "next/image";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "sonner";

const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  content: z.string().min(1, "Content is required"),
  rating: z.coerce.number().min(1).max(5),
  icon: z
    .instanceof(File)
    .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), {
      message: "Only JPEG, PNG, and WebP images are allowed",
    }),
});

type FormValues = z.infer<typeof formSchema>;

interface CreateTestimonialModalProps {
  onConfirm: (data: FormValues) => Promise<void>;
  refetch?: () => void;
}

export function CreateTestimonialModal({ onConfirm, refetch }: CreateTestimonialModalProps) {
  const { closeModal } = useModal();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      content: "",
      rating: 1,
    },
    mode: "onChange"
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      form.setError("icon", { 
        type: "manual",
        message: "Only JPEG, PNG, and WebP images are allowed"
      });
      return;
    }

    form.clearErrors("icon");
    
    form.setValue("icon", file, { shouldValidate: true });
    
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(URL.createObjectURL(file));
  };

  const removeImage = () => {
    form.setValue("icon", undefined as any, { shouldValidate: true });
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  const onSubmit = async (data: FormValues) => {
    try {
      await onConfirm(data);
      toast.success("Testimonial created successfully");
      refetch?.();
      closeModal();
      
      form.reset();
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
    } catch (error) {
      toast.error("Failed to create testimonial");
      console.error("Submission error:", error);
    }
  };

  return (
     <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Create Testimonial</DialogTitle>
        <DialogDescription>
          Add a new testimonial with name, content, rating, and icon.
        </DialogDescription>
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
                <FormLabel>Icon *</FormLabel>
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
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={removeImage}
                        >
                          Remove Image
                        </Button>
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
            <Button 
              type="submit" 
              disabled={form.formState.isSubmitting || !form.formState.isValid}
            >
              {form.formState.isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
}