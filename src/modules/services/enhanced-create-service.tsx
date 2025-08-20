/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable security/detect-object-injection */
/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Plus, Trash2, Eye, EyeOff, Save, RefreshCw } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { FileUpload } from "@/components/ui/file-upload"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { MultiSelect } from "@/components/ui/multi-select"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CategoryEnum, languages } from "@/data/categories-enums"
import serviceSchema, { type ServiceFormValues } from "@/modules/services/validation/service-schema"
import { ServicePreview } from "./service-preview"
import useTestimonials from "../main/hooks/use-testimonial"
import { useRouter } from "next/navigation"
import { useTranslation } from "react-i18next"



export default function EnhancedCreateService() {
    const [showPreview, setShowPreview] = useState(true)
    const [selectedLanguages, setSelectedLanguages] = useState<Set<string>>(new Set(["en", "ar"]))
    const [activeLanguage, setActiveLanguage] = useState("en")

    const [activeTab, setActiveTab] = useState("basic")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const { testimonials, isLoading, error } = useTestimonials()
    const router = useRouter()
    const testimonialOptions = !isLoading && testimonials?.data?.map((testimonial: any) => ({
        label: `${testimonial.name} - ${testimonial.content}`,
        value: testimonial._id,
    })) || []
    const form = useForm<ServiceFormValues>({
        resolver: zodResolver(serviceSchema),
        defaultValues: {
            name: {
                en: "",
                ar: "",
            },
            description: {
                en: "",
                ar: "",
            },
            testimonials: [],
            importance: [],
            category: "",
            techUsedInService: [],
            distingoshesUs: [],
            techUsedInServiceIcons: [],
            distingoshesUsIcons: [],
            seo: [],
            designPhase: {
                title: {
                    en: "",
                    ar: "",
                },
                desc: {
                    en: "",
                    ar: "",
                },
                satisfiedClientValues: {
                    title: {
                        en: "",
                        ar: "",
                    },
                },
                values: [],
            },
        },
    })

    // Watch form values for live preview
    const watchedValues = form.watch()

    // Calculate completion percentage
    const calculateProgress = () => {
        let completed = 0
        const total = 5

        if (watchedValues.name?.en && watchedValues.description?.en) completed++
        if ((watchedValues.importance?.length ?? 0) > 0 || (watchedValues.distingoshesUs?.length ?? 0) > 0) completed++
        if ((watchedValues.techUsedInService?.length ?? 0) > 0) completed++
        if ((watchedValues.seo?.length ?? 0) > 0) completed++
        if (watchedValues.designPhase?.title?.en || (watchedValues.designPhase?.values?.length ?? 0) > 0) completed++

        return (completed / total) * 100
    }

    const onSubmit = async (data: ServiceFormValues) => {
        setIsSubmitting(true)
        const formData = new FormData()
        // formData.append("title","")
        // formData.append("titleAr","")

        if (data.image) {
            formData.append("image", data.image)
        }
        if (data.designPhaseImage) {
            formData.append("designPhaseImage", data.designPhaseImage)
        }
        if (data.techUsedInServiceIcons && data.techUsedInServiceIcons.length > 0) {
            data.techUsedInServiceIcons.forEach((file) => {
                formData.append("techUsedInServiceIcons", file)
            })
        }
        if (data.distingoshesUsIcons && data.distingoshesUsIcons.length > 0) {
            data.distingoshesUsIcons.forEach((file) => {
                formData.append("distingoshesUsIcons", file)
            })
        }


        const appendToFormData = (obj: any, prefix = "") => {
            Object.keys(obj).forEach((key) => {
                if (["image", "designPhaseImage", "techUsedInServiceIcons", "distingoshesUsIcons"].includes(key)) return
                const value = obj[key]
                const formKey = prefix ? `${prefix}[${key}]` : key
                if (value === null || value === undefined) {
                    return
                }
                if (Array.isArray(value) || (typeof value === "object" && value !== null)) {
                    formData.append(formKey, JSON.stringify(value))
                } else {
                    formData.append(formKey, String(value))
                }
            })
        }

        try {
            appendToFormData(data)
            await fetch("/api/services", {
                method: "POST",
                body: formData,
            }).then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`)
                }
                toast.success("Service created successfully")
                return response.json()
            })
            form.reset()
        } catch (error) {
            console.error("Error creating service:", error)
            toast.error("Failed to create service")
        } finally {
            setIsSubmitting(false)
        }
    }

    // Helper functions for dynamic arrays
    const addImportance = () => {
        const current = form.getValues("importance") || []
        form.setValue("importance", [...current, { desc: { en: "", ar: "" } }])
    }

    const removeImportance = (index: number) => {
        const current = form.getValues("importance") || []
        form.setValue(
            "importance",
            current.filter((_, i) => i !== index),
        )
    }

    const addTechUsed = () => {
        const current = form.getValues("techUsedInService") || []
        form.setValue("techUsedInService", [...current, { title: { en: "", ar: "" }, desc: { en: "", ar: "" } }])
    }

    const removeTechUsed = (index: number) => {
        const current = form.getValues("techUsedInService") || []
        form.setValue(
            "techUsedInService",
            current.filter((_, i) => i !== index),
        )
    }

    const addDistinguishes = () => {
        const current = form.getValues("distingoshesUs") || []
        form.setValue("distingoshesUs", [...current, { description: { en: "", ar: "" } }])
    }

    const removeDistinguishes = (index: number) => {
        const current = form.getValues("distingoshesUs") || []
        form.setValue(
            "distingoshesUs",
            current.filter((_, i) => i !== index),
        )
    }

    const addSEO = () => {
        const current = form.getValues("seo") || []
        form.setValue("seo", [
            ...current,
            {
                language: "en",
                metaTitle: "",
                metaDescription: "",
                keywords: "",
                canonicalTag: "",
                structuredData: {
                    "@context": "https://schema.org",
                    "@type": "Service",
                    name: "",
                    description: "",
                    provider: {
                        "@type": "Organization",
                        name: "Your Company",
                        url: "https://yourwebsite.com",
                    },
                },
            },
        ])
    }

    const removeSEO = (index: number) => {
        const current = form.getValues("seo") || []
        form.setValue(
            "seo",
            current.filter((_, i) => i !== index),
        )
    }

    const addDesignValue = () => {
        const current = form.getValues("designPhase.values") || []
        form.setValue("designPhase.values", [...current, { title: { en: "", ar: "" }, desc: { en: "", ar: "" } }])
    }

    const removeDesignValue = (index: number) => {
        const current = form.getValues("designPhase.values") || []
        form.setValue(
            "designPhase.values",
            current.filter((_, i) => i !== index),
        )
    }

    const handleMainImageChange = (file: File | null) => {
        if (file) {
            form.setValue("image", file)
        }
    }

    const handleDesignPhaseImageChange = (file: File | null) => {
        if (file) {
            form.setValue("designPhaseImage", file)
        }
    }

    const handleTechIconChange = (file: File | null) => {
        if (file) {
            const current = form.getValues("techUsedInServiceIcons") || []
            form.setValue("techUsedInServiceIcons", [...current, file])
        }
    }

    const handleDistinguishesIconChange = (file: File | null) => {
        if (file) {
            const current = form.getValues("distingoshesUsIcons") || []
            form.setValue("distingoshesUsIcons", [...current, file])
        }
    }

    const saveDraft = () => {
        const draftData = form.getValues()
        localStorage.setItem("service-draft", JSON.stringify(draftData))
        toast.success("Draft saved successfully")
    }

    const loadDraft = () => {
        const draft = localStorage.getItem("service-draft")
        if (draft) {
            const draftData = JSON.parse(draft)
            form.reset(draftData)
            toast.success("Draft loaded successfully")
        }
    }
    const { t } = useTranslation()
    return (
        <div className="flex min-h-screen w-full bg-gray-50">
            {/* Form Section */}
            <div className={`${showPreview ? "w-1/2" : "w-full"} h-full border-r bg-white transition-all duration-300`}>
                <div className="p-6 space-y-4">
                    {/* Header */}
                    <div className="sticky top-0 bg-white pb-4 border-b z-10">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-bold">{t("services.create_service")}
                                        </h1>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            {t("services.create_service_description")}
                                        </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button type="button" variant="outline" size="sm" onClick={saveDraft}>
                                    <Save className="h-4 w-4 mr-2" />
                                    {t("services.save_draft")}
                                </Button>
                                <Button type="button" variant="outline" size="sm" onClick={loadDraft}>
                                    <RefreshCw className="h-4 w-4 mr-2" />
                                    {t("services.load_draft")}
                                </Button>
                                <Button type="button" variant="outline" size="sm" onClick={() => setShowPreview(!showPreview)}>
                                    {showPreview ? (
                                        <>
                                            <EyeOff className="h-4 w-4 mr-2" />
                                            {t("hide")}
                                        </>
                                    ) : (
                                        <>
                                            <Eye className="h-4 w-4 mr-2" />
                                             {t("show")}
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mt-4 space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <span>Form Completion</span>
                                <span>{Math.round(calculateProgress())}%</span>
                            </div>
                            <Progress value={calculateProgress()} className="h-2" />
                        </div>
                    </div>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                                <TabsList className="grid w-full grid-cols-5">
                                    <TabsTrigger value="basic" className="relative">
                                        Basic
                                        {watchedValues.name?.en && watchedValues.description?.en && (
                                            <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full" />
                                        )}
                                    </TabsTrigger>
                                    <TabsTrigger value="features" className="relative">
                                        Features
                                        {((watchedValues.importance?.length ?? 0) > 0 ||
                                            (watchedValues.distingoshesUs?.length ?? 0) > 0) && (
                                                <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full" />
                                            )}
                                    </TabsTrigger>
                                    <TabsTrigger value="tech" className="relative">
                                        Technology
                                        {(watchedValues.techUsedInService?.length ?? 0) > 0 && (
                                            <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full" />
                                        )}
                                    </TabsTrigger>
                                    <TabsTrigger value="seo" className="relative">
                                        SEO
                                        {(watchedValues.seo?.length ?? 0) > 0 && (
                                            <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full" />
                                        )}
                                    </TabsTrigger>
                                    <TabsTrigger value="design" className="relative">
                                        Design
                                        {(watchedValues.designPhase?.title?.en || (watchedValues.designPhase?.values?.length ?? 0) > 0) && (
                                            <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full" />
                                        )}
                                    </TabsTrigger>
                                </TabsList>

                                <TabsContent value="basic" className="space-y-4 mt-6">
                                    <div className="grid grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="name.en"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Service Title *</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="e.g., Web Development" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="name.ar"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Service Title (AR) *</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="تطوير المواقع" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <FormField
                                        control={form.control}
                                        name="description.en"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Description *</FormLabel>
                                                <FormControl>
                                                    <Textarea placeholder="Describe your service..." className="min-h-[100px]" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="description.ar"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Description (Arabic)</FormLabel>
                                                <FormControl>
                                                    <Textarea placeholder="وصف الخدمة..." className="min-h-[100px] text-right" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

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
                                                                {Object.keys(CategoryEnum.Services).map((categoryKey) => (
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
                                            name="testimonials"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Testimonials</FormLabel>
                                                    <FormControl>
                                                        <MultiSelect
                                                            options={testimonialOptions}
                                                            selected={field.value || []}
                                                            onChange={field.onChange}
                                                            placeholder="Select testimonials"
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className="space-y-4">
                                        <FormLabel>Main Service Image</FormLabel>
                                        <FileUpload
                                            value={form.watch("image")}
                                            onChange={handleMainImageChange}
                                            onBlur={() => form.trigger("image")}
                                        />
                                    </div>
                                </TabsContent>

                                {/* Features Tab */}
                                <TabsContent value="features" className="space-y-6 mt-6">
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <FormLabel className="text-base font-semibold">Importance Points</FormLabel>
                                            <Button type="button" variant="outline" size="sm" onClick={addImportance}>
                                                <Plus className="h-4 w-4 mr-2" />
                                                Add Point
                                            </Button>
                                        </div>
                                        {form.watch("importance")?.map((_, index) => (
                                            <div key={index} className="flex gap-2 p-4 border rounded-lg bg-gray-50">
                                                <FormField
                                                    control={form.control}
                                                    name={`importance.${index}.desc.en`}
                                                    render={({ field }) => (
                                                        <FormItem className="flex-1">
                                                            <FormControl>
                                                                <Input placeholder="e.g., High performance" {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name={`importance.${index}.desc.ar`}
                                                    render={({ field }) => (
                                                        <FormItem className="flex-1">
                                                            <FormControl>
                                                                <Input placeholder="الوصف باللغة العربية" {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <Button type="button" variant="outline" size="icon" onClick={() => removeImportance(index)}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>

                                    <Separator />

                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <FormLabel className="text-base font-semibold">What Distinguishes Us</FormLabel>
                                            <Button type="button" variant="outline" size="sm" onClick={addDistinguishes}>
                                                <Plus className="h-4 w-4 mr-2" />
                                                Add Point
                                            </Button>
                                        </div>
                                        {form.watch("distingoshesUs")?.map((_, index) => (
                                            <div key={index} className="flex gap-2 p-4 border rounded-lg bg-gray-50">
                                                <FormField
                                                    control={form.control}
                                                    name={`distingoshesUs.${index}.description.en`}
                                                    render={({ field }) => (
                                                        <FormItem className="flex-1">
                                                            <FormControl>
                                                                <Input placeholder="e.g., 24/7 support" {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name={`distingoshesUs.${index}.description.ar`}
                                                    render={({ field }) => (
                                                        <FormItem className="flex-1">
                                                            <FormControl>
                                                                <Input placeholder="وصف باللغة العربية" {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <Button type="button" variant="outline" size="icon" onClick={() => removeDistinguishes(index)}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="space-y-4">
                                        <FormLabel className="text-base font-semibold">Distinguishes Us Icons</FormLabel>
                                        <FileUpload
                                            value={null}
                                            onChange={handleDistinguishesIconChange}
                                            onBlur={() => form.trigger("distingoshesUsIcons")}
                                        />
                                        {(form.watch("distingoshesUsIcons") ?? []).length > 0 && (
                                            <Badge variant="secondary">
                                                {(form.watch("distingoshesUsIcons") ?? []).length} icon(s) uploaded
                                            </Badge>
                                        )}
                                    </div>
                                </TabsContent>

                                {/* Technology Tab */}
                                <TabsContent value="tech" className="space-y-6 mt-6">
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <FormLabel className="text-base font-semibold">Technologies Used in Service</FormLabel>
                                            <Button type="button" variant="outline" size="sm" onClick={addTechUsed}>
                                                <Plus className="h-4 w-4 mr-2" />
                                                Add Technology
                                            </Button>
                                        </div>
                                        {form.watch("techUsedInService")?.map((_, index) => (
                                            <div key={index} className="space-y-4 p-4 border rounded-lg bg-gray-50">
                                                <div className="flex gap-2 items-center justify-between w-full">
                                                    <FormField
                                                        control={form.control}
                                                        name={`techUsedInService.${index}.title.en`}
                                                        render={({ field }) => (
                                                            <FormItem className="flex-1">
                                                                <FormLabel>Technology Name</FormLabel>
                                                                <FormControl>
                                                                    <Input placeholder="e.g., React" {...field} />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                    <FormField
                                                        control={form.control}
                                                        name={`techUsedInService.${index}.title.ar`}
                                                        render={({ field }) => (
                                                            <FormItem className="flex-1">
                                                                <FormLabel>Technology Name (Arabic)</FormLabel>
                                                                <FormControl>
                                                                    <Input placeholder="التكنولوجيا بالعربية" {...field} />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                    <div className="flex mt-6 items-center">
                                                        <Button type="button" variant="outline" size="icon" onClick={() => removeTechUsed(index)}>
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <FormField
                                                        control={form.control}
                                                        name={`techUsedInService.${index}.desc.en`}
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>Description</FormLabel>
                                                                <FormControl>
                                                                    <Textarea placeholder="e.g., Great for UI" {...field} />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                    <FormField
                                                        control={form.control}
                                                        name={`techUsedInService.${index}.desc.ar`}
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>Description (Arabic)</FormLabel>
                                                                <FormControl>
                                                                    <Textarea placeholder="وصف التكنولوجيا بالعربية" {...field} />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="space-y-4">
                                        <FormLabel className="text-base font-semibold">Technology Icons</FormLabel>
                                        <FileUpload
                                            value={null}
                                            onChange={handleTechIconChange}
                                            onBlur={() => form.trigger("techUsedInServiceIcons")}
                                        />
                                        {(form.watch("techUsedInServiceIcons") ?? []).length > 0 && (
                                            <Badge variant="secondary">
                                                {(form.watch("techUsedInServiceIcons") ?? []).length} icon(s) uploaded
                                            </Badge>
                                        )}
                                    </div>
                                </TabsContent>

                                {/* SEO Tab */}
                                <TabsContent value="seo" className="space-y-6 mt-6">
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <FormLabel className="text-base font-semibold">SEO Settings</FormLabel>
                                            <Button type="button" variant="outline" size="sm" onClick={addSEO}>
                                                <Plus className="h-4 w-4 mr-2" />
                                                Add Language
                                            </Button>
                                        </div>
                                        {form.watch("seo")?.map((_, index) => (
                                            <div key={index} className="space-y-4 p-4 border rounded-lg bg-gray-50">
                                                <div className="flex items-center justify-between">
                                                    <h4 className="font-medium">SEO Configuration {index + 1}</h4>
                                                    <Button type="button" variant="outline" size="icon" onClick={() => removeSEO(index)}>
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                                <FormField
                                                    control={form.control}
                                                    name={`seo.${index}.language`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Language</FormLabel>
                                                            <FormControl>
                                                                <Select onValueChange={field.onChange} value={field.value}>
                                                                    <SelectTrigger>
                                                                        <SelectValue placeholder="Select language" />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        {languages.map((lang) => (
                                                                            <SelectItem key={lang.value} value={lang.value}>
                                                                                {lang.label}
                                                                            </SelectItem>
                                                                        ))}
                                                                    </SelectContent>
                                                                </Select>
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <div className="grid grid-cols-2 gap-4">
                                                    <FormField
                                                        control={form.control}
                                                        name={`seo.${index}.metaTitle`}
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
                                                        name={`seo.${index}.canonicalTag`}
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>Canonical URL</FormLabel>
                                                                <FormControl>
                                                                    <Input placeholder="https://yourwebsite.com/services/..." {...field} />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>
                                                <FormField
                                                    control={form.control}
                                                    name={`seo.${index}.metaDescription`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Meta Description</FormLabel>
                                                            <FormControl>
                                                                <Textarea placeholder="Enter meta description" {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name={`seo.${index}.keywords`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Keywords</FormLabel>
                                                            <FormControl>
                                                                <Input placeholder="keyword1, keyword2, keyword3" {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </TabsContent>

                                {/* Design Tab */}
                                <TabsContent value="design" className="space-y-6 mt-6">
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-medium">Design Phase</h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            <FormField
                                                control={form.control}
                                                name="designPhase.title.en"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Phase Title</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="e.g., Planning" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="designPhase.title.ar"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Phase Title (AR)</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="عنوان المرحلة بالعربية" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <FormField
                                                control={form.control}
                                                name="designPhase.desc.en"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Phase Description</FormLabel>
                                                        <FormControl>
                                                            <Textarea placeholder="e.g., Project wireframing" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="designPhase.desc.ar"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Phase Description (AR)</FormLabel>
                                                        <FormControl>
                                                            <Textarea placeholder="وصف المرحلة بالعربية" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <FormLabel className="text-base font-semibold">Design Values</FormLabel>
                                                <Button type="button" variant="outline" size="sm" onClick={addDesignValue}>
                                                    <Plus className="h-4 w-4 mr-2" />
                                                    Add Value
                                                </Button>
                                            </div>
                                            {form.watch("designPhase.values")?.map((_, index) => (
                                                <div key={index} className="space-y-2 p-4 border rounded-lg bg-gray-50">
                                                    <div className="flex gap-2">
                                                        <FormField
                                                            control={form.control}
                                                            name={`designPhase.values.${index}.title.en`}
                                                            render={({ field }) => (
                                                                <FormItem className="flex-1">
                                                                    <FormLabel>Value Title</FormLabel>
                                                                    <FormControl>
                                                                        <Input placeholder="e.g., Innovation" {...field} />
                                                                    </FormControl>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />
                                                        <FormField
                                                            control={form.control}
                                                            name={`designPhase.values.${index}.title.ar`}
                                                            render={({ field }) => (
                                                                <FormItem className="flex-1">
                                                                    <FormLabel>Value Title (AR)</FormLabel>
                                                                    <FormControl>
                                                                        <Input placeholder="عنوان القيمة بالعربية" {...field} />
                                                                    </FormControl>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="icon"
                                                            onClick={() => removeDesignValue(index)}
                                                            className="mt-8"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <FormField
                                                            control={form.control}
                                                            name={`designPhase.values.${index}.desc.en`}
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormLabel>Value Description</FormLabel>
                                                                    <FormControl>
                                                                        <Textarea placeholder="e.g., We create cutting-edge solutions" {...field} />
                                                                    </FormControl>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />
                                                        <FormField
                                                            control={form.control}
                                                            name={`designPhase.values.${index}.desc.ar`}
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormLabel>Value Description (AR)</FormLabel>
                                                                    <FormControl>
                                                                        <Textarea placeholder="وصف القيمة بالعربية" {...field} />
                                                                    </FormControl>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="space-y-4">
                                            <FormLabel className="text-base font-semibold">Design Phase Image</FormLabel>
                                            <FileUpload
                                                value={form.watch("designPhaseImage")}
                                                onChange={handleDesignPhaseImageChange}
                                                onBlur={() => form.trigger("designPhaseImage")}
                                            />
                                        </div>
                                    </div>
                                </TabsContent>
                            </Tabs>

                            <div className="flex gap-2 pt-4 border-t">
                                <Button type="button" variant="outline" onClick={
                                    () => router.push("/dashboard/services")
                                }>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={isSubmitting} className="flex-1">
                                    {isSubmitting ? "Creating..." : "Create Service"}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </div>

            {/* Preview Section */}
            {showPreview && (
                <div className="w-1/2 h-full overflow-y-auto bg-gray-50">
                    <ServicePreview data={watchedValues}
                        activeLanguage={activeLanguage} selectedLanguages={selectedLanguages} />                </div>
            )}
        </div>
    )
}
