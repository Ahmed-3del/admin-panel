// /* eslint-disable import/no-cycle */
// /* eslint-disable @typescript-eslint/no-unnecessary-condition */
// /* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
// /* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable @typescript-eslint/no-unused-vars */
// /* eslint-disable complexity */
// /* eslint-disable max-lines */
// /* eslint-disable security/detect-object-injection */
// "use client"
// import { useEffect } from "react"

// import Image from "next/image"

// import { zodResolver } from "@hookform/resolvers/zod"
// import { Plus, Trash2, X } from "lucide-react"
// import { useForm } from "react-hook-form"

// import { Button } from "@/components/ui/button"
// import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
// import { FileUpload } from "@/components/ui/file-upload"
// import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
// import { Input } from "@/components/ui/input"
// import { MultiSelect } from "@/components/ui/multi-select"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Separator } from "@/components/ui/separator"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Textarea } from "@/components/ui/textarea"
// import { ModalProps } from "@/context/modal-context-provider"
// import { CategoryEnum, languages } from "@/data/categories-enums"
// import { useModal } from "@/hooks/use-modal"
// import { getUrlImage } from "@/lib/utils"

// import serviceSchema, { ServiceFormValues } from "../validation/service-schema"

// const testimonialOptions = [
//     { label: "John Doe - Great service!", value: "65e85cb858a9bf052e690365" },
//     { label: "Jane Smith - Excellent work!", value: "65e85cb858a9bf052e690366" },
//     { label: "Mike Johnson - Highly recommended!", value: "65e85cb858a9bf052e690367" },
// ]

// interface UpdateServiceModalProps {
//     service: ServiceFormValues
//     serviceId: string
//     onConfirm?: (data: ServiceFormValues) => Promise<void>
//     refetch?: () => void
// }

// export function UpdateServiceModal({ data, serviceId, refetch }: ModalProps) {
//     const { closeModal } = useModal()

//     const filesToDelete = {
//         image: false,
//         designPhaseImage: false,
//         techUsedInServiceIcons: [] as number[],
//         distingoshesUsIcons: [] as number[],
//     }

//     const form = useForm<ServiceFormValues>({
//         resolver: zodResolver(serviceSchema),
//         defaultValues: {
//             title: "",
//             titleAr: "",
//             testimonials: [],
//             importance: [],
//             category: "",
//             techUsedInService: [],
//             distingoshesUs: [],
//             techUsedInServiceIcons: [],
//             distingoshesUsIcons: [],
//             seo: [],
//             description: {
//                 en: "",
//                 ar: "",
//             },
//             designPhase: {
//                 title: {
//                     en: "",
//                     ar: "",
//                 },
//                 desc: {
//                     en: "",
//                     ar: "",
//                 },
//                 satisfiedClientValues: {
//                     title: {
//                         en: "",
//                         ar: "",
//                     },
//                 },
//                 values: [],
//             },
//         },
//     })
//     useEffect(() => {
//         if (data) {
//             form.reset({
//                 ...data,
//                 image: data.image || undefined,
//                 designPhaseImage: data.designPhaseImage || undefined,
//                 techUsedInServiceIcons: data.techUsedInServiceIcons || [],
//                 distingoshesUsIcons: data.distingoshesUsIcons || [],
//                 // Ensure all array fields are initialized as empty arrays if they are null or undefined
//                 testimonials: data.testimonials || [],
//                 importance: data.importance || [],
//                 techUsedInService: data.techUsedInService || [],
//                 distingoshesUs: data.distingoshesUs || [],
//                 // FIX: Ensure data.seo is always an array
//                 seo: Array.isArray(data.seo) ? data.seo : (data.seo ? [data.seo] : []),
//                 designPhase: {
//                     ...data.designPhase,
//                     values: data.designPhase?.values || [],
//                 },
//             })
//         }
//     }, [data, form])


//     const onSubmit = async (data: ServiceFormValues) => {
//         const formData = new FormData()

//         formData.append("id", serviceId)

//         if (data.image instanceof File) {
//             formData.append("image", data.image)
//         } else if (data.image && typeof data.image === "string") {
//             formData.append("imageUrl", data.image)
//         }

//         if (data.designPhaseImage instanceof File) {
//             formData.append("designPhaseImage", data.designPhaseImage)
//         } else if (data.designPhaseImage && typeof data.designPhaseImage === "string") {
//             formData.append("designPhaseImageUrl", data.designPhaseImage)
//         }

//         if (data.techUsedInServiceIcons && data.techUsedInServiceIcons.length > 0) {
//             data.techUsedInServiceIcons.forEach((icon: string | Blob) => {
//                 if (icon instanceof File) {
//                     formData.append("techUsedInServiceIcons", icon)
//                 } else if (typeof icon === "string") {
//                     formData.append("techUsedInServiceIconUrls", icon)
//                 }
//             })
//         }

//         if (data.distingoshesUsIcons && data.distingoshesUsIcons.length > 0) {
//             data.distingoshesUsIcons.forEach((icon: string | Blob) => {
//                 if (icon instanceof File) {
//                     formData.append("distingoshesUsIcons", icon)
//                 } else if (typeof icon === "string") {
//                     formData.append("distingoshesUsIconUrls", icon)
//                 }
//             })
//         }

//         if (filesToDelete.image) {
//             formData.append("deleteImage", "true")
//         }
//         if (filesToDelete.designPhaseImage) {
//             formData.append("deleteDesignPhaseImage", "true")
//         }
//         if (filesToDelete.techUsedInServiceIcons.length > 0) {
//             formData.append("deleteTechIcons", JSON.stringify(filesToDelete.techUsedInServiceIcons))
//         }
//         if (filesToDelete.distingoshesUsIcons.length > 0) {
//             formData.append("deleteDistinguishesIcons", JSON.stringify(filesToDelete.distingoshesUsIcons))
//         }

//         // Add Arabic title to formData
//         formData.append("title[ar]", data.titleAr ?? "")

//         const appendToFormData = (obj: any, prefix = "") => {
//             Object.keys(obj).forEach((key) => {
//                 if (["image", "designPhaseImage", "techUsedInServiceIcons", "distingoshesUsIcons"].includes(key)) return

//                 const value = obj[key]
//                 const formKey = prefix ? `${prefix}[${key}]` : key

//                 if (value === null || value === undefined) {
//                     return
//                 }

//                 if (Array.isArray(value) || (typeof value === "object" && value !== null)) {
//                     formData.append(formKey, JSON.stringify(value))
//                 } else {
//                     formData.append(formKey, String(value))
//                 }
//             })
//         }

//         try {
//             appendToFormData(data)
//             for (const pair of formData.entries()) {
//                 console.log(pair[0], pair[1])
//             }
//             await fetch(`/api/services/${serviceId}`, {
//                 method: "PUT",
//                 body: formData,
//             }).then((response) => {
//                 if (!response.ok) {
//                     throw new Error(`HTTP error! status: ${response.status}`)
//                 }
//                 return response.json()
//             })
//             refetch?.()
//             closeModal()
//             console.log("Service updated with data:", data)
//         } catch (error) {
//             console.error("Error updating service:", error)
//         }
//     }

//     // Helper functions for dynamic arrays
//     const addImportance = () => {
//         const current = form.getValues("importance") || []
//         form.setValue("importance", [...current, {
//             desc: {
//                 en: "",
//                 ar: "",
//             }
//         }])
//     }

//     const removeImportance = (index: number) => {
//         const current = form.getValues("importance") || []
//         form.setValue(
//             "importance",
//             current.filter((_: any, i: number) => i !== index),
//         )
//     }

//     const addTechUsed = () => {
//         const current = form.getValues("techUsedInService") || []
//         form.setValue("techUsedInService", [...current, {
//             title: {
//                 en: "",
//                 ar: "",
//             }, desc: {
//                 en: "",
//                 ar: "",
//             }
//         }])
//     }

//     const removeTechUsed = (index: number) => {
//         const current = form.getValues("techUsedInService") || []
//         form.setValue(
//             "techUsedInService",
//             current.filter((_: any, i: number) => i !== index),
//         )
//     }

//     const addDistinguishes = () => {
//         const current = form.getValues("distingoshesUs") || []
//         form.setValue("distingoshesUs", [...current, {
//             description: {
//                 en: "",
//                 ar: "",
//             }
//         }])
//     }

//     const removeDistinguishes = (index: number) => {
//         const current = form.getValues("distingoshesUs") || []
//         form.setValue(
//             "distingoshesUs",
//             current.filter((_: any, i: number) => i !== index),
//         )
//     }

//     const addSEO = () => {
//         const current = form.getValues("seo") || []
//         form.setValue("seo", [
//             ...current,
//             {
//                 language: "en",
//                 metaTitle: "",
//                 metaDescription: "",
//                 keywords: "",
//                 canonicalTag: "",
//                 structuredData: {
//                     "@context": "https://schema.org",
//                     "@type": "Service",
//                     name: "",
//                     description: "",
//                     provider: {
//                         "@type": "Organization",
//                         name: "Your Company",
//                         url: "https://yourwebsite.com",
//                     },
//                 },
//             },
//         ])
//     }

//     const removeSEO = (index: number) => {
//         const current = form.getValues("seo") || []
//         form.setValue(
//             "seo",
//             current.filter((_: any, i: number) => i !== index),
//         )
//     }

//     const addDesignValue = () => {
//         const current = form.getValues("designPhase.values") || []
//         form.setValue("designPhase.values", [...current, {
//             title: {
//                 en: "",
//                 ar: "",
//             }, desc: {
//                 en: "",
//                 ar: "",
//             }
//         }])
//     }

//     const removeDesignValue = (index: number) => {
//         const current = form.getValues("designPhase.values") || []
//         form.setValue(
//             "designPhase.values",
//             current.filter((_: any, i: number) => i !== index),
//         )
//     }

//     const handleMainImageChange = (file: File | null) => {
//         if (file) {
//             form.setValue("image", file)
//         } else {
//             form.setValue("image", undefined)
//             filesToDelete.image = true
//         }
//     }

//     const handleDesignPhaseImageChange = (file: File | null) => {
//         if (file) {
//             form.setValue("designPhaseImage", file)
//         } else {
//             form.setValue("designPhaseImage", undefined)
//             filesToDelete.designPhaseImage = true
//         }
//     }

//     const handleTechIconChange = (file: File | null) => {
//         if (file) {
//             const current = form.getValues("techUsedInServiceIcons") || []
//             form.setValue("techUsedInServiceIcons", [...current, file])
//         }
//     }

//     const handleDistinguishesIconChange = (file: File | null) => {
//         if (file) {
//             const current = form.getValues("distingoshesUsIcons") || []
//             form.setValue("distingoshesUsIcons", [...current, file])
//         }
//     }

//     const removeTechIcon = (index: number) => {
//         const current = form.getValues("techUsedInServiceIcons") || []
//         // If it's an existing icon (string URL), mark it for deletion
//         if (typeof current[index] === "string") {
//             filesToDelete.techUsedInServiceIcons.push(index)
//         }
//         form.setValue(
//             "techUsedInServiceIcons",
//             current.filter((_: any, i: number) => i !== index),
//         )
//     }

//     const removeDistinguishesIcon = (index: number) => {
//         const current = form.getValues("distingoshesUsIcons") || []
//         // If it's an existing icon (string URL), mark it for deletion
//         if (typeof current[index] === "string") {
//             filesToDelete.distingoshesUsIcons.push(index)
//         }
//         form.setValue(
//             "distingoshesUsIcons",
//             current.filter((_: any, i: number) => i !== index),
//         )
//     }

//     return (
//         <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
//             <DialogHeader>
//                 <DialogTitle>Update Service</DialogTitle>
//                 <DialogDescription>Edit your service details below.</DialogDescription>
//             </DialogHeader>

//             <Form {...form}>
//                 <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
//                     <Tabs defaultValue="basic" className="w-full">
//                         <TabsList className="grid w-full grid-cols-5">
//                             <TabsTrigger value="basic">Basic</TabsTrigger>
//                             <TabsTrigger value="features">Features</TabsTrigger>
//                             <TabsTrigger value="tech">Technology</TabsTrigger>
//                             <TabsTrigger value="seo">SEO</TabsTrigger>
//                             <TabsTrigger value="design">Design</TabsTrigger>
//                         </TabsList>

//                         <TabsContent value="basic" className="space-y-4">
//                             <div className="grid grid-cols-2 gap-4">
//                                 <FormField
//                                     control={form.control}
//                                     name="title"
//                                     render={({ field }) => (
//                                         <FormItem>
//                                             <FormLabel>Service Title *</FormLabel>
//                                             <FormControl>
//                                                 <Input placeholder="e.g., Web Development" {...field} />
//                                             </FormControl>
//                                             <FormMessage />
//                                         </FormItem>
//                                     )}
//                                 />
//                                 <FormField
//                                     control={form.control}
//                                     name="titleAr"
//                                     render={({ field }) => (
//                                         <FormItem>
//                                             <FormLabel>Service Title (AR) *</FormLabel>
//                                             <FormControl>
//                                                 <Input placeholder="e.g., Web Development" {...field} />
//                                             </FormControl>
//                                             <FormMessage />
//                                         </FormItem>
//                                     )}
//                                 />
//                             </div>

//                             <FormField
//                                 control={form.control}
//                                 name="description.en"
//                                 render={({ field }) => (
//                                     <FormItem>
//                                         <FormLabel>Description *</FormLabel>
//                                         <FormControl>
//                                             <Textarea placeholder="Describe your service..." className="min-h-[100px]" {...field} />
//                                         </FormControl>
//                                         <FormMessage />
//                                     </FormItem>
//                                 )}
//                             />
//                             <FormField
//                                 control={form.control}
//                                 name="description.ar"
//                                 render={({ field }) => (
//                                     <FormItem>
//                                         <FormLabel>Description (Arabic)</FormLabel>
//                                         <FormControl>
//                                             <Textarea placeholder="وصف الخدمة..." className="min-h-[100px]" {...field} />
//                                         </FormControl>
//                                         <FormMessage />
//                                     </FormItem>
//                                 )}
//                             />

//                             <FormField
//                                 control={form.control}
//                                 name="category"
//                                 render={({ field }) => (
//                                     <FormItem>
//                                         <FormLabel>Category *</FormLabel>
//                                         <FormControl>
//                                             <Select onValueChange={field.onChange} value={field.value}>
//                                                 <SelectTrigger>
//                                                     <SelectValue placeholder="Select category" />
//                                                 </SelectTrigger>
//                                                 <SelectContent>
//                                                     {Object.keys(CategoryEnum.Services).map((categoryKey) => (
//                                                         <SelectItem key={categoryKey} value={categoryKey}>
//                                                             {categoryKey}
//                                                         </SelectItem>
//                                                     ))}
//                                                 </SelectContent>
//                                             </Select>
//                                         </FormControl>
//                                         <FormMessage />
//                                     </FormItem>
//                                 )}
//                             />

//                             <FormField
//                                 control={form.control}
//                                 name="testimonials"
//                                 render={({ field }) => (
//                                     <FormItem>
//                                         <FormLabel>Testimonials</FormLabel>
//                                         <FormControl>
//                                             <MultiSelect
//                                                 options={testimonialOptions}
//                                                 selected={field.value || []}
//                                                 onChange={field.onChange}
//                                                 placeholder="Select testimonials"
//                                             />
//                                         </FormControl>
//                                         <FormMessage />
//                                     </FormItem>
//                                 )}
//                             />

//                             <div className="space-y-4">
//                                 <FormLabel>Main Service Image</FormLabel>
//                                 <FileUpload
//                                     value={form.watch("image")}
//                                     onChange={handleMainImageChange}
//                                     accept={{ 'image/*': [] }}

//                                 />
//                                 {form.watch("image") && (
//                                     <div className="relative w-32 h-32">
//                                         <Image
//                                             src={
//                                                 form.watch("image") instanceof File
//                                                     ? URL.createObjectURL(form.watch("image") as File)
//                                                     : getUrlImage(form.watch("image") as string)
//                                             }
//                                             alt="Service"
//                                             fill
//                                             className="object-cover rounded-md"
//                                         />
//                                         <Button
//                                             type="button"
//                                             variant="destructive"
//                                             size="sm"
//                                             className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
//                                             onClick={() => handleMainImageChange(null)}
//                                         >
//                                             <X className="h-3 w-3" />
//                                         </Button>
//                                     </div>
//                                 )}
//                             </div>
//                         </TabsContent>

//                         <TabsContent value="features" className="space-y-4">
//                             <div className="space-y-4">
//                                 <div className="flex items-center justify-between">
//                                     <FormLabel>Service Importance</FormLabel>
//                                     <Button type="button" variant="outline" size="sm" onClick={addImportance}>
//                                         <Plus className="h-4 w-4 mr-2" />
//                                         Add Importance
//                                     </Button>
//                                 </div>
//                                 {form.watch("importance")?.map((_, index) => (
//                                     <div key={index} className="space-y-2 p-4 border rounded-lg">
//                                         <div className="flex items-center justify-between">
//                                             <span className="text-sm font-medium">Importance {index + 1}</span>
//                                             <Button
//                                                 type="button"
//                                                 variant="destructive"
//                                                 size="sm"
//                                                 onClick={() => removeImportance(index)}
//                                             >
//                                                 <Trash2 className="h-4 w-4" />
//                                             </Button>
//                                         </div>
//                                         <FormField
//                                             control={form.control}
//                                             name={`importance.${index}.desc.en`}
//                                             render={({ field }) => (
//                                                 <FormItem>
//                                                     <FormLabel>Description (English)</FormLabel>
//                                                     <FormControl>
//                                                         <Textarea placeholder="Describe importance..." {...field} />
//                                                     </FormControl>
//                                                     <FormMessage />
//                                                 </FormItem>
//                                             )}
//                                         />
//                                         <FormField
//                                             control={form.control}
//                                             name={`importance.${index}.desc.ar`}
//                                             render={({ field }) => (
//                                                 <FormItem>
//                                                     <FormLabel>Description (Arabic)</FormLabel>
//                                                     <FormControl>
//                                                         <Textarea placeholder="وصف الأهمية..." {...field} />
//                                                     </FormControl>
//                                                     <FormMessage />
//                                                 </FormItem>
//                                             )}
//                                         />
//                                     </div>
//                                 ))}
//                             </div>

//                             <Separator />

//                             <div className="space-y-4">
//                                 <div className="flex items-center justify-between">
//                                     <FormLabel>What Distinguishes Us</FormLabel>
//                                     <Button type="button" variant="outline" size="sm" onClick={addDistinguishes}>
//                                         <Plus className="h-4 w-4 mr-2" />
//                                         Add Distinguishing Feature
//                                     </Button>
//                                 </div>
//                                 {form.watch("distingoshesUs")?.map((_, index) => (
//                                     <div key={index} className="space-y-2 p-4 border rounded-lg">
//                                         <div className="flex items-center justify-between">
//                                             <span className="text-sm font-medium">Feature {index + 1}</span>
//                                             <Button
//                                                 type="button"
//                                                 variant="destructive"
//                                                 size="sm"
//                                                 onClick={() => removeDistinguishes(index)}
//                                             >
//                                                 <Trash2 className="h-4 w-4" />
//                                             </Button>
//                                         </div>
//                                         <FormField
//                                             control={form.control}
//                                             name={`distingoshesUs.${index}.description.en`}
//                                             render={({ field }) => (
//                                                 <FormItem>
//                                                     <FormLabel>Description (English)</FormLabel>
//                                                     <FormControl>
//                                                         <Textarea placeholder="What makes us different..." {...field} />
//                                                     </FormControl>
//                                                     <FormMessage />
//                                                 </FormItem>
//                                             )}
//                                         />
//                                         <FormField
//                                             control={form.control}
//                                             name={`distingoshesUs.${index}.description.ar`}
//                                             render={({ field }) => (
//                                                 <FormItem>
//                                                     <FormLabel>Description (Arabic)</FormLabel>
//                                                     <FormControl>
//                                                         <Textarea placeholder="ما يميزنا..." {...field} />
//                                                     </FormControl>
//                                                     <FormMessage />
//                                                 </FormItem>
//                                             )}
//                                         />
//                                     </div>
//                                 ))}
//                             </div>

//                             <div className="space-y-4">
//                                 <FormLabel>Distinguishing Icons</FormLabel>
//                                 <FileUpload
//                                     value={null}
//                                     onChange={handleDistinguishesIconChange}
//                                     accept={{ 'image/*': [] }}

//                                 />
//                                 <div className="grid grid-cols-4 gap-4">
//                                     {form.watch("distingoshesUsIcons")?.map((icon, index) => (
//                                         <div key={index} className="relative">
//                                             <Image
//                                                 src={
//                                                     icon instanceof File
//                                                         ? URL.createObjectURL(icon)
//                                                         : getUrlImage(icon as string)
//                                                 }
//                                                 alt={`Distinguishing icon ${index + 1}`}
//                                                 width={80}
//                                                 height={80}
//                                                 className="object-cover rounded-md"
//                                             />
//                                             <Button
//                                                 type="button"
//                                                 variant="destructive"
//                                                 size="sm"
//                                                 className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
//                                                 onClick={() => removeDistinguishesIcon(index)}
//                                             >
//                                                 <X className="h-3 w-3" />
//                                             </Button>
//                                         </div>
//                                     ))}
//                                 </div>
//                             </div>
//                         </TabsContent>

//                         <TabsContent value="tech" className="space-y-4">
//                             <div className="space-y-4">
//                                 <div className="flex items-center justify-between">
//                                     <FormLabel>Technology Used in Service</FormLabel>
//                                     <Button type="button" variant="outline" size="sm" onClick={addTechUsed}>
//                                         <Plus className="h-4 w-4 mr-2" />
//                                         Add Technology
//                                     </Button>
//                                 </div>
//                                 {form.watch("techUsedInService")?.map((_, index) => (
//                                     <div key={index} className="space-y-2 p-4 border rounded-lg">
//                                         <div className="flex items-center justify-between">
//                                             <span className="text-sm font-medium">Technology {index + 1}</span>
//                                             <Button
//                                                 type="button"
//                                                 variant="destructive"
//                                                 size="sm"
//                                                 onClick={() => removeTechUsed(index)}
//                                             >
//                                                 <Trash2 className="h-4 w-4" />
//                                             </Button>
//                                         </div>
//                                         <div className="grid grid-cols-2 gap-4">
//                                             <FormField
//                                                 control={form.control}
//                                                 name={`techUsedInService.${index}.title.en`}
//                                                 render={({ field }) => (
//                                                     <FormItem>
//                                                         <FormLabel>Title (English)</FormLabel>
//                                                         <FormControl>
//                                                             <Input placeholder="e.g., React.js" {...field} />
//                                                         </FormControl>
//                                                         <FormMessage />
//                                                     </FormItem>
//                                                 )}
//                                             />
//                                             <FormField
//                                                 control={form.control}
//                                                 name={`techUsedInService.${index}.title.ar`}
//                                                 render={({ field }) => (
//                                                     <FormItem>
//                                                         <FormLabel>Title (Arabic)</FormLabel>
//                                                         <FormControl>
//                                                             <Input placeholder="e.g., React.js" {...field} />
//                                                         </FormControl>
//                                                         <FormMessage />
//                                                     </FormItem>
//                                                 )}
//                                             />
//                                         </div>
//                                         <FormField
//                                             control={form.control}
//                                             name={`techUsedInService.${index}.desc.en`}
//                                             render={({ field }) => (
//                                                 <FormItem>
//                                                     <FormLabel>Description (English)</FormLabel>
//                                                     <FormControl>
//                                                         <Textarea placeholder="Describe the technology..." {...field} />
//                                                     </FormControl>
//                                                     <FormMessage />
//                                                 </FormItem>
//                                             )}
//                                         />
//                                         <FormField
//                                             control={form.control}
//                                             name={`techUsedInService.${index}.desc.ar`}
//                                             render={({ field }) => (
//                                                 <FormItem>
//                                                     <FormLabel>Description (Arabic)</FormLabel>
//                                                     <FormControl>
//                                                         <Textarea placeholder="وصف التقنية..." {...field} />
//                                                     </FormControl>
//                                                     <FormMessage />
//                                                 </FormItem>
//                                             )}
//                                         />
//                                     </div>
//                                 ))}
//                             </div>

//                             <div className="space-y-4">
//                                 <FormLabel>Technology Icons</FormLabel>
//                                 <FileUpload
//                                     value={null}
//                                     onChange={handleTechIconChange}
//                                     accept={{ 'image/*': [] }}

//                                 />
//                                 <div className="grid grid-cols-4 gap-4">
//                                     {form.watch("techUsedInServiceIcons")?.map((icon, index) => (
//                                         <div key={index} className="relative">
//                                             <Image
//                                                 src={
//                                                     icon instanceof File
//                                                         ? URL.createObjectURL(icon)
//                                                         : getUrlImage(icon as string)
//                                                 }
//                                                 alt={`Tech icon ${index + 1}`}
//                                                 width={80}
//                                                 height={80}
//                                                 className="object-cover rounded-md"
//                                             />
//                                             <Button
//                                                 type="button"
//                                                 variant="destructive"
//                                                 size="sm"
//                                                 className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
//                                                 onClick={() => removeTechIcon(index)}
//                                             >
//                                                 <X className="h-3 w-3" />
//                                             </Button>
//                                         </div>
//                                     ))}
//                                 </div>
//                             </div>
//                         </TabsContent>

//                         <TabsContent value="seo" className="space-y-4">
//                             <div className="space-y-4">
//                                 <div className="flex items-center justify-between">
//                                     <FormLabel>SEO Settings</FormLabel>
//                                     <Button type="button" variant="outline" size="sm" onClick={addSEO}>
//                                         <Plus className="h-4 w-4 mr-2" />
//                                         Add SEO
//                                     </Button>
//                                 </div>
//                                 {form?.watch("seo")?.length>0 &&form.watch("seo")?.map((_, index) => (
//                                     <div key={index} className="space-y-2 p-4 border rounded-lg">
//                                         <div className="flex items-center justify-between">
//                                             <span className="text-sm font-medium">SEO {index + 1}</span>
//                                             <Button
//                                                 type="button"
//                                                 variant="destructive"
//                                                 size="sm"
//                                                 onClick={() => removeSEO(index)}
//                                             >
//                                                 <Trash2 className="h-4 w-4" />
//                                             </Button>
//                                         </div>
//                                         <FormField
//                                             control={form.control}
//                                             name={`seo.${index}.language`}
//                                             render={({ field }) => (
//                                                 <FormItem>
//                                                     <FormLabel>Language</FormLabel>
//                                                     <FormControl>
//                                                         <Select onValueChange={field.onChange} value={field.value}>
//                                                             <SelectTrigger>
//                                                                 <SelectValue placeholder="Select language" />
//                                                             </SelectTrigger>
//                                                             <SelectContent>
//                                                                 {languages.map((lang) => (
//                                                                     <SelectItem key={lang.value} value={lang.value}>
//                                                                         {lang.label}
//                                                                     </SelectItem>
//                                                                 ))}
//                                                             </SelectContent>
//                                                         </Select>
//                                                     </FormControl>
//                                                     <FormMessage />
//                                                 </FormItem>
//                                             )}
//                                         />
//                                         <FormField
//                                             control={form.control}
//                                             name={`seo.${index}.metaTitle`}
//                                             render={({ field }) => (
//                                                 <FormItem>
//                                                     <FormLabel>Meta Title</FormLabel>
//                                                     <FormControl>
//                                                         <Input placeholder="SEO title..." {...field} />
//                                                     </FormControl>
//                                                     <FormMessage />
//                                                 </FormItem>
//                                             )}
//                                         />
//                                         <FormField
//                                             control={form.control}
//                                             name={`seo.${index}.metaDescription`}
//                                             render={({ field }) => (
//                                                 <FormItem>
//                                                     <FormLabel>Meta Description</FormLabel>
//                                                     <FormControl>
//                                                         <Textarea placeholder="SEO description..." {...field} />
//                                                     </FormControl>
//                                                     <FormMessage />
//                                                 </FormItem>
//                                             )}
//                                         />
//                                         <FormField
//                                             control={form.control}
//                                             name={`seo.${index}.keywords`}
//                                             render={({ field }) => (
//                                                 <FormItem>
//                                                     <FormLabel>Keywords</FormLabel>
//                                                     <FormControl>
//                                                         <Input placeholder="keyword1, keyword2, keyword3" {...field} />
//                                                     </FormControl>
//                                                     <FormMessage />
//                                                 </FormItem>
//                                             )}
//                                         />
//                                         <FormField
//                                             control={form.control}
//                                             name={`seo.${index}.canonicalTag`}
//                                             render={({ field }) => (
//                                                 <FormItem>
//                                                     <FormLabel>Canonical Tag</FormLabel>
//                                                     <FormControl>
//                                                         <Input placeholder="https://example.com/canonical-url" {...field} />
//                                                     </FormControl>
//                                                     <FormMessage />
//                                                 </FormItem>
//                                             )}
//                                         />
//                                     </div>
//                                 ))}
//                             </div>
//                         </TabsContent>

//                         <TabsContent value="design" className="space-y-4">
//                             <div className="grid grid-cols-2 gap-4">
//                                 <FormField
//                                     control={form.control}
//                                     name="designPhase.title.en"
//                                     render={({ field }) => (
//                                         <FormItem>
//                                             <FormLabel>Design Phase Title (English)</FormLabel>
//                                             <FormControl>
//                                                 <Input placeholder="Design phase title..." {...field} />
//                                             </FormControl>
//                                             <FormMessage />
//                                         </FormItem>
//                                     )}
//                                 />
//                                 <FormField
//                                     control={form.control}
//                                     name="designPhase.title.ar"
//                                     render={({ field }) => (
//                                         <FormItem>
//                                             <FormLabel>Design Phase Title (Arabic)</FormLabel>
//                                             <FormControl>
//                                                 <Input placeholder="عنوان مرحلة التصميم..." {...field} />
//                                             </FormControl>
//                                             <FormMessage />
//                                         </FormItem>
//                                     )}
//                                 />
//                             </div>

//                             <FormField
//                                 control={form.control}
//                                 name="designPhase.desc.en"
//                                 render={({ field }) => (
//                                     <FormItem>
//                                         <FormLabel>Design Phase Description (English)</FormLabel>
//                                         <FormControl>
//                                             <Textarea placeholder="Describe the design phase..." className="min-h-[100px]" {...field} />
//                                         </FormControl>
//                                         <FormMessage />
//                                     </FormItem>
//                                 )}
//                             />
//                             <FormField
//                                 control={form.control}
//                                 name="designPhase.desc.ar"
//                                 render={({ field }) => (
//                                     <FormItem>
//                                         <FormLabel>Design Phase Description (Arabic)</FormLabel>
//                                         <FormControl>
//                                             <Textarea placeholder="وصف مرحلة التصميم..." className="min-h-[100px]" {...field} />
//                                         </FormControl>
//                                         <FormMessage />
//                                     </FormItem>
//                                 )}
//                             />

//                             <div className="grid grid-cols-2 gap-4">
//                                 <FormField
//                                     control={form.control}
//                                     name="designPhase.satisfiedClientValues.title.en"
//                                     render={({ field }) => (
//                                         <FormItem>
//                                             <FormLabel>Satisfied Client Values Title (English)</FormLabel>
//                                             <FormControl>
//                                                 <Input placeholder="Client satisfaction title..." {...field} />
//                                             </FormControl>
//                                             <FormMessage />
//                                         </FormItem>
//                                     )}
//                                 />
//                                 <FormField
//                                     control={form.control}
//                                     name="designPhase.satisfiedClientValues.title.ar"
//                                     render={({ field }) => (
//                                         <FormItem>
//                                             <FormLabel>Satisfied Client Values Title (Arabic)</FormLabel>
//                                             <FormControl>
//                                                 <Input placeholder="عنوان قيم رضا العملاء..." {...field} />
//                                             </FormControl>
//                                             <FormMessage />
//                                         </FormItem>
//                                     )}
//                                 />
//                             </div>

//                             <div className="space-y-4">
//                                 <FormLabel>Design Phase Image</FormLabel>
//                                 <FileUpload
//                                     value={form.watch("designPhaseImage")}
//                                     onChange={handleDesignPhaseImageChange}
//                                     accept={{ 'image/*': [] }}

//                                 />
//                                 {form.watch("designPhaseImage") && (
//                                     <div className="relative w-32 h-32">
//                                         <Image
//                                             src={
//                                                 form.watch("designPhaseImage") instanceof File
//                                                     ? URL.createObjectURL(form.watch("designPhaseImage") as File)
//                                                     : getUrlImage(form.watch("designPhaseImage") as string)
//                                             }
//                                             alt="Design Phase"
//                                             fill
//                                             className="object-cover rounded-md"
//                                         />
//                                         <Button
//                                             type="button"
//                                             variant="destructive"
//                                             size="sm"
//                                             className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
//                                             onClick={() => handleDesignPhaseImageChange(null)}
//                                         >
//                                             <X className="h-3 w-3" />
//                                         </Button>
//                                     </div>
//                                 )}
//                             </div>

//                             <div className="space-y-4">
//                                 <div className="flex items-center justify-between">
//                                     <FormLabel>Design Values</FormLabel>
//                                     <Button type="button" variant="outline" size="sm" onClick={addDesignValue}>
//                                         <Plus className="h-4 w-4 mr-2" />
//                                         Add Design Value
//                                     </Button>
//                                 </div>
//                                 {form.watch("designPhase.values")?.map((_, index) => (
//                                     <div key={index} className="space-y-2 p-4 border rounded-lg">
//                                         <div className="flex items-center justify-between">
//                                             <span className="text-sm font-medium">Design Value {index + 1}</span>
//                                             <Button
//                                                 type="button"
//                                                 variant="destructive"
//                                                 size="sm"
//                                                 onClick={() => removeDesignValue(index)}
//                                             >
//                                                 <Trash2 className="h-4 w-4" />
//                                             </Button>
//                                         </div>
//                                         <div className="grid grid-cols-2 gap-4">
//                                             <FormField
//                                                 control={form.control}
//                                                 name={`designPhase.values.${index}.title.en`}
//                                                 render={({ field }) => (
//                                                     <FormItem>
//                                                         <FormLabel>Title (English)</FormLabel>
//                                                         <FormControl>
//                                                             <Input placeholder="Design value title..." {...field} />
//                                                         </FormControl>
//                                                         <FormMessage />
//                                                     </FormItem>
//                                                 )}
//                                             />
//                                             <FormField
//                                                 control={form.control}
//                                                 name={`designPhase.values.${index}.title.ar`}
//                                                 render={({ field }) => (
//                                                     <FormItem>
//                                                         <FormLabel>Title (Arabic)</FormLabel>
//                                                         <FormControl>
//                                                             <Input placeholder="عنوان قيمة التصميم..." {...field} />
//                                                         </FormControl>
//                                                         <FormMessage />
//                                                     </FormItem>
//                                                 )}
//                                             />
//                                         </div>
//                                         <FormField
//                                             control={form.control}
//                                             name={`designPhase.values.${index}.desc.en`}
//                                             render={({ field }) => (
//                                                 <FormItem>
//                                                     <FormLabel>Description (English)</FormLabel>
//                                                     <FormControl>
//                                                         <Textarea placeholder="Describe the design value..." {...field} />
//                                                     </FormControl>
//                                                     <FormMessage />
//                                                 </FormItem>
//                                             )}
//                                         />
//                                         <FormField
//                                             control={form.control}
//                                             name={`designPhase.values.${index}.desc.ar`}
//                                             render={({ field }) => (
//                                                 <FormItem>
//                                                     <FormLabel>Description (Arabic)</FormLabel>
//                                                     <FormControl>
//                                                         <Textarea placeholder="وصف قيمة التصميم..." {...field} />
//                                                     </FormControl>
//                                                     <FormMessage />
//                                                 </FormItem>
//                                             )}
//                                         />
//                                     </div>
//                                 ))}
//                             </div>
//                         </TabsContent>
//                     </Tabs>

//                     <DialogFooter>
//                         <Button type="button" variant="outline" onClick={closeModal}>
//                             Cancel
//                         </Button>
//                         <Button type="submit">Update Service</Button>
//                     </DialogFooter>
//                 </form>
//             </Form>
//         </DialogContent>
//     )
// }

