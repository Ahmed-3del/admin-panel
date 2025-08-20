/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable security/detect-object-injection */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import * as React from "react"

import Image from "next/image"

import { zodResolver } from "@hookform/resolvers/zod"
import { Plus, Trash2 } from "lucide-react"
import { set, useForm } from "react-hook-form"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { FileUpload } from "@/components/ui/file-upload"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { MultiSelect } from "@/components/ui/multi-select"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { CategoryEnum, statusOptions, platformOptions, screenTypeOptions, regionOptions } from "@/data/categories-enums"
import { useModal } from "@/hooks/use-modal"
import useGetContacts from "@/modules/contacts/hooks/use-get-contacts"

import projectSchema, { ProjectFormValues } from "../validation/project-sgema"

interface CreateProjectModalProps {
    onConfirm?: (data: ProjectFormValues) => Promise<void>
    refetch?: () => void
}
export function CreateProjectModal({ refetch }: CreateProjectModalProps) {
    const { closeModal } = useModal()
    const { contacts, isLoading: loadingContacts } = useGetContacts()
    const [responsiveImageFile, setResponsiveImageFile] = React.useState<File | null>(null)
    const form = useForm<ProjectFormValues>({
        resolver: zodResolver(projectSchema),
        defaultValues: {
            projectNameEn: "",
            projectNameAr: "",
            descriptionEn: "",
            descriptionAr: "",
            nameEn: "",
            nameAr: "",
            category: "",
            designScreens: {
                app: undefined,
                web: undefined,
            },
            images: [],
            client: "",
            status: "",
            seo: {
                metaDescription: "",
                metaTitle: "",
            },
            region: "",
            screenTypes: [],
            screenshots: [],
            platform: "",
            responsive: {
                image: undefined,
                title: {
                    en: "",
                    ar: "",
                },
                description: {
                    en: "",
                    ar: "",
                },
            },
            url: "",
            hero: {
                region: "",
                tech: [],
                platforms: [],
                downloads: "",
                description: {
                    en: "",
                    ar: "",
                },
                title: {
                    en: "",
                    ar: "",
                },
            },
            contacts: [],
        }

    })
    const onSubmit = async (data: ProjectFormValues) => {
        const formData = new FormData()

        const images = data.images || []
        images.forEach((image: any, index: number) => {
            if (image?.file instanceof File) {
                formData.append('images', image.file)
            }
            if (image?.url) {
                formData.append(`images[${index}].url`, image.url)
            }
            if (image?.altText) {
                formData.append(`images[${index}].altText`, image.altText)
            }
        })

        if (responsiveImageFile) {
            formData.append('responsive.image', responsiveImageFile)
        }

        const dataWithoutFiles = { ...data }
        delete dataWithoutFiles.images

        const appendToFormData = (obj: any, formData: FormData, prefix = "") => {
            Object.keys(obj).forEach((key) => {
                const value = obj[key];

                if (value === null || value === undefined) return;

                let formKey = prefix ? `${prefix}.${key}` : key;

                if (prefix && (
                    prefix.includes('content') ||
                    prefix.includes('hero') ||
                    prefix.includes('responsive') ||
                    prefix.includes('seo')
                )) {
                    formKey = prefix ? `${prefix}.${key}` : key;
                } else if (prefix && !prefix.includes('.')) {
                    formKey = `${prefix}[${key}]`;
                }

                if (Array.isArray(value)) {
                    if (value.length === 0) {
                        formData.append(`${formKey}[]`, '');
                    } else {
                        value.forEach((item, index) => {
                            if (typeof item === "object" && item !== null && !(item instanceof File)) {
                                appendToFormData(item, formData, `${formKey}[${index}]`);
                            } else {
                                if (key === 'platforms' || key === 'screenTypes') {
                                    formData.append(`${formKey}[]`, String(item));
                                } else {
                                    formData.append(`${formKey}[${index}]`, String(item));
                                }
                            }
                        });
                    }
                } else if (value instanceof File) {
                    formData.append(formKey, value);
                } else if (typeof value === "object" && value !== null) {
                    appendToFormData(value, formData, formKey);
                } else {
                    formData.append(formKey, String(value));
                }
            });
        };

        appendToFormData(dataWithoutFiles, formData);

        for (const [key, value] of formData.entries()) {
            console.log(`${key}:`, value instanceof File ? `File: ${value.name}` : value);
        }

        try {
            const response = await fetch("/api/projects", {
                method: "POST",
                body: formData,
            })
            const result = await response.json()
            if (!response.ok) {
                toast.error(result.message || "Something went wrong");

                console.log("Error response data:", result.errors || result.message || "Unknown error");
            }
            toast.success("Project created successfully!")
            refetch?.()
            form.reset()
            setResponsiveImageFile(null)
            closeModal()

        } catch (error) {
            console.error("Error submitting form:", error)
            toast.error(`Failed to create project: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
    }
    const contactOptions = contacts?.map((contact: { name: any; email: any; _id: any }) => ({
        label: contact.name,
        value: contact._id,
        id: contact._id,
    }))

    const handleFileChange = async (file: File | null) => {
        if (file) {
            try {
                const fileData = await new Promise<string>((resolve, reject) => {
                    const reader = new FileReader()
                    reader.onload = () => resolve(reader.result as string)
                    reader.onerror = reject
                    reader.readAsDataURL(file)
                })

                const currentImages = form.getValues("images") ?? []
                const newImage = {
                    file: file,
                    data: fileData,
                    name: file.name,
                    type: file.type,
                    size: file.size,
                    altText: file.name
                }

                form.setValue("images", [...currentImages, newImage])
                form.trigger("images")
            } catch (error) {
                console.error("Error reading file:", error)
            }
        }
    }

    const handleResponsiveImageUpload = async (file: File | null) => {
        if (file) {
            try {
                const fileData = await new Promise<string>((resolve, reject) => {
                    const reader = new FileReader()
                    reader.onload = () => resolve(reader.result as string)
                    reader.onerror = reject
                    reader.readAsDataURL(file)
                })
                setResponsiveImageFile(file)

                form.setValue("responsive.image", fileData)
                form.trigger("responsive.image")
            } catch (error) {
                console.error("Error reading responsive image file:", error)
            }
        }
    }

    const removeImage = (index: number) => {
        const currentImages = form.getValues("images") ?? []
        form.setValue(
            "images",
            currentImages.filter((_: any, i: number) => i !== index),
        )
        form.trigger("images")
    }

    const removeResponsiveImage = () => {
        setResponsiveImageFile(null)
        form.setValue("responsive.image", "")
        form.trigger("responsive.image")
    }

    const addTechItem = () => {
        const currentTech = form.getValues("hero.tech") ?? []
        form.setValue("hero.tech", [...currentTech, { icon: "" }])
    }

    const removeTechItem = (index: number) => {
        const currentTech = form.getValues("hero.tech") ?? []
        form.setValue(
            "hero.tech",
            currentTech.filter((_: any, i: number) => i !== index),
        )
    }

    const addScreenshot = () => {
        const currentScreenshots = form.getValues("screenshots") ?? []
        form.setValue("screenshots", [...currentScreenshots, { url: "" }])
    }

    const removeScreenshot = (index: number) => {
        const currentScreenshots = form.getValues("screenshots") ?? []
        form.setValue(
            "screenshots",
            currentScreenshots.filter((_: any, i: number) => i !== index),
        )
    }

    return (
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
                <DialogTitle>Create New Project</DialogTitle>
                <DialogDescription>Add a new project to your dashboard. Fill in the details below.</DialogDescription>
            </DialogHeader>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <Tabs defaultValue="basic" className="w-full">
                        <TabsList className="grid w-full grid-cols-4">
                            <TabsTrigger value="basic">Basic</TabsTrigger>
                            <TabsTrigger value="content">Content</TabsTrigger>
                            <TabsTrigger value="media">Media</TabsTrigger>
                            <TabsTrigger value="advanced">Advanced</TabsTrigger>
                        </TabsList>

                        <TabsContent value="basic" className="space-y-4">

                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="projectNameEn"
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
                                    name="projectNameAr"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Project Name (AR) *</FormLabel>
                                            <FormControl>
                                                <Input placeholder="أدخل اسم المشروع" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="descriptionEn"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Description (EN) *</FormLabel>
                                            <FormControl>
                                                <Textarea placeholder="Enter project description" className="min-h-[80px]" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="descriptionAr"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Description (AR) *</FormLabel>
                                            <FormControl>
                                                <Textarea placeholder="أدخل وصف المشروع" className="min-h-[80px]" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="category"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Category *</FormLabel>
                                            <FormControl>
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select category" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {Object.keys(CategoryEnum.Projects).map((categoryKey) => (
                                                            <SelectItem key={categoryKey} value={categoryKey}>
                                                                {categoryKey}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="status"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Status</FormLabel>
                                            <FormControl>
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select status" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {statusOptions.map((status: { value: any; label: string }) => (
                                                            <SelectItem key={status.value} value={status.value}>
                                                                {status.label}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid w-full">
                                <FormField
                                    control={form.control}
                                    name="platform"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Platform</FormLabel>
                                            <FormControl>
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select platform" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {platformOptions.map((platform: { value: any; label: string }) => (
                                                            <SelectItem key={platform.value} value={platform.value}>
                                                                {platform.label}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                            </div>
                            <div className="grid grid-cols-2 gap-4">

                                <FormField
                                    control={form.control}
                                    name="region"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Region</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter region " {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="client"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Client</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter client name" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>


                            <FormField
                                control={form.control}
                                name="url"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Project URL</FormLabel>
                                        <FormControl>
                                            <Input placeholder="https://example.com" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </TabsContent>

                        <TabsContent value="content" className="space-y-4">
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium">Hero Section</h3>


                                <FormField
                                    control={form.control}
                                    name="hero.title.en"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Hero Title (En)</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter hero title" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="hero.title.ar"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Hero Title (AR)</FormLabel>
                                            <FormControl>
                                                <Input placeholder="أدخل عنوان البطل" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />



                                <FormField
                                    control={form.control}
                                    name="hero.description.en"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Hero Description</FormLabel>
                                            <FormControl>
                                                <Textarea placeholder="Enter hero description" className="min-h-[80px]" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="hero.description.ar"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Hero Description (AR)</FormLabel>
                                            <FormControl>
                                                <Textarea placeholder="أدخل وصف البطل" className="min-h-[80px]" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="hero.downloads"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Downloads</FormLabel>
                                            <FormControl>
                                                <Input placeholder="e.g., 10,000+" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="hero.platforms"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Hero Platforms</FormLabel>
                                            <FormControl>
                                                <MultiSelect
                                                    options={platformOptions}
                                                    selected={field.value ?? []}
                                                    onChange={field.onChange}
                                                    placeholder="Select platforms"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="space-y-2">
                                    <FormLabel>Tech Stack</FormLabel>
                                    {form.watch("hero.tech")?.map((_: any, index: number) => (
                                        <div key={index} className="flex gap-2">
                                            <FormField
                                                control={form.control}
                                                name={`hero.tech.${index}.icon`}
                                                render={({ field }) => (
                                                    <FormItem className="flex-1">
                                                        <FormControl>
                                                            <Input placeholder="Icon URL or name" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <Button type="button" variant="outline" size="icon" onClick={() => removeTechItem(index)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                    <Button type="button" variant="outline" size="sm" onClick={addTechItem} className="w-full">
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add Tech Item
                                    </Button>
                                </div>
                            </div>

                            <Separator />

                            <div className="space-y-4">
                                <h3 className="text-lg font-medium">SEO</h3>
                                <FormField
                                    control={form.control}
                                    name="seo.metaTitle"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Meta Title</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter meta title" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="seo.metaDescription"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Meta Description</FormLabel>
                                            <FormControl>
                                                <Textarea placeholder="Enter meta description" className="min-h-[80px]" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </TabsContent>
                        <TabsContent value="media" className="space-y-4">
                            <div className="space-y-4">
                                <FormLabel>Project Images</FormLabel>
                                <FileUpload value={null} onChange={handleFileChange} onBlur={() => form.trigger("images")} />

                                {(form.watch("images") ?? []).length > 0 && (
                                    <div className="space-y-2">
                                        <div className="text-sm text-muted-foreground">
                                            {(form.watch("images") ?? []).length} image(s) uploaded
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            {(form.watch("images") ?? []).map((image: any, index: number) => (
                                                <div key={index} className="relative border rounded-lg p-2">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm truncate">{image.name || image.altText}</span>
                                                        <Button type="button" variant="ghost" size="sm" onClick={() => removeImage(index)}>
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                    {image.data && (
                                                        <Image
                                                            key={index}
                                                            width={100}
                                                            height={80}
                                                            loading="lazy"
                                                            src={image.data || "/placeholder.svg"}
                                                            alt={image.altText}
                                                            className="w-full h-20 object-cover rounded mt-2"
                                                        />
                                                    )}
                                                    <div className="text-xs text-muted-foreground mt-1">
                                                        {image.type} • {Math.round((image.size || 0) / 1024)}KB
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                <FormMessage />
                            </div>

                            <Separator />

                            <div className="space-y-4">
                                <h3 className="text-lg font-medium">Design Screens</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="designScreens.app"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>App Design URL</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="https://figma.com/..." {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="designScreens.web"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Web Design URL</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="https://figma.com/..." {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                            <Separator />

                            <div className="space-y-4">
                                <h3 className="text-lg font-medium">Screenshots</h3>
                                {form.watch("screenshots")?.map((_: any, index: number) => (
                                    <div key={index} className="flex gap-2">
                                        <FormField
                                            control={form.control}
                                            name={`screenshots.${index}.url`}
                                            render={({ field }) => (
                                                <FormItem className="flex-1">
                                                    <FormControl>
                                                        <Input placeholder="Screenshot URL" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <Button type="button" variant="outline" size="icon" onClick={() => removeScreenshot(index)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                                <Button type="button" variant="outline" size="sm" onClick={addScreenshot} className="w-full">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Screenshot
                                </Button>
                            </div>

                            <Separator />

                            <div className="space-y-4">
                                <h3 className="text-lg font-medium">Responsive Design</h3>
                                <FormField
                                    control={form.control}
                                    name="responsive.title.en"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Responsive Title</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter responsive design title" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="responsive.title.ar"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Responsive Title (AR)</FormLabel>
                                            <FormControl>
                                                <Input placeholder="أدخل عنوان التصميم المتجاوب" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="responsive.description.en"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Responsive Description</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Enter responsive design description"
                                                    className="min-h-[80px]"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="responsive.description.ar"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Responsive Description (AR)</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="أدخل وصف التصميم المتجاوب"
                                                    className="min-h-[80px]"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className="space-y-4">
                                    <FormLabel>Responsive Image</FormLabel>
                                    <FileUpload
                                        value={null}
                                        onChange={handleResponsiveImageUpload}
                                        onBlur={() => form.trigger("responsive.image")}
                                    />
                                    {form.watch("responsive.image") && (
                                        <div className="relative border rounded-lg p-2">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm truncate">
                                                    {responsiveImageFile?.name || "Responsive Image"}
                                                </span>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={removeResponsiveImage}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                            <Image
                                                width={100}
                                                height={80}
                                                loading="lazy"
                                                src={form.watch("responsive.image") || "/placeholder.svg"}
                                                alt="Responsive Design Preview"
                                                className="w-full h-20 object-cover rounded mt-2"
                                            />
                                            {responsiveImageFile && (
                                                <div className="text-xs text-muted-foreground mt-1">
                                                    {responsiveImageFile.type} • {Math.round(responsiveImageFile.size / 1024)}KB
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    <FormMessage />
                                </div>
                            </div>
                        </TabsContent>
                        <TabsContent value="advanced" className="space-y-4">
                            <FormField
                                control={form.control}
                                name="screenTypes"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Screen Types</FormLabel>
                                        <FormControl>
                                            <MultiSelect
                                                options={screenTypeOptions}
                                                selected={field.value ?? []}
                                                onChange={field.onChange}
                                                placeholder="Select screen types"
                                            />
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
                                name="nameEn"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Internal Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter internal project name" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="nameAr"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Internal Name (AR)</FormLabel>
                                        <FormControl>
                                            <Input placeholder="أدخل اسم المشروع الداخلي" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="hero.region"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Hero Region</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter hero region" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </TabsContent>
                    </Tabs>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={closeModal}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={form.formState.isSubmitting || !form.formState.isValid
                            || !form.formState.errors
                        } className="ml-2">
                            {form.formState.isSubmitting ? "Creating..." : "Create Project"}
                        </Button>
                    </DialogFooter>
                </form>
            </Form>
        </DialogContent>
    )
}