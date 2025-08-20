/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { AwaitedReactNode, JSXElementConstructor, ReactElement, ReactNode } from "react"
import axios, { AxiosError } from "axios"
import { toast } from "sonner"
import { DataTable } from "@/components/data-table/data-table"
import { TableActions } from "@/components/data-table/table-actions"
import { useModal } from "@/hooks/use-modal"
import usePrivacy from "@/modules/main/hooks/use-privacy"
import { useTranslation } from "react-i18next"

export default function PrivacysPage() {
  const { privacy, isLoading, refetch } = usePrivacy()
  const { openModal } = useModal()
  const { t } = useTranslation()

  const createPrivacy = async (data: any) => {
    try {
      const payload = {
        title: data.title,
        content: data.content,
      };
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}privacy-policy`, payload, {
        headers: {
          "Content-Type": "application/json",
        },
      }).then((response) => {
        if (response.status !== 201) {
          throw new Error(`Failed to create Privacy: ${response.statusText}`)
        }
      })
      toast.success("Privacy created successfully!")
    } catch (error) {
      toast.error(
        error instanceof AxiosError
          ? (error?.response?.data?.message ?? error.message ?? "Failed to create Privacy. Please try again.")
          : "Failed to create Privacy. Please try again."
      );
    }
  }

  const updatePrivacy = async (data: any) => {
    const { id, title, content } = data;
    try {
      const payload = {
        title,
        content,
      };

      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}privacy-policy/${id}`, payload, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      toast.success("Privacy updated successfully!")
    } catch (error) {
      toast.error(
        error instanceof AxiosError
          ? (error?.response?.data?.message ?? error.message ?? "Failed to update Privacy. Please try again.")
          : "Failed to update Privacy. Please try again."
      );
    }
  }
  const deletePrivacy = async (id: string) => {
    await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}privacy-policy/${id}`).then(() => {
      toast.success("Privacy deleted successfully")
      refetch()
    })
  }
  const columns: any = [
    {
      key: "title",
      label: t("privacy.title"),
      searchable: true,
      render: (value: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | Promise<AwaitedReactNode> | null | undefined) => (
        <div className="text-sm text-muted-foreground truncate max-w-[200px]" title={value !== undefined && value !== null ? String(value) : ""}>
          {value}
        </div>
      ),
    },
    {
      key: "content",
      label: t("privacy.content"),
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
      label: t("privacy.actions"),
      render: (_: any, row: any) => (
        <TableActions
          onEdit={() =>
            openModal("editPrivacy", {
              data: row,
              onConfirm: updatePrivacy,
              refetch,
            })
          }
          onDelete={() =>
            openModal("deletePrivacy", {
              data: row,
              onConfirm: deletePrivacy,
              refetch,
            })
          }
        />
      ),
    },
  ]
  const PrivacyData = !isLoading && privacy?.policies ? privacy?.policies : []
  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          {t("privacy.title")}
        </h1>
        <p className="text-muted-foreground">{t("privacy.description")}</p>
      </div>
      <DataTable
        columns={columns}
        data={PrivacyData}
        searchKey="title"
        searchPlaceholder={t("privacy.searchPlaceholder")}
        onAdd={() =>
          openModal("createPrivacy", {
            onConfirm: createPrivacy,
            refetch,
          })
        }
        addButtonText={t("privacy.addButtonText")}
        loading={isLoading}
        emptyMessage={t("privacy.emptyMessage")}
      />
    </div>
  )
}
