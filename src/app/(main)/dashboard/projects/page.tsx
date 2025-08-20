/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import axios from "axios"
import { toast } from "sonner"
import { DataTable } from "@/components/data-table/data-table"
import { TableActions } from "@/components/data-table/table-actions"
import { useModal } from "@/hooks/use-modal"
import useGetProjects from "@/modules/main/hooks/use-get-projects"
import { useTranslation } from "react-i18next"

export default function ProjectsPage() {
  const { t } = useTranslation()
  const { projects, isLoading, refetch } = useGetProjects()
  const { openModal } = useModal()
  const deleteProject = async (id: string) => {
    if (!id) {
      toast.error(t("projects.delete_project_error"))
      return
    }
    await axios.delete(`/api/projects/${id}`).then(() => {
      toast.success(t("projects.delete_project_success"))
      refetch()
    })
  }
  const columns: any = [
    {
      key: "projectName",
      label: t("projects.project_name"),
      sortable: true,
      searchable: true,
      render: (value: any) => (
        <div>
          <div className="font-medium">{value}</div>
        </div>
      ),
    },
    {
      key: "category",
      label: t("projects.category"),
      searchable: true,
      render: (value: any) => (
        <div className="text-sm text-muted-foreground truncate max-w-[200px]" title={value}>
          {value}
        </div>
      ),
    },
    {
      key: "actions",
      label: t("projects.actions"),
      render: (_: any, row: any) => (
        <TableActions
          onDelete={() =>
            openModal("deleteProject", {
              data: row,
              onConfirm: deleteProject,
              refetch,
            })
          }
        />
      ),
    },
  ]
  const projectsData = !isLoading && projects
  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          {t("projects.title") || "Projects"}
        </h1>
        <p className="text-muted-foreground">{t("projects.description") || "Manage your projects and track their progress."}</p>
      </div>
      <DataTable
        columns={columns}
        data={projectsData?.data || []}
        searchKey="projectName"
        searchPlaceholder={t("projects.search_placeholder") || "Search projects..."}
        onAdd={() =>
          openModal("createProject", {
            refetch,
          })
        }
        addButtonText={t("projects.add_button_text") || "Add Project"}
        loading={isLoading}
        emptyMessage={t("projects.empty_message") || "No projects found. Create your first project to get started."}

      />
    </div>
  )
}
