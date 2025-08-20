/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { AwaitedReactNode, JSXElementConstructor, ReactElement, ReactNode } from "react"
import Image from "next/image"
import axios, { AxiosError } from "axios"
import { toast } from "sonner"
import { DataTable } from "@/components/data-table/data-table"
import { TableActions } from "@/components/data-table/table-actions"
import { useModal } from "@/hooks/use-modal"
import useTestimonials from "@/modules/main/hooks/use-testimonial"
import { useTranslation } from "react-i18next"

export default function TestimonialsPage() {
  const { testimonials, isLoading, refetch } = useTestimonials()
  const { openModal } = useModal()
  const { t } = useTranslation()
  const createTestimonial = async (data: any) => {
    try {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('content', data.content);
      formData.append('rating', String(data.rating));

      // Ensure icon is a File object
      if (data.icon instanceof File) {
        formData.append('icon', data.icon);
      } else {
        throw new Error('Icon must be a valid file');
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}testimonial`,
        formData,
        {
          headers: {
            // Remove Content-Type header to let browser set it automatically with boundary
            // "Content-Type": "multipart/form-data" will be set automatically
          },
        }
      );

      if (response.status !== 201) {
        throw new Error(`Failed to create Testimonial: ${response.statusText}`);
      }

      toast.success("Testimonial created successfully!");
      refetch();
    } catch (error) {
      console.error('Create testimonial error:', error);
      toast.error(
        error instanceof AxiosError
          ? (error?.response?.data?.message || "Failed to create Testimonial. Please try again.")
          : error instanceof Error
            ? error.message
            : "Failed to create Testimonial. Please try again."
      );
    }
  };

  const updateTestimonials = async (data: any) => {
    try {
      let requestData: any;
      let headers: any = {};

      // Check if there's a new file to upload
      if (data.icon instanceof File) {
        // Create FormData for file upload
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('content', data.content);
        formData.append('rating', String(data.rating));
        formData.append('icon', data.icon);

        requestData = formData;
        // Don't set Content-Type header, let browser handle it for FormData
      } else {
        // Regular JSON update (no new file)
        requestData = {
          name: data.name,
          content: data.content,
          rating: data.rating,
          ...(data.removeIcon && { removeIcon: true }),
        };
        headers["Content-Type"] = "application/json";
      }

      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}testimonial/${data.id}`,
        requestData,
        { headers }
      );

      if (response.status !== 200) {
        throw new Error(`Failed to update Testimonial: ${response.statusText}`);
      }

      toast.success("Testimonial updated successfully!");
      refetch();
    } catch (error) {
      console.error('Update testimonial error:', error);
      toast.error(
        error instanceof AxiosError
          ? (error?.response?.data?.message || "Failed to update Testimonial. Please try again.")
          : "Failed to update Testimonial. Please try again."
      );
    }
  };

  const deleteTestimonials = async (id: string) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}testimonial/${id}`);
      toast.success("Testimonial deleted successfully");
      refetch();
    } catch (error) {
      console.error('Delete testimonial error:', error);
      toast.error("Failed to delete testimonial. Please try again.");
    }
  };

  const columns: any = [
    {
      key: "name",
      label: t("testimonials.name"),
      searchable: true,
      render: (value: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | Promise<AwaitedReactNode> | null | undefined) => (
        <div className="text-sm text-muted-foreground truncate max-w-[200px]" title={value !== undefined && value !== null ? String(value) : ""}>
          {value}
        </div>
      ),
    },
    {
      key: "content",
      label: t("testimonials.content"),
      searchable: true,
      render: (
        value: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | Promise<AwaitedReactNode> | null | undefined
      ) => {
        const stringOrSafeHtml = typeof value === "string" ? value : undefined;
        return (
          <div
            className="text-sm text-muted-foreground truncate max-w-[200px]"
            title={value !== undefined && value !== null ? String(value) : undefined}
            {...(stringOrSafeHtml !== undefined
              ? { dangerouslySetInnerHTML: { __html: stringOrSafeHtml } }
              : { children: value !== undefined && value !== null ? String(value) : null })}
          />
        );
      },
    },
    {
      key: "rating",
      label: t("testimonials.rating"),
      searchable: true,
      render: (value: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | Promise<AwaitedReactNode> | null | undefined) => (
        <div className="text-sm text-muted-foreground truncate max-w-[200px]" title={value !== undefined && value !== null ? String(value) : ""}>
          {value}
        </div>
      ),
    },
    {
      key: "icon",
      label: t("testimonials.icon"),
      searchable: true,
      render: (
        value: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | Promise<AwaitedReactNode> | null | undefined,
        row: any
      ) => {
        const src = typeof value === 'string' ? value : undefined;

        return (
          <div className="text-sm text-muted-foreground truncate max-w-[200px]" title={value !== undefined && value !== null ? String(value) : ""}>
            {src ? (
              <Image src={src} alt={row?.name ?? 'client icon'} width={60} height={60} className="object-contain" />
            ) : (
              <span>No icon</span>
            )}
          </div>
        );
      },
    },
    {
      key: "actions",
      label: t("testimonials.actions"),
      render: (_: any, row: any) => (
        <TableActions
          onEdit={() =>
            openModal("editTestimonial", {
              data: row,
              onConfirm: updateTestimonials,
              refetch,
            })
          }
          onDelete={() =>
            openModal("deleteTestimonial", {
              data: row,
              onConfirm: deleteTestimonials,
              refetch,
            })
          }
        />
      ),
    },
  ];

  const TestimonialsData = !isLoading && testimonials?.data ? testimonials?.data : [];

  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          {t("testimonials.title")}
        </h1>
        <p className="text-muted-foreground">{t("testimonials.description")}</p>
      </div>
      <DataTable
        columns={columns}
        data={TestimonialsData}
        searchKey="name"
        searchPlaceholder={t("testimonials.search_placeholder")}
        onAdd={() =>
          openModal("createTestimonial", {
            onConfirm: createTestimonial,
            refetch,
          })
        }
        addButtonText={t("testimonials.add_button_text")}
        loading={isLoading}
        emptyMessage={t("testimonials.empty_message")}
      />
    </div>
  );
}