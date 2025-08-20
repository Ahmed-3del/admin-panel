/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { Plus, Edit } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useModal } from "@/hooks/use-modal"

import useGetAbout from "../main/hooks/use-get-about"
import { useTranslation } from "react-i18next"

// Sample data structure
interface DataItem {
    _id: string
    hero: {
        title: string
        description: string
    }
    stats: Array<{
        label: string
        icon?: string
        value: string
        _id?: string
    }>
    portfolio: string
    services: string
    values: Array<{
        icon?: string
        title: string
        description: string
        _id?: string
    }>
    features: Array<{
        icon?: string
        title: string
        description: string
        _id?: string
    }>
}

export default function DataManagementAbout() {
    const { about, isLoading, refetch } = useGetAbout()
    const { openModal } = useModal()
    const { t } = useTranslation()

    const handleCreate = async (formData: any) => {

        await fetch("/api/about", {
            method: "POST",
            body: formData
        }).then((response) => {
            if (!response.ok) {
                toast.error(`Failed to create data: ${response.statusText}`)
                throw new Error(`Failed to create data: ${response.statusText}`)
            }
        })

    }

    const handleEdit = async (formData: any) => {
        await fetch(`/api/about/${about[0]._id}`, {
            method: "PUT",
            body: formData
        }).then((response) => {
            if (!response.ok) {
                toast.error(`Failed to create data: ${response.statusText}`)
                throw new Error(`Failed to create data: ${response.statusText}`)
            }
        })

    }

    const openCreateModal = () => {
        openModal("createAboutData", {
            mode: "create",
            onSubmit: handleCreate,
            title: "Create New Data Entry",
            refetch
        })
    }
    const openEditModal = () => {
        openModal("editAboutData", {
            mode: "edit",
            initialData: about?.[0] ?? {},
            onSubmit: handleEdit,
            title: "Edit Data Entry",
            refetch
        })
    }
    if (isLoading) {
        return (
            <div className="container mx-auto p-6">
                <Card className="w-full animate-pulse">
                    <CardHeader>
                        <div className="h-6 bg-muted rounded w-1/3 mb-2" />
                        <div className="h-4 bg-muted rounded w-2/3" />
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div>
                                <div className="h-4 bg-muted rounded w-1/4 mb-1" />
                                <div className="h-3 bg-muted rounded w-1/6" />
                            </div>
                            <div>
                                <div className="h-4 bg-muted rounded w-1/4 mb-1" />
                                <div className="h-3 bg-muted rounded w-1/6" />
                            </div>
                            <div>
                                <div className="h-4 bg-muted rounded w-1/4 mb-1" />
                                <div className="h-3 bg-muted rounded w-1/6" />
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <div className="h-8 bg-muted rounded w-24 mr-2" />
                        <div className="h-8 bg-muted rounded w-24" />
                    </CardFooter>
                </Card>
            </div>
        )
    }

    if (!about) {
        return <div className="text-center">
            {t("about.no_data")}
        </div>
    }


    return (
        <div className="container mx-auto p-6 space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">
                    {t("about.title")}
                </h1>
                <Button disabled={isLoading} onClick={openCreateModal}>
                    <Plus className="mr-2 h-4 w-4" /> {t("about.create_about")}
                </Button>
            </div>
            {
                about?.map(
                    (item: DataItem) => (
                        <Card key={item._id} className="mt-6">
                            <CardHeader>
                                <CardTitle>{item.hero.title}</CardTitle>
                                <CardDescription>{item.hero.description}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="text-lg font-medium">{t("about.stats")}</h3>
                                        <p className="text-sm text-muted-foreground">
                                            {item.stats.length} stat{item.stats.length !== 1 ? "s" : ""}
                                        </p>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-medium">{t("about.features")}</h3>
                                        <p className="text-sm text-muted-foreground">
                                            {item.features.length} {t("about.feature", { count: item.features.length })}
                                        </p>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-medium">{t("about.values")}</h3>
                                        <p className="text-sm text-muted-foreground">
                                            {item.values.length} {t("about.value", { count: item.values.length })}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-start gap-x-4">
                                <Button onClick={openEditModal} variant="outline">
                                    <Edit className="mr-2 h-4 w-4" />
                                    {t("about.edit_about")}
                                </Button>
                                <Button onClick={() => openModal("deleteModal", {
                                    id: item._id,
                                    onConfirm: async (id: string) => {
                                        await fetch(`/api/about/${id}`, {
                                            method: "DELETE"
                                        }).then((response) => {
                                            if (!response.ok) {
                                                toast.error(`Failed to delete data: ${response.statusText}`)
                                                throw new Error(`Failed to delete data: ${response.statusText}`)
                                            }
                                        })
                                        toast.success(t("about.delete_success"))
                                    },
                                    refetch,
                                    title: t("about.delete_data"),
                                    message: t("about.delete_confirmation")
                                })} variant="destructive" className="mx-2">
                                    {t("about.delete_data")}
                                </Button>
                            </CardFooter>
                        </Card>
                    ))
            }
        </div>
    )
}
