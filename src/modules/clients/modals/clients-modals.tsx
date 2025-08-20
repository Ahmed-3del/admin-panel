/* eslint-disable import/no-cycle */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState } from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { DialogContent, DialogDescription, DialogFooter, DialogClose, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { FileUpload } from "@/components/ui/file-upload"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { MultiSelect } from "@/components/ui/multi-select"
import { ModalProps } from "@/context/modal-context-provider"
import { useModal } from "@/hooks/use-modal"
import useGetContacts from "@/modules/contacts/hooks/use-get-contacts"
import useGetProjects from "@/modules/main/hooks/use-get-projects"

import { ClientFormValues, clientSchema } from "../validation/clients-schema"

export function CreateClientModal({ refetch }: ModalProps) {
    const { closeModal } = useModal()
    const [profileImageFile, setProfileImageFile] = useState<File | null>(null)
    const { contacts, isLoading: loadingContacts } = useGetContacts()
    const { projects } = useGetProjects()
    const form = useForm<ClientFormValues>({
        resolver: zodResolver(clientSchema),
        defaultValues: {
            name: "",
            industry: "",
            contacts: [],
            projects: [],
            profileImage: null,
            _id: undefined,
        },
    })
    const handleFileChange = (file: File | null) => {
        setProfileImageFile(file)
    }
    const onSubmit = async (data: ClientFormValues) => {
        try {
            const formData = new FormData()
            formData.append("name", data.name)
            formData.append("industry", data.industry ?? "")
            if (data.contacts?.length) {
                data.contacts.forEach((contact, index) => {
                    formData.append(`contacts[${index}]`, contact)
                })
            }
            if (data.projects?.length) {
                data.projects.forEach((project, index) => {
                    formData.append(`projects[${index}]`, project)
                })
            }
            formData.append("profileImage", profileImageFile as File)
            console.log("Creating client with data:", data)
            await axios.post("/api/clients", formData).then((response) => {
                if (response.status !== 201) {
                    throw new Error(`Failed to create client: ${response.statusText}`)
                }
            })
            toast.success("Client created successfully!")
            refetch?.()
            form.reset()
            setProfileImageFile(null)
            closeModal()
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
                <DialogTitle>Create New Client</DialogTitle>
                <DialogDescription>Add a new client to your dashboard. Fill in the details below.</DialogDescription>
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
                                        <FormControl>
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
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={closeModal}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={form.formState.isSubmitting}>
                            {form.formState.isSubmitting ? "Creating..." : "Create Client"}
                        </Button>
                    </DialogFooter>
                </form>
            </Form>
        </DialogContent>
    )
}

export function DeleteClientModal({ data, refetch }: ModalProps) {
    const { closeModal } = useModal()

    const handleDelete = async () => {
        try {
            await axios.delete(`/api/clients/${data._id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            })
            refetch?.()
            toast.success("Client deleted successfully")
            closeModal()
        } catch (error) {
            closeModal()
            toast.error("Failed to delete client. Please try again.")
            throw new Error("Failed to delete client")

        }
    }

    return (
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>Delete Client</DialogTitle>
                <DialogDescription>
                    Are you sure you want to delete <strong>{data?.name}</strong>? This action cannot be undone and will
                    permanently remove all client data.
                </DialogDescription>

            </DialogHeader>
            <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="outline">
                        Cancel

                    </Button>
                </DialogClose>

                <Button type="button" variant="destructive" onClick={handleDelete}>
                    Delete Client
                </Button>
            </DialogFooter>
        </DialogContent>
    )
}
