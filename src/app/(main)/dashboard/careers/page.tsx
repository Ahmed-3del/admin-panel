"use client"

import { DataTable, type Column } from "@/components/data-table/data-table"
import { TableActions } from "@/components/data-table/table-actions"
import { Badge } from "@/components/ui/badge"
import { useModal } from "@/hooks/use-modal"
import useClients from "@/modules/main/hooks/use-clients"
import { useTranslation } from "react-i18next"

type Client = {
    id: string
    name: string
    industry: string
    contacts: string[]
    projects: []
}

export default function ClientsPage() {
    const { clients, isLoading, refetch,error } = useClients()
    const { t } = useTranslation()

    const { openModal } = useModal()
   
    if (error) {
        return (
            <div className="text-red-500">
                {t("error")}
            </div>
        )
    }

    const columns: Column<Client>[] = [
        {
            key: "name",
            label: t("clients.name"),
            sortable: true,
            searchable: true,
            render: (value) => (
                <div>
                    <div className="font-medium">{value}</div>
                </div>
            ),
        },
        {
            key: "industry",
            label: t("clients.industry"),
            sortable: true,
            searchable: true,
            render: (value) => (
                <div className="text-sm text-muted-foreground">{value}</div>
            ),
        },
        {
            key: "projects",
            label: t("clients.projects"),
            render: (value) => (
                <Badge className="text-sm">
                    {value.length} {value.length === 1 ? t("clients.project") : t("clients.projects")}
                </Badge>
            ),
        },
        {
            key: "actions",
            label: t("clients.actions"),
            render: (_, row) => (
                <TableActions
                    onEdit={() =>
                        openModal("editClient", {
                            data: row,
                            refetch,
                        })
                    }
                    onDelete={() =>
                        openModal("deleteClient", {
                            data: row,
                            refetch,
                        })
                    }
                />
            ),
        },
    ]
    return (
        <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold">{t("clients.title")}</h1>
                <p className="text-muted-foreground">{t("clients.description")}</p>
            </div>

            <DataTable
                columns={columns}
                data={clients.data}
                showColumnToggle={false}
                searchKey="name"
                searchPlaceholder={t("clients.search_placeholder")}
                onAdd={() =>
                    openModal("createClient", {
                        refetch,
                    })
                }
                addButtonText={t("clients.add_button_text")}
                loading={isLoading}
                emptyMessage={t("clients.empty_message")}
            />
        </div>
    )
}
