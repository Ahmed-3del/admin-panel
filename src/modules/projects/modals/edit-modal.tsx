/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useModal } from "@/hooks/use-modal"

const projectSchema = z.object({
    projectName: z.string().min(1, "Project name is required").max(100, "Project name is too long"),
    description: z.string().min(1, "Description is required").max(500, "Description is too long"),
    category: z.string().min(1, "Category is required").max(50, "Category is too long"),
})

type ProjectFormValues = z.infer<typeof projectSchema>

export function EditProjectModal({ data, onConfirm, refetch }: any) {
    const { closeModal } = useModal()

    const form = useForm<ProjectFormValues>({
        resolver: zodResolver(projectSchema),
        defaultValues: {
            projectName: data?.name ?? "",
            description: data?.description ?? "",
            category: data?.category ?? "",
        },
    })

    const onSubmit = async (formData: ProjectFormValues) => {
        try {
            await onConfirm?.({ ...formData, id: data?.id })
            refetch?.()
            closeModal()
        } catch (error) {
            console.error("Error updating project:", error)
        }
    }

    return (
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
                <DialogTitle>Edit Project</DialogTitle>
                <DialogDescription>Update the project details below.</DialogDescription>
            </DialogHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="projectName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Project Name *</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter project name" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description *</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="Enter project description" className="min-h-[80px]" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={closeModal}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={form.formState.isSubmitting}>
                            {form.formState.isSubmitting ? "Updating..." : "Update Project"}
                        </Button>
                    </DialogFooter>
                </form>
            </Form>
        </DialogContent>
    )
}

