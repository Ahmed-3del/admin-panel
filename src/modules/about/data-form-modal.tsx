/* eslint-disable sonarjs/no-commented-code */

/* eslint-disable security/detect-object-injection */
/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
"use client"

import { useEffect } from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { Plus, Upload } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { useModal } from "@/hooks/use-modal"

// import useGetProjects from "../main/hooks/use-get-projects"
// import useServices from "../main/hooks/use-services"

const formSchema = z.object({
    hero: z.object({
        title: z.string().min(2, { message: "Title must be at least 2 characters." }),
        description: z.string().min(10, { message: "Description must be at least 10 characters." }),
    }),
    stats: z.array(
        z.object({
            label: z.string().min(2, { message: "Label must be at least 2 characters." }),
            icon: z.string().optional(),
            value: z.string().min(1, { message: "Value is required." }),
        }),
    ),
    // portfolio: z.string().optional(),
    // services: z.string().optional(),
    values: z.array(
        z.object({
            icon: z.string().optional(),
            title: z.string().min(2, { message: "Title must be at least 2 characters." }),
            description: z.string().min(10, { message: "Description must be at least 10 characters." }),
        }),
    ),
    features: z.array(
        z.object({
            icon: z.string().optional(),
            title: z.string().min(2, { message: "Title must be at least 2 characters." }),
            description: z.string().min(10, { message: "Description must be at least 10 characters." }),
        }),
    ),
})

type FormValues = z.infer<typeof formSchema>

export interface DataFormModalProps {
    initialData?: FormValues
    mode: "create" | "edit"
    onSubmit: (data: FormData) => Promise<void>
    onCancel?: () => void
    title?: string
    refetch?: () => void
}

const defaultValues: FormValues = {
    hero: {
        title: "",
        description: "",
    },
    stats: [
        {
            label: "",
            icon: "",
            value: "",
        },
    ],
    // portfolio: "",
    // services: "",
    values: [
        {
            icon: "",
            title: "",
            description: "",
        },
    ],
    features: [
        {
            icon: "",
            title: "",
            description: "",
        },
    ],
}

export function DataFormModal({ initialData, mode, onSubmit, title, refetch }: DataFormModalProps) {
    const { closeModal } = useModal()
    // const { projects, isLoading: projectsLoading } = useGetProjects()
    // const { services, isLoading } = useServices()
    // const projectsData = !projectsLoading && projects.portfolioItems ? projects.portfolioItems : []
    // const servicesData = !isLoading && services?.data ? services.data.services : []
    // const projectsOptions = projectsData?.map((project: { name: any; description: any; _id: any }) => ({
    //     label: project.name,
    //     value: project._id,
    //     id: project._id,
    // }))
    // const servicesOptions = servicesData?.map((service: { category: any; description: any; _id: any }) => ({
    //     label: service.category,
    //     value: service._id,
    //     id: service._id,
    // }))

    if (!mode || (mode !== "create" && mode !== "edit")) {
        throw new Error("Invalid mode. Must be 'create' or 'edit'.")
    }
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || defaultValues,
    })
    useEffect(() => {
        if (initialData) {
            form.reset(initialData)
        } else {
            form.reset(defaultValues)
        }
    }, [initialData, form])

    const handleFileUpload = (field: string, index?: number, section?: string) => {
        return (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (!file) return;

            const reader = new FileReader();

            reader.onloadend = () => {
                const base64Data = reader.result as string;
                if (section && typeof index === "number") {
                    const currentValues = form.getValues(section as any) as any[];
                    if (currentValues && currentValues[index]) {
                        const updatedValues = [...currentValues];
                        updatedValues[index] = {
                            ...updatedValues[index],
                            [field]: base64Data,
                        };
                        form.setValue(section as any, updatedValues);
                    }
                }

                toast.success(`${file.name} uploaded successfully`);
            };

            reader.readAsDataURL(file)
        };
    };

    const addItem = (field: any) => {
        const currentValues = form.getValues(field) as any[]

        let newItem
        switch (field) {
            case "stats":
                newItem = { label: "", icon: "", value: "" }
                break
            case "values":
            case "features":
                newItem = { icon: "", title: "", description: "" }
                break
            default:
                return
        }

        form.setValue(field, [...(currentValues || []), newItem])
    }

    const removeItem = (field: any, index: number) => {
        const currentValues = form.getValues(field) as any[]
        if (currentValues && currentValues.length > index) {
            const newValues = currentValues.filter((_, i) => i !== index)
            form.setValue(field, newValues)
        }
    }

    const handleFormSubmit = async (values: FormValues) => {
        try {
            const formData = new FormData()
            Object.entries(values).forEach(([key, value]) => {
                if (Array.isArray(value)) {
                    value.forEach((item, index) => {
                        Object.entries(item).forEach(([itemKey, itemValue]) => {
                            if (itemValue) {
                                formData.append(`${key}[${index}][${itemKey}]`, itemValue)
                            }
                        })
                    })
                } else if (typeof value === "object" && value !== null) {
                    Object.entries(value).forEach(([itemKey, itemValue]) => {
                        if (itemValue) {
                            formData.append(`${key}[${itemKey}]`, itemValue)
                        }
                    })
                } else {
                    formData.append(key, value)
                }
            })
            await onSubmit(formData)
            toast.success(`Data ${mode === "create" ? "created" : "updated"} successfully`)
            form.reset(defaultValues)
            refetch?.()
            closeModal()
        } catch (error) {
            console.error("Form submission error:", error)
            toast.error(`Failed to ${mode} data. Please try again.`)
        }
    }
    console.log("Rendering DataFormModal with mode:", mode, "and initialData:", initialData)
    return (
        <DialogContent className="sm:max-w-[600px]   max-h-[90vh] overflow-y-auto">
            <DialogHeader>
                <DialogTitle>{title || `${mode === "create" ? "Create New" : "Edit"} Data`}</DialogTitle>
                <DialogDescription>
                    {mode === "create"
                        ? "Fill in the details to create a new entry."
                        : "Update the details of the existing entry."}
                </DialogDescription>
            </DialogHeader>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6 size-full">
                    <Tabs defaultValue="hero" className="w-full">
                        <TabsList className="grid grid-cols-6 mb-4">
                            <TabsTrigger value="hero">Hero</TabsTrigger>
                            <TabsTrigger value="stats">Stats</TabsTrigger>
                            {/* <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
                            <TabsTrigger value="services">Services</TabsTrigger> */}
                            <TabsTrigger value="values">Values</TabsTrigger>
                            <TabsTrigger value="features">Features</TabsTrigger>
                        </TabsList>

                        <TabsContent value="hero" className="space-y-4 size-full">
                            <FormField
                                control={form.control}
                                name="hero.title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Hero Title</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter hero title" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="hero.description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Hero Description</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="Enter hero description" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </TabsContent>

                        <TabsContent value="stats" className="space-y-4">
                            {form.watch("stats")?.map((_, index) => (
                                <div key={index} className="space-y-4 p-4 border rounded-md">
                                    <div className="flex justify-between items-center">
                                        <h4 className="text-sm font-medium">Stat {index + 1}</h4>
                                        {index > 0 && (
                                            <Button type="button" variant="destructive" size="sm" onClick={() => removeItem("stats", index)}>
                                                Remove
                                            </Button>
                                        )}
                                    </div>
                                    <FormField
                                        control={form.control}
                                        name={`stats.${index}.label`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Label</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Enter stat label" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name={`stats.${index}.value`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Value</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Enter stat value" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name={`stats.${index}.icon`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Icon</FormLabel>
                                                <div className="flex items-center gap-2">
                                                    <FormControl>
                                                        <Input placeholder="Icon URL" {...field} />
                                                    </FormControl>
                                                    <div className="relative">
                                                        <Input
                                                            type="file"
                                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                                            onChange={handleFileUpload("icon", index, "stats")}
                                                        />
                                                        <Button type="button" variant="outline" size="icon">
                                                            <Upload className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            ))}
                            <Button type="button" variant="outline" size="sm" onClick={() => addItem("stats")}>
                                <Plus className="mr-2 h-4 w-4" /> Add Stat
                            </Button>
                        </TabsContent>

                        {/* <TabsContent value="portfolio" className="space-y-4">

                            <FormField
                                control={form.control}
                                name="portfolio"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>portfolio</FormLabel>
                                        <FormControl>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select portfolio" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {projectsOptions.map((region: { value: any; label: string }) => (
                                                        <SelectItem key={region.value} value={region.value}>
                                                            {region.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </TabsContent>

                        <TabsContent value="services" className="space-y-4">
                            <FormField
                                control={form.control}
                                name="services"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Services</FormLabel>
                                        <FormControl>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select service" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {servicesOptions.map((region: { value: any; label: string }) => (
                                                        <SelectItem key={region.value} value={region.value}>
                                                            {region.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </TabsContent> */}

                        <TabsContent value="values" className="space-y-4">
                            {form.watch("values")?.map((_, index) => (
                                <div key={index} className="space-y-4 p-4 border rounded-md">
                                    <div className="flex justify-between items-center">
                                        <h4 className="text-sm font-medium">Value {index + 1}</h4>
                                        {index > 0 && (
                                            <Button type="button" variant="destructive" size="sm" onClick={() => removeItem("values", index)}>
                                                Remove
                                            </Button>
                                        )}
                                    </div>
                                    <FormField
                                        control={form.control}
                                        name={`values.${index}.title`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Title</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Enter value title" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name={`values.${index}.description`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Description</FormLabel>
                                                <FormControl>
                                                    <Textarea placeholder="Enter value description" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name={`values.${index}.icon`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Icon</FormLabel>
                                                <div className="flex items-center gap-2">
                                                    <FormControl>
                                                        <Input placeholder="Icon URL" {...field} />
                                                    </FormControl>
                                                    <div className="relative">
                                                        <Input
                                                            type="file"
                                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                                            onChange={handleFileUpload("icon", index, "values")}
                                                        />
                                                        <Button type="button" variant="outline" size="icon">
                                                            <Upload className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            ))}
                            <Button type="button" variant="outline" size="sm" onClick={() => addItem("values")}>
                                <Plus className="mr-2 h-4 w-4" /> Add Value
                            </Button>
                        </TabsContent>

                        <TabsContent value="features" className="space-y-4">
                            {form.watch("features")?.map((_, index) => (
                                <div key={index} className="space-y-4 p-4 border rounded-md">
                                    <div className="flex justify-between items-center">
                                        <h4 className="text-sm font-medium">Feature {index + 1}</h4>
                                        {index > 0 && (
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => removeItem("features", index)}
                                            >
                                                Remove
                                            </Button>
                                        )}
                                    </div>
                                    <FormField
                                        control={form.control}
                                        name={`features.${index}.title`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Title</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Enter feature title" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name={`features.${index}.description`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Description</FormLabel>
                                                <FormControl>
                                                    <Textarea placeholder="Enter feature description" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name={`features.${index}.icon`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Icon</FormLabel>
                                                <div className="flex items-center gap-2">
                                                    <FormControl>
                                                        <Input placeholder="Icon URL" {...field} />
                                                    </FormControl>
                                                    <div className="relative">
                                                        <Input
                                                            type="file"
                                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                                            onChange={handleFileUpload("icon", index, "features")}
                                                        />
                                                        <Button type="button" variant="outline" size="icon">
                                                            <Upload className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            ))}
                            <Button type="button" variant="outline" size="sm" onClick={() => addItem("features")}>
                                <Plus className="mr-2 h-4 w-4" /> Add Feature
                            </Button>
                        </TabsContent>
                    </Tabs>
                    {/* {
                        form.formState.errors.portfolio && (
                            <FormItem>
                                <FormLabel>Portfolio</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Enter portfolio URL"
                                        {...form.register("portfolio")}
                                    />
                                </FormControl>
                                <FormMessage>{form.formState.errors.portfolio.message}</FormMessage>
                            </FormItem>
                        )
                    } */}
                    <Separator />

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={
                            closeModal
                        }>
                            Cancel
                        </Button>
                        <Button type="submit">{mode === "create" ? "Create" : "Update"}</Button>
                    </DialogFooter>
                </form>
            </Form>
        </DialogContent>
    )
}
