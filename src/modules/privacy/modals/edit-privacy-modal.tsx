/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable security/detect-object-injection */
/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable complexity */
/* eslint-disable max-lines */
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useModal } from "@/hooks/use-modal";
import { RichTextEditor } from "@/components/rich-text-editor";

const privacySchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
});

type PrivacyFormValues = z.infer<typeof privacySchema>;

export function EditPrivacyModal({ data, onConfirm, refetch }: any) {
  const { closeModal } = useModal();

  const form = useForm<PrivacyFormValues>({
    resolver: zodResolver(privacySchema),
    defaultValues: {
      title: data?.title ?? "",
      content: data?.content ?? "",
    },
  });

  const onSubmit = async (formData: PrivacyFormValues) => {
    try {
      await onConfirm?.({ ...formData, id: data?._id });
      refetch?.();
      closeModal();
    } catch (error) {
      console.error("Error updating terms:", error);
    }
  };

  return (
    <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Edit Privacy</DialogTitle>
        <DialogDescription>Update the privacy policy content below.</DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title *</FormLabel>
                <FormControl>
                  <Input placeholder="Enter title" {...field} />
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
                  <RichTextEditor value={field.value} onChange={field.onChange} />
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
