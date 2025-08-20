/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { AwaitedReactNode, JSXElementConstructor, ReactElement, ReactNode } from "react"
import { DataTable } from "@/components/data-table/data-table"
import useSubscription from "@/modules/main/hooks/use-subscription"
import { useTranslation } from "react-i18next"

export default function SubscriptionPage() {
  const { subscription, isLoading } = useSubscription()
 const { t } = useTranslation()


  const columns: any = [
    {
      key: "email",
      label: "Email",
      searchable: true,
      render: (value: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | Promise<AwaitedReactNode> | null | undefined) => (
        <div className="text-sm text-muted-foreground truncate max-w-fit" title={value !== undefined && value !== null ? String(value) : ""}>
          {value}
        </div>
      ),
    },

    ,
    {
      key: "subscribedAt",
      label: "Subscribed At",
      searchable: true,
      render: (
        value: string | number | bigint | boolean | React.ReactNode | null | undefined
      ) => {
        let formattedDate = "";
        if (typeof value === "string" || typeof value === "number") {
          const date = new Date(value);
          formattedDate = new Intl.DateTimeFormat("en-US", {
            dateStyle: "medium",
            timeStyle: "short",
          }).format(date);
        }

        return (
          <div
            className="text-sm text-muted-foreground truncate max-w-[200px]"
            title={value !== undefined && value !== null ? String(value) : ""}
          >
            {formattedDate || "-"}
          </div>
        );
      },
    }


  ]
  const subscriptionData = !isLoading && subscription ? subscription : []

  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          {t("subscriptions.title")}
        </h1>
        <p className="text-muted-foreground">{t("subscriptions.description")}</p>
      </div>
      <DataTable
        columns={columns}
        data={subscriptionData}
        searchKey="email"
        searchPlaceholder= {t("subscriptions.search_placeholder")}
        loading={isLoading}
        emptyMessage={t("subscriptions.no_subscriptions")}
      />
    </div>
  )
}
