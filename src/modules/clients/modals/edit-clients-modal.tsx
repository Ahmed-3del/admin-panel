
/* eslint-disable complexity */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useEffect, useState } from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { FileUpload } from "@/components/ui/file-upload"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { MultiSelect } from "@/components/ui/multi-select"
import { useModal } from "@/hooks/use-modal"
import { getUrlImage } from "@/lib/utils"
import useGetContacts from "@/modules/contacts/hooks/use-get-contacts"
import useGetProjects from "@/modules/main/hooks/use-get-projects"

import { ClientFormValues, clientSchema } from "../validation/clients-schema"

export function EditClientModal({ data, refetch }: any) {

    const { closeModal } = useModal()
    const { contacts, isLoading: loadingContacts } = useGetContacts()
    const [profileImageFile, setProfileImageFile] = useState<File | null | string>(null)
    const { projects } = useGetProjects()
    const form = useForm<ClientFormValues>({
        resolver: zodResolver(clientSchema),
        defaultValues: {
            _id: data?._id ?? "",
            name: data?.name ?? "",
            industry: data?.industry ?? "",
            contacts: data?.contacts ?? [],
            projects: data?.projects ?? [],
            profileImage: data?.profileImage ?? null,
        },
    })

    useEffect(() => {
        if (data?.profileImage) {
            setProfileImageFile(getUrlImage(data.profileImage))
        }
    }, [data])
    useEffect(() => {
        if (data) {
            form.reset({
                _id: data._id ?? "",
                name: data.name ?? "",
                industry: data.industry ?? "",
                contacts: data.contacts ?? [],
                projects: data.projects ?? [],
                profileImage: data.profileImage ?? null,
            });

            if (data.profileImage) {
                setProfileImageFile(getUrlImage(data.profileImage));
            } else {
                setProfileImageFile(null);
            }
        }
    }, [data, form]);

    const handleFileChange = (file: File | null) => {
        setProfileImageFile(file)
    }
    const id = data?._id ?? ""

    const onSubmit = async (formData: ClientFormValues) => {
        const clientId = formData._id ?? data?._id ?? id
        if (!clientId) {
            toast.error("Client ID is required for updating.")
            return
        }

        try {
            const formDataToSend = new FormData()
            formDataToSend.append("name", formData.name)
            formDataToSend.append("industry", formData.industry ?? "")
            if (formData.contacts?.length) {
                formData.contacts.forEach((contact, index) => {
                    formDataToSend.append(`contacts[${index}]`, contact)
                })
            }
            if (formData.projects?.length) {
                formData.projects.forEach((project: string | Blob, index: any) => {
                    formDataToSend.append(`projects[${index}]`, project)
                })
            }
            formDataToSend.append("profileImage", profileImageFile as File)
            await axios.put(`/api/clients/${data._id}`, formDataToSend).then((response) => {
                if (response.status < 200 || response.status >= 300) {
                    throw new Error(`Failed to update client: ${response.statusText}`);
                }
            });
            toast.success("Client updated successfully!")
            refetch?.()
            closeModal()
            form.reset()
            setProfileImageFile(null)
        } catch (error) {
            toast.error("Failed to create client. Please try again.")
        }
    }

    const contactOptions = contacts?.map((contact: { name: any; email: any; _id: any }) => ({
        label: contact.name,
        value: contact._id,
        id: contact._id,
    }))
    const projectOptions = projects?.portfolioItems?.map((project: { name: any; id: any }) => ({
        label: project.name,
        value: project.id,
        id: project.id,
    }))
    return (
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
                <DialogTitle>
                    Edit Client
                    <span className="text-sm text-muted-foreground"> {data?.name}</span>
                </DialogTitle>
                <DialogDescription>
                    Update the client details below. All fields marked with an asterisk (*) are required.
                    <br />
                    <span className="text-xs text-muted-foreground">Note: Profile image is optional.</span>
                </DialogDescription>
            </DialogHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Client Name *</FormLabel>
                                        <FormControl >
                                            <Input placeholder="Enter client name" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="industry"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Client Ibdustry *</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter client industry" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="contacts"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Contacts</FormLabel>
                                        <FormControl>
                                            <MultiSelect
                                                options={contactOptions}
                                                selected={field.value ?? []}
                                                onChange={field.onChange}
                                                placeholder="Select contacts"
                                                disabled={loadingContacts}
                                                emptyMessage={loadingContacts ? "Loading contacts..." : "No contacts found"}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="projects"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>projects</FormLabel>
                                        <FormControl>
                                            <MultiSelect
                                                options={projectOptions}
                                                selected={field.value ?? []}
                                                onChange={field.onChange}
                                                placeholder="Select projects"
                                                disabled={loadingContacts}
                                                emptyMessage={loadingContacts ? "Loading projects..." : "No contacts found"}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="space-y-4">
                            <FormLabel>Profile Image</FormLabel>
                            <FileUpload
                                className=""
                                value={profileImageFile}
                                onChange={handleFileChange}
                                onBlur={() => form.trigger("profileImage")}
                            />
                            <FormMessage >
                                {form.formState.errors.profileImage && form.formState.errors.profileImage.message}
                            </FormMessage>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={closeModal}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={form.formState.isSubmitting}>
                            {form.formState.isSubmitting ? "updating..." : "Update Client"}
                        </Button>
                    </DialogFooter>
                </form>
            </Form>
        </DialogContent>
    )
}
