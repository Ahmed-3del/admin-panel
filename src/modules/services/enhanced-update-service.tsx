

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable security/detect-object-injection */
/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Plus, Trash2, Eye, EyeOff, Languages } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import serviceSchema, { ServiceFormValues } from "./validation/service-schema"
import { FileUpload } from "@/components/ui/file-upload"
import { CategoryEnum } from "@/data/categories-enums"
import { ServicePreview } from "./service-preview"
import useGetService from "../main/hooks/use-get-service"
import { useTranslation } from "react-i18next"
// import useTestimonials from "../main/hooks/use-testimonial"

const languages = [
    { label: "English", value: "en" },
    { label: "العربية", value: "ar" },
]


// Multilingual Field Component
const MultilingualField = ({
    control,
    name,
    label,
    type = "input",
    placeholder = { en: "", ar: "" },
    required = false,
}: {
    control: any
    name: string
    label: string
    type?: "input" | "textarea"
    placeholder?: { en: string; ar: string }
    required?: boolean
}) => {
    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2">
                <Languages className="h-4 w-4" />
                <FormLabel className="text-base font-medium">
                    {label} {required && <span className="text-red-500">*</span>}
                </FormLabel>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* English Field */}
                <FormField
                    control={control}
                    name={`${name}.en`}
                    render={({ field }) => (
                        <FormItem>
                            <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-xs">
                                    EN
                                </Badge>
                                <FormLabel className="text-sm">English</FormLabel>
                            </div>
                            <FormControl>
                                {type === "textarea" ? (
                                    <Textarea placeholder={placeholder.en} className="min-h-[100px]" {...field} />
                                ) : (
                                    <Input placeholder={placeholder.en} {...field} />
                                )}
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Arabic Field */}
                <FormField
                    control={control}
                    name={`${name}.ar`}
                    render={({ field }) => (
                        <FormItem>
                            <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-xs">
                                    AR
                                </Badge>
                                <FormLabel className="text-sm">العربية</FormLabel>
                            </div>
                            <FormControl>
                                {type === "textarea" ? (
                                    <Textarea placeholder={placeholder.ar} className="min-h-[100px] text-right" dir="rtl" {...field} />
                                ) : (
                                    <Input placeholder={placeholder.ar} className="text-right" dir="rtl" {...field} />
                                )}
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
        </div>
    )
}

export default function EnhancedUpdateService({ serviceId }: { serviceId: any }) {
    const router = useRouter()
    const [showPreview, setShowPreview] = useState(true)
    const [activeTab, setActiveTab] = useState("basic")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const { t } = useTranslation()

    //  const { testimonials, isLoading: testimonialsLoading, error: testimonialsError } = useTestimonials()
    const { service, isLoading: isServiceLoading, error: serviceError } = useGetService(serviceId)
    const [selectedLanguages, setSelectedLanguages] = useState<Set<string>>(new Set(["en"]))
    const [activeLanguage, setActiveLanguage] = useState("en")
    //  const testimonialOptions =
    //      (!testimonialsLoading &&
    //          testimonials?.data?.map((testimonial: any) => ({
    //              label: `${testimonial.name} - ${testimonial.content}`,
    //              value: testimonial._id,
    //          }))) ||
    //      []

    // const filesToDelete = {
    //     image: false,
    //     designPhaseImage: false,
    //     techUsedInServiceIcons: [] as number[],
    //     distingoshesUsIcons: [] as number[],
    // }

    const addLanguage = (lang: string) => {
        setSelectedLanguages((prev) => new Set([...prev, lang]))
        setActiveLanguage(lang)
    }

    // const removeLanguage = (lang: string) => {
    //     if (selectedLanguages.size > 1) {
    //         const newLangs = new Set(selectedLanguages)
    //         newLangs.delete(lang)
    //         setSelectedLanguages(newLangs)
    //         if (activeLanguage === lang) {
    //             setActiveLanguage(Array.from(newLangs)[0])
    //         }
    //     }
    // }

    // const getLanguageLabel = (lang: string) => {
    //     const langMap: Record<string, string> = {
    //         en: "English",
    //         ar: "العربية",
    //     }
    //     return langMap[lang] || lang
    // }

    const form = useForm<ServiceFormValues>({
        resolver: zodResolver(serviceSchema),
        defaultValues: {
            name: {
                en: "",
                ar: ""
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

    useEffect(() => {
        if (service?.data) {
            const serviceData = service.data

            const availableLanguages = new Set<string>()

            if (serviceData.en) availableLanguages.add("en")
            if (serviceData.ar) availableLanguages.add("ar")
            setSelectedLanguages(availableLanguages)
            if (availableLanguages.has("en")) {
                setActiveLanguage("en")
            } else if (availableLanguages.has("ar")) {
                setActiveLanguage("ar")
            }

            //   Transform the data structure
            const transformedData = {
                name: {
                    en: serviceData.en?.name || "",
                    ar: serviceData.ar?.name || "",
                },
                description: {
                    en: serviceData.en?.description || "",
                    ar: serviceData.ar?.description || "",
                },
                category: serviceData.en?.category || serviceData.ar?.category || "",
                image: serviceData.en?.image?.url || serviceData.ar?.image?.url,
                testimonials: [],
                importance: [
                    ...(serviceData.en?.importance?.map((item: any) => ({
                        desc: { en: item.desc, ar: "" },
                    })) || []),
                    ...(serviceData.ar?.importance?.map((item: any, index: number) => {
                        const existing = serviceData.en?.importance?.[index]
                        return {
                            desc: {
                                en: existing?.desc || "",
                                ar: item.desc,
                            },
                        }
                    }) || []),
                ].reduce((acc: any[], curr: any, index: number) => {
                    if (index < Math.max(serviceData.en?.importance?.length || 0, serviceData.ar?.importance?.length || 0)) {
                        const enItem = serviceData.en?.importance?.[index]
                        const arItem = serviceData.ar?.importance?.[index]
                        acc.push({
                            desc: {
                                en: enItem?.desc || "",
                                ar: arItem?.desc || "",
                            },
                        })
                    }
                    return acc
                }, []),
                techUsedInService: [
                    ...(serviceData.en?.techUsedInService?.map((item: any, index: number) => {
                        const arItem = serviceData.ar?.techUsedInService?.[index]
                        return {
                            title: {
                                en: item.title,
                                ar: arItem?.title || "",
                            },
                            desc: {
                                en: item.desc,
                                ar: arItem?.desc || "",
                            },
                        }
                    }) || []),
                ],
                distingoshesUs: [
                    ...(serviceData.en?.distingoshesUs?.map((item: any, index: number) => {
                        const arItem = serviceData.ar?.distingoshesUs?.[index]
                        return {
                            description: {
                                en: item.description,
                                ar: arItem?.description || "",
                            },
                        }
                    }) || []),
                ],
                techUsedInServiceIcons: serviceData.en?.techUsedInService?.map((item: any) => item.icon).filter(Boolean) || [],
                distingoshesUsIcons: serviceData.en?.distingoshesUs?.map((item: any) => item.icon).filter(Boolean) || [],
                seo: [
                    ...(serviceData.en?.seo ? [serviceData.en.seo] : []),
                    ...(serviceData.ar?.seo ? [serviceData.ar.seo] : []),
                ],
                designPhase: {
                    title: {
                        en: serviceData.en?.designPhase?.title || "",
                        ar: serviceData.ar?.designPhase?.title || "",
                    },
                    desc: {
                        en: serviceData.en?.designPhase?.desc || "",
                        ar: serviceData.ar?.designPhase?.desc || "",
                    },
                    satisfiedClientValues: {
                        title: {
                            en: serviceData.en?.designPhase?.satisfiedClientValues?.title || "",
                            ar: serviceData.ar?.designPhase?.satisfiedClientValues?.title || "",
                        },
                    },
                    values: [
                        ...(serviceData.en?.designPhase?.values?.map((item: any, index: number) => {
                            const arItem = serviceData.ar?.designPhase?.values?.[index]
                            return {
                                title: {
                                    en: item.title,
                                    ar: arItem?.title || "",
                                },
                                desc: {
                                    en: item.desc,
                                    ar: arItem?.desc || "",
                                },
                            }
                        }) || []),
                    ],
                },
                designPhaseImage: serviceData.en?.designPhase?.image || serviceData.ar?.designPhase?.image,
            }

            form.reset(transformedData)
        }
    }, [service, form])

    const watchedValues = form.watch()

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

        formData.append("id", serviceId)
        formData.append("title", data.name.en)
        formData.append("title.ar", data.name.ar)

        if (data.image instanceof File) {
            formData.append("image", data.image)
        } else if (data.image && typeof data.image === "string") {
            formData.append("imageUrl", data.image)
        }

        if (data.designPhaseImage instanceof File) {
            formData.append("designPhaseImage", data.designPhaseImage)
        } else if (data.designPhaseImage && typeof data.designPhaseImage === "string") {
            formData.append("designPhaseImageUrl", data.designPhaseImage)
        }

        if (data.techUsedInServiceIcons && data.techUsedInServiceIcons.length > 0) {
            data.techUsedInServiceIcons.forEach((icon: string | Blob) => {
                if (icon instanceof File) {
                    formData.append("techUsedInServiceIcons", icon)
                } else if (typeof icon === "string") {
                    formData.append("techUsedInServiceIconUrls", icon)
                }
            })
        }

        if (data.distingoshesUsIcons && data.distingoshesUsIcons.length > 0) {
            data.distingoshesUsIcons.forEach((icon: string | Blob) => {
                if (icon instanceof File) {
                    formData.append("distingoshesUsIcons", icon)
                } else if (typeof icon === "string") {
                    formData.append("distingoshesUsIconUrls", icon)
                }
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
            await fetch(`/api/services/all/${serviceId}`, {
                method: "PUT",
                body: formData,
            }).then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`)
                }
                toast.success("Service updated successfully")
                return response.json()
            })
            router.push("/dashboard/services")
        } catch (error) {
            console.error("Error updating service:", error)
            toast.error("Failed to update service")
        } finally {
            setIsSubmitting(false)
        }
    }
    //  Helper functions for dynamic arrays
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

    if (isServiceLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
                    <p className="mt-4 text-gray-600">{t(`services.loading`)}</p>
                </div>
            </div>
        )
    }

    return (
        <div className="flex min-h-screen w-full bg-gray-50">
            {/* Form Section */}
            <div className={`${showPreview ? "w-1/2" : "w-full"} h-full border-r bg-white transition-all duration-300`}>
                <div className="p-6 space-y-4">
                    {/* Header */}
                    <div className="sticky top-0 bg-white pb-4 border-b z-10">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-bold">
                                    {t('services.edit_service', { defaultValue: 'Edit Service' }) || "Edit Service"}
                                </h1>
                                <p className="text-sm text-muted-foreground mt-1">{t('services.edit_service_description', { defaultValue: 'Edit your service details in multiple languages' })}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button type="button" variant="outline" size="sm" onClick={() => setShowPreview(!showPreview)}>
                                    {showPreview ? (
                                        <>
                                            <EyeOff className="h-4 w-4 mr-2" />
                                            {t("hide", { defaultValue: "Hide Preview" }) || "Hide Preview"}
                                        </>
                                    ) : (
                                        <>
                                            <Eye className="h-4 w-4 mr-2" />
                                            {t("show", {
                                                defaultValue: "Show Preview"
                                            })}
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
                                <TabsList className="grid w-full grid-cols-4">
                                    <TabsTrigger value="basic" className="relative">
                                        Basic Info
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
                                    <TabsTrigger value="design" className="relative">
                                        Design
                                        {(watchedValues.designPhase?.title?.en || (watchedValues.designPhase?.values?.length ?? 0) > 0) && (
                                            <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full" />
                                        )}
                                    </TabsTrigger>
                                </TabsList>

                                {/* Basic Info Tab */}
                                <TabsContent value="basic" className="space-y-6 mt-6">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <Languages className="h-5 w-5" />
                                                Basic Information
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-6">
                                            <MultilingualField
                                                control={form.control}
                                                name="name"
                                                label="Service Title"
                                                placeholder={{ en: "e.g., Web Development", ar: "تطوير المواقع" }}
                                                required
                                            />

                                            <MultilingualField
                                                control={form.control}
                                                name="description"
                                                label="Service Description"
                                                type="textarea"
                                                placeholder={{
                                                    en: "Describe your service in detail...",
                                                    ar: "وصف الخدمة بالتفصيل...",
                                                }}
                                                required
                                            />

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
                                            <div className="space-y-4">
                                                <FormLabel>Main Service Image</FormLabel>
                                                <FileUpload
                                                    value={form.watch("image")}
                                                    onChange={(file: File | null) => form.setValue("image", file || undefined)}
                                                    onBlur={() => form.trigger("image")}
                                                />
                                            </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                {/* Features Tab */}
                                <TabsContent value="features" className="space-y-6 mt-6">
                                    <Card>
                                        <CardHeader>
                                            <div className="flex items-center justify-between">
                                                <CardTitle className="flex items-center gap-2">
                                                    <Languages className="h-5 w-5" />
                                                    Importance Points
                                                </CardTitle>
                                                <Button type="button" variant="outline" size="sm" onClick={addImportance}>
                                                    <Plus className="h-4 w-4 mr-2" />
                                                    Add Point
                                                </Button>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            {form.watch("importance")?.map((_, index) => (
                                                <Card key={index} className="p-4">
                                                    <div className="flex items-start justify-between gap-4">
                                                        <div className="flex-1">
                                                            <MultilingualField
                                                                control={form.control}
                                                                name={`importance.${index}.desc`}
                                                                label={`Importance Point ${index + 1}`}
                                                                placeholder={{
                                                                    en: "e.g., High Performance",
                                                                    ar: "أداء عالي",
                                                                }}
                                                            />
                                                        </div>
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="icon"
                                                            onClick={() => removeImportance(index)}
                                                            className="mt-8"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </Card>
                                            ))}
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardHeader>
                                            <div className="flex items-center justify-between">
                                                <CardTitle className="flex items-center gap-2">
                                                    <Languages className="h-5 w-5" />
                                                    What Distinguishes Us
                                                </CardTitle>
                                                <Button type="button" variant="outline" size="sm" onClick={addDistinguishes}>
                                                    <Plus className="h-4 w-4 mr-2" />
                                                    Add Point
                                                </Button>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            {form.watch("distingoshesUs")?.map((_, index) => (
                                                <Card key={index} className="p-4">
                                                    <div className="flex items-start justify-between gap-4">
                                                        <div className="flex-1">
                                                            <MultilingualField
                                                                control={form.control}
                                                                name={`distingoshesUs.${index}.description`}
                                                                label={`Distinguishing Point ${index + 1}`}
                                                                placeholder={{
                                                                    en: "e.g., 24/7 Support",
                                                                    ar: "دعم على مدار الساعة",
                                                                }}
                                                            />
                                                        </div>
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="icon"
                                                            onClick={() => removeDistinguishes(index)}
                                                            className="mt-8"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </Card>
                                            ))}
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                {/* Technology Tab */}
                                <TabsContent value="tech" className="space-y-6 mt-6">
                                    <Card>
                                        <CardHeader>
                                            <div className="flex items-center justify-between">
                                                <CardTitle className="flex items-center gap-2">
                                                    <Languages className="h-5 w-5" />
                                                    Technologies Used
                                                </CardTitle>
                                                <Button type="button" variant="outline" size="sm" onClick={addTechUsed}>
                                                    <Plus className="h-4 w-4 mr-2" />
                                                    Add Technology
                                                </Button>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            {form.watch("techUsedInService")?.map((_, index) => (
                                                <Card key={index} className="p-4">
                                                    <div className="flex items-start justify-between gap-4">
                                                        <div className="flex-1 space-y-4">
                                                            <MultilingualField
                                                                control={form.control}
                                                                name={`techUsedInService.${index}.title`}
                                                                label={`Technology ${index + 1} - Name`}
                                                                placeholder={{
                                                                    en: "e.g., React",
                                                                    ar: "ريأكت",
                                                                }}
                                                            />
                                                            <MultilingualField
                                                                control={form.control}
                                                                name={`techUsedInService.${index}.desc`}
                                                                label={`Technology ${index + 1} - Description`}
                                                                type="textarea"
                                                                placeholder={{
                                                                    en: "e.g., Modern UI library for building interfaces",
                                                                    ar: "مكتبة واجهة مستخدم حديثة لبناء الواجهات",
                                                                }}
                                                            />
                                                        </div>
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="icon"
                                                            onClick={() => removeTechUsed(index)}
                                                            className="mt-8"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </Card>
                                            ))}
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                {/* Design Tab */}
                                <TabsContent value="design" className="space-y-6 mt-6">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <Languages className="h-5 w-5" />
                                                Design Phase Information
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-6">
                                            <MultilingualField
                                                control={form.control}
                                                name="designPhase.title"
                                                label="Phase Title"
                                                placeholder={{
                                                    en: "e.g., Planning & Design",
                                                    ar: "التخطيط والتصميم",
                                                }}
                                            />

                                            <MultilingualField
                                                control={form.control}
                                                name="designPhase.desc"
                                                label="Phase Description"
                                                type="textarea"
                                                placeholder={{
                                                    en: "Detailed description of the design phase...",
                                                    ar: "وصف مفصل لمرحلة التصميم...",
                                                }}
                                            />

                                            <MultilingualField
                                                control={form.control}
                                                name="designPhase.satisfiedClientValues.title"
                                                label="Satisfied Clients"
                                                placeholder={{
                                                    en: "e.g., 100+ Happy Clients",
                                                    ar: "أكثر من 100 عميل راضي",
                                                }}
                                            />
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardHeader>
                                            <div className="flex items-center justify-between">
                                                <CardTitle className="flex items-center gap-2">
                                                    <Languages className="h-5 w-5" />
                                                    Design Values
                                                </CardTitle>
                                                <Button type="button" variant="outline" size="sm" onClick={addDesignValue}>
                                                    <Plus className="h-4 w-4 mr-2" />
                                                    Add Value
                                                </Button>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            {form.watch("designPhase.values")?.map((_, index) => (
                                                <Card key={index} className="p-4">
                                                    <div className="flex items-start justify-between gap-4">
                                                        <div className="flex-1 space-y-4">
                                                            <MultilingualField
                                                                control={form.control}
                                                                name={`designPhase.values.${index}.title`}
                                                                label={`Value ${index + 1} - Title`}
                                                                placeholder={{
                                                                    en: "e.g., Innovation",
                                                                    ar: "الابتكار",
                                                                }}
                                                            />
                                                            <MultilingualField
                                                                control={form.control}
                                                                name={`designPhase.values.${index}.desc`}
                                                                label={`Value ${index + 1} - Description`}
                                                                type="textarea"
                                                                placeholder={{
                                                                    en: "e.g., We create cutting-edge solutions",
                                                                    ar: "نحن نبتكر حلولاً متطورة",
                                                                }}
                                                            />
                                                        </div>
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
                                                </Card>
                                            ))}
                                        </CardContent>
                                    </Card>
                                </TabsContent>
                            </Tabs>

                            <div className="flex gap-2 pt-4 border-t">
                                <Button type="button" variant="outline" onClick={() => router.push("/dashboard/services")}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={isSubmitting} className="flex-1">
                                    {isSubmitting ? "Updating..." : "Update Service"}
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
                        activeLanguage={activeLanguage} selectedLanguages={selectedLanguages} />
                </div>
            )}
        </div>
    )
}
