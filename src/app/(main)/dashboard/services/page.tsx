/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"


import axios from "axios"
import { toast } from "sonner"

import { useModal } from "@/hooks/use-modal"
import useServices from "@/modules/main/hooks/use-services"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useTranslation } from "react-i18next"

export default function ServicesPage() {
  const { services, isLoading, refetch } = useServices()
  const router = useRouter()
  const { t } = useTranslation()
  const { openModal } = useModal()

  const deleteService = async (id: string) => {
    await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}services/${id}`).then(() => {
      toast.success("Service deleted successfully")
      refetch()
    })
  }

  const ServicesData = !isLoading && services?.data?.services ? services?.data?.services : []
  if (isLoading) {
    return <div className="text-center text-muted-foreground flex items-center justify-center h-full w-full text-4xl font-semibold">
      {t(`services.loading`) || "Loading services..."}
    </div>
  }
  if (!ServicesData || ServicesData.length === 0) {
    return (
      <div className="text-center text-muted-foreground flex items-center justify-center h-full w-full text-4xl font-semibold">
        {t(`services.no_services`) || "No services found."}
      </div>
    )
  }
  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8 ">

      <div className="mb-8 flex items-center justify-between">
        <header className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold">
            {t('services.title', { defaultValue: 'Services' }) || "Services"}
          </h1>
          <p className="text-muted-foreground">{t('services.description', { defaultValue: 'Manage your services and track their progress.' }) || "Manage your services and track their progress."}</p>
        </header>
        <Button
          onClick={() => router.push("/dashboard/services/create-service")}
          className=" bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          {t('services.create_service', { defaultValue: 'Create Service' }) || "Create Service"}
        </Button>
      </div>
      {
        ServicesData.length > 0 && (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {ServicesData.map((service: any) => (
              <Card key={service._id} className="p-4 flex flex-col justify-between">
                <div>
                  <h2 className="text-lg font-semibold truncate mb-1" title={service.title}>
                    {service.name || "Service Name"}
                  </h2>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {service.description}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {service.category &&
                      <Badge variant="secondary" className="text-xs">
                        {service.category}
                      </Badge>
                    }
                  </div>

                </div>

                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() =>
                      router.push(`/dashboard/services/edit-service/${service._id}`)
                    }
                    className="text-sm text-green-600 hover:underline"
                  >
                    {t('services.edit_service', { defaultValue: 'Edit' }) || "Edit"}
                  </button>
                  <button
                    onClick={() => openModal("deleteService", {
                      data: service,
                      onConfirm: () => deleteService(service._id),
                      refetch,
                    })}
                    className="text-sm text-red-600 hover:underline"
                  >
                    {t('services.delete_service', { defaultValue: 'Delete' }) || "Delete"}
                  </button>
                </div>
              </Card>
            ))}
          </div>
        )}
    </div>
  )
}
