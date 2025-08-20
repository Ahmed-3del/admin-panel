/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { AwaitedReactNode, JSXElementConstructor, ReactElement, ReactNode } from "react"
import axios, { AxiosError } from "axios"
import { toast } from "sonner"
import { DataTable } from "@/components/data-table/data-table"
import { TableActions } from "@/components/data-table/table-actions"
import { useModal } from "@/hooks/use-modal"
import useTerms from "@/modules/main/hooks/use-terms"
import { useTranslation } from "react-i18next"

export default function TermssPage() {
  const { terms, isLoading, refetch } = useTerms()
  const { openModal } = useModal()
  const { t } = useTranslation()
  const createTerms = async (data: any) => {
    try {
      const payload = {
        title: data.title,
        content: data.content,
      };
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}terms-conditions`, payload, {
        headers: {
          "Content-Type": "application/json",
        },
      }).then((response) => {
        if (response.status !== 201) {
          throw new Error(`Failed to create Terms: ${response.statusText}`)
        }
      })
      toast.success("Terms created successfully!")
    } catch (error) {
      toast.error(
        error instanceof AxiosError
          ? (error?.response?.data?.message ?? "Failed to create Terms. Please try again.")
          : "Failed to create Terms. Please try again."
      );
    }
  }
  const updateTerms = async (data: any) => {
    const { id, title, content } = data;
    try {
      const payload = {
        title,
        content,
      };
      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}terms-conditions/${id}`, payload, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      toast.success("Terms updated successfully!")
    } catch (error) {
      toast.error(
        error instanceof AxiosError
          ? (error?.response?.data?.message ?? "Failed to update Terms. Please try again.")
          : "Failed to update Terms. Please try again."
      );
    }
  };
  const deleteTerms = async (id: string) => {
    await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}terms-conditions/${id}`).then(() => {
      toast.success("Terms deleted successfully")
      refetch()
    })
  }
  const columns: any = [
    {
      key: "title",
      label: t("terms.title"),
      searchable: true,
      render: (value: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | Promise<AwaitedReactNode> | null | undefined) => (
        <div className="text-sm text-muted-foreground truncate max-w-[200px]" title={value !== undefined && value !== null ? String(value) : ""}>
          {value}
        </div>
      ),
    },
    {
      key: "content",
      label: t("terms.content"),
      searchable: true,
      render: (
        value: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | Promise<AwaitedReactNode> | null | undefined
      ) => {
        const stringOrSafeHtml = typeof value === "string" ? value : undefined;

        // Show only a summary (first 50 characters) of the content
        const summary =
          typeof stringOrSafeHtml === "string"
            ? stringOrSafeHtml.slice(0, 50) + (stringOrSafeHtml.length > 50 ? "..." : "")
            : "";

        return (
          <div
            className="text-sm text-muted-foreground truncate max-w-full"
            title={stringOrSafeHtml}
          >
            {summary}
          </div>
        );
      },
    },
    {
      key: "actions",
      label: t("terms.actions"),
      render: (_: any, row: any) => (
        <TableActions
          onEdit={() =>
            openModal("editTerms", {
              data: row,
              onConfirm: updateTerms,
              refetch,
            })
          }
          onDelete={() =>
            openModal("deleteTerms", {
              data: row,
              onConfirm: deleteTerms,
              refetch,
            })
          }
        />
      ),
    },
  ]
  const TermsData = !isLoading && terms?.terms ? terms?.terms : []
  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          {t("terms.title")}
        </h1>
        <p className="text-muted-foreground">

        </p>
      </div>
      <DataTable
        columns={columns}
        data={TermsData}
        searchKey="title"
        showColumnToggle={false}
        searchPlaceholder={t("terms.search_placeholder")}
        onAdd={() =>
          openModal("createTerms", {
            onConfirm: createTerms,
            refetch,
          })
        }
        addButtonText={t("terms.btn_text")}
        loading={isLoading}
        emptyMessage={t("terms.empty")}
      />
    </div>
  )
}
