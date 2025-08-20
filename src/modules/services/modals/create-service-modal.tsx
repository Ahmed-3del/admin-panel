// /* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable @typescript-eslint/no-unnecessary-condition */
// /* eslint-disable security/detect-object-injection */
// /* eslint-disable @typescript-eslint/prefer-nullish-coalescing */

// "use client"
// import { zodResolver } from "@hookform/resolvers/zod"
// import { Plus, Trash2 } from "lucide-react"
// import { useForm } from "react-hook-form"
// import { toast } from "sonner"

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
// import { CategoryEnum, languages } from "@/data/categories-enums"
// import { useModal } from "@/hooks/use-modal"

// import serviceSchema, { ServiceFormValues } from "../validation/service-schema"

// const testimonialOptions = [
//     { label: "John Doe - Great service!", value: "65e85cb858a9bf052e690365" },
//     { label: "Jane Smith - Excellent work!", value: "65e85cb858a9bf052e690366" },
//     { label: "Mike Johnson - Highly recommended!", value: "65e85cb858a9bf052e690367" },
// ]

// interface CreateServiceModalProps {
//     onConfirm?: (data: ServiceFormValues) => Promise<void>
//     refetch?: () => void
// }

// export function CreateServiceModal({ refetch }: CreateServiceModalProps) {
//     const { closeModal } = useModal()

//     const form = useForm<ServiceFormValues>({
//         resolver: zodResolver(serviceSchema),
//         defaultValues: {
//             title: "",
//             titleAr: "",
//             description: {
//                 en: "",
//                 ar: "",
//             },
//             testimonials: [],
//             importance: [],
//             category: "",
//             techUsedInService: [],
//             distingoshesUs: [],
//             techUsedInServiceIcons: [],
//             distingoshesUsIcons: [],
//             seo: [],
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

//     const onSubmit = async (data: ServiceFormValues) => {
//         const formData = new FormData()

//         if (data.image) {
//             formData.append("image", data.image)
//         }

//         if (data.designPhaseImage) {
//             formData.append("designPhaseImage", data.designPhaseImage)
//         }

//         if (data.techUsedInServiceIcons && data.techUsedInServiceIcons.length > 0) {
//             data.techUsedInServiceIcons.forEach((file) => {
//                 formData.append("techUsedInServiceIcons", file)
//             })
//         }

//         if (data.distingoshesUsIcons && data.distingoshesUsIcons.length > 0) {
//             data.distingoshesUsIcons.forEach((file) => {
//                 formData.append("distingoshesUsIcons", file)
//             })
//         }
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
//             await fetch("/api/services", {
//                 method: "POST",
//                 body: formData,
//             }).then((response) => {
//                 if (!response.ok) {
//                     throw new Error(`HTTP error! status: ${response.status}`)
//                 }
//                 toast.success("Service created successfully")
//                 return response.json()
//             })
//             refetch?.()
//             closeModal()
//             form.reset()
//             console.log("Service submitted with data:", data)
//         } catch (error) {
//             console.error("Error creating service:", error)
//         }
//     }

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
//             current.filter((_, i) => i !== index),
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
//             current.filter((_, i) => i !== index),
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
//             current.filter((_, i) => i !== index),
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
//             current.filter((_, i) => i !== index),
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
//             current.filter((_, i) => i !== index),
//         )
//     }

//     const handleMainImageChange = (file: File | null) => {
//         if (file) {
//             form.setValue("image", file)
//         }
//     }

//     const handleDesignPhaseImageChange = (file: File | null) => {
//         if (file) {
//             form.setValue("designPhaseImage", file)
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

//     return (
//         <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
//             <DialogHeader>
//                 <DialogTitle>Create New Service</DialogTitle>
//                 <DialogDescription>Add a new service to your offerings. Fill in the details below.</DialogDescription>
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
//                                     onBlur={() => form.trigger("image")}
//                                 />
//                             </div>
//                         </TabsContent>

//                         <TabsContent value="features" className="space-y-4">
//                             <div className="space-y-4">
//                                 <div className="flex items-center justify-between">
//                                     <FormLabel>Importance Points</FormLabel>
//                                     <Button type="button" variant="outline" size="sm" onClick={addImportance}>
//                                         <Plus className="h-4 w-4 mr-2" />
//                                         Add Point
//                                     </Button>
//                                 </div>
//                                 {form.watch("importance")?.map((_, index) => (
//                                     <div key={index} className="flex gap-2">
//                                         <FormField
//                                             control={form.control}
//                                             name={`importance.${index}.desc.en`}
//                                             render={({ field }) => (
//                                                 <FormItem className="flex-1">
//                                                     <FormControl>
//                                                         <Input placeholder="e.g., High performance" {...field} />
//                                                     </FormControl>
//                                                     <FormMessage />
//                                                 </FormItem>
//                                             )}
//                                         />
//                                         <FormField
//                                             control={form.control}
//                                             name={`importance.${index}.desc.ar`}
//                                             render={({ field }) => (
//                                                 <FormItem className="flex-1">
//                                                     <FormControl>
//                                                         <Input placeholder="الوصف باللغه العربيه" {...field} />
//                                                     </FormControl>
//                                                     <FormMessage />
//                                                 </FormItem>
//                                             )}
//                                         />
//                                         <Button type="button" variant="outline" size="icon" onClick={() => removeImportance(index)}>
//                                             <Trash2 className="h-4 w-4" />
//                                         </Button>
//                                     </div>
//                                 ))}
//                             </div>

//                             <Separator />

//                             <div className="space-y-4">
//                                 <div className="flex items-center justify-between">
//                                     <FormLabel>What Distinguishes Us</FormLabel>
//                                     <Button type="button" variant="outline" size="sm" onClick={addDistinguishes}>
//                                         <Plus className="h-4 w-4 mr-2" />
//                                         Add Point
//                                     </Button>
//                                 </div>
//                                 {form.watch("distingoshesUs")?.map((_, index) => (
//                                     <div key={index} className="flex gap-2">
//                                         <FormField
//                                             control={form.control}
//                                             name={`distingoshesUs.${index}.description.en`}
//                                             render={({ field }) => (
//                                                 <FormItem className="flex-1">
//                                                     <FormControl>
//                                                         <Input placeholder="e.g., 24/7 support" {...field} />
//                                                     </FormControl>
//                                                     <FormMessage />
//                                                 </FormItem>
//                                             )}
//                                         />
//                                         <FormField
//                                             control={form.control}
//                                             name={`distingoshesUs.${index}.description.ar`}
//                                             render={({ field }) => (
//                                                 <FormItem className="flex-1">
//                                                     <FormControl>
//                                                         <Input placeholder="وصف باللغه العربيه" {...field} />
//                                                     </FormControl>
//                                                     <FormMessage />
//                                                 </FormItem>
//                                             )}
//                                         />
//                                         <Button type="button" variant="outline" size="icon" onClick={() => removeDistinguishes(index)}>
//                                             <Trash2 className="h-4 w-4" />
//                                         </Button>
//                                     </div>
//                                 ))}
//                             </div>

//                             <div className="space-y-4">
//                                 <FormLabel>Distinguishes Us Icons</FormLabel>
//                                 <FileUpload
//                                     value={null}
//                                     onChange={handleDistinguishesIconChange}
//                                     onBlur={() => form.trigger("distingoshesUsIcons")}
//                                 />
//                                 {(form.watch("distingoshesUsIcons") ?? []).length > 0 && (
//                                     <div className="text-sm text-muted-foreground">
//                                         {(form.watch("distingoshesUsIcons") ?? []).length} icon(s) uploaded
//                                     </div>
//                                 )}
//                             </div>
//                         </TabsContent>

//                         <TabsContent value="tech" className="space-y-4">
//                             <div className="space-y-4">
//                                 <div className="flex items-center justify-between">
//                                     <FormLabel>Technologies Used in Service</FormLabel>
//                                     <Button type="button" variant="outline" size="sm" onClick={addTechUsed}>
//                                         <Plus className="h-4 w-4 mr-2" />
//                                         Add Technology
//                                     </Button>
//                                 </div>
//                                 {form.watch("techUsedInService")?.map((_, index) => (
//                                     <div key={index} className="space-y-2 p-4 border rounded-md">
//                                         <div className="flex gap-2 items-center justify-between w-full">
//                                             <FormField
//                                                 control={form.control}
//                                                 name={`techUsedInService.${index}.title.en`}
//                                                 render={({ field }) => (
//                                                     <FormItem className="flex-1">
//                                                         <FormLabel>Technology Name</FormLabel>
//                                                         <FormControl>
//                                                             <Input placeholder="e.g., React" {...field} />
//                                                         </FormControl>
//                                                         <FormMessage />
//                                                     </FormItem>
//                                                 )}
//                                             />
//                                             <FormField
//                                                 control={form.control}
//                                                 name={`techUsedInService.${index}.title.ar`}
//                                                 render={({ field }) => (
//                                                     <FormItem className="flex-1">
//                                                         <FormLabel>Technology Name (Arabic)</FormLabel>
//                                                         <FormControl>
//                                                             <Input placeholder="التكنولوجيا بالعربية" {...field} />
//                                                         </FormControl>
//                                                         <FormMessage />
//                                                     </FormItem>
//                                                 )}
//                                             />
//                                             <div className="flex mt-4 items-center">
//                                                 <Button
//                                                     type="button"
//                                                     variant="outline"
//                                                     size="icon"
//                                                     onClick={() => removeTechUsed(index)}
//                                                     className=""
//                                                 >
//                                                     <Trash2 className="h-4 w-4" />
//                                                 </Button>
//                                             </div>
//                                         </div>
//                                         <FormField
//                                             control={form.control}
//                                             name={`techUsedInService.${index}.desc.en`}
//                                             render={({ field }) => (
//                                                 <FormItem>
//                                                     <FormLabel>Description</FormLabel>
//                                                     <FormControl>
//                                                         <Textarea placeholder="e.g., Great for UI" {...field} />
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
//                                                         <Textarea placeholder="وصف التكنولوجيا بالعربية" {...field} />
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
//                                     onBlur={() => form.trigger("techUsedInServiceIcons")}
//                                 />
//                                 {(form.watch("techUsedInServiceIcons") ?? []).length > 0 && (
//                                     <div className="text-sm text-muted-foreground">
//                                         {(form.watch("techUsedInServiceIcons") ?? []).length} icon(s) uploaded
//                                     </div>
//                                 )}
//                             </div>
//                         </TabsContent>

//                         <TabsContent value="seo" className="space-y-4">
//                             <div className="space-y-4">
//                                 <div className="flex items-center justify-between">
//                                     <FormLabel>SEO Settings</FormLabel>
//                                     <Button type="button" variant="outline" size="sm" onClick={addSEO}>
//                                         <Plus className="h-4 w-4 mr-2" />
//                                         Add Language
//                                     </Button>
//                                 </div>
//                                 {form.watch("seo")?.map((_, index) => (
//                                     <div key={index} className="space-y-4 p-4 border rounded-md">
//                                         <div className="flex items-center justify-between">
//                                             <h4 className="font-medium">SEO Configuration {index + 1}</h4>
//                                             <Button type="button" variant="outline" size="icon" onClick={() => removeSEO(index)}>
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

//                                         <div className="grid grid-cols-2 gap-4">
//                                             <FormField
//                                                 control={form.control}
//                                                 name={`seo.${index}.metaTitle`}
//                                                 render={({ field }) => (
//                                                     <FormItem>
//                                                         <FormLabel>Meta Title</FormLabel>
//                                                         <FormControl>
//                                                             <Input placeholder="Enter meta title" {...field} />
//                                                         </FormControl>
//                                                         <FormMessage />
//                                                     </FormItem>
//                                                 )}
//                                             />

//                                             <FormField
//                                                 control={form.control}
//                                                 name={`seo.${index}.canonicalTag`}
//                                                 render={({ field }) => (
//                                                     <FormItem>
//                                                         <FormLabel>Canonical URL</FormLabel>
//                                                         <FormControl>
//                                                             <Input placeholder="https://yourwebsite.com/services/..." {...field} />
//                                                         </FormControl>
//                                                         <FormMessage />
//                                                     </FormItem>
//                                                 )}
//                                             />
//                                         </div>

//                                         <FormField
//                                             control={form.control}
//                                             name={`seo.${index}.metaDescription`}
//                                             render={({ field }) => (
//                                                 <FormItem>
//                                                     <FormLabel>Meta Description</FormLabel>
//                                                     <FormControl>
//                                                         <Textarea placeholder="Enter meta description" {...field} />
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

//                                         <div className="grid grid-cols-2 gap-4">
//                                             <FormField
//                                                 control={form.control}
//                                                 name={`seo.${index}.structuredData.name`}
//                                                 render={({ field }) => (
//                                                     <FormItem>
//                                                         <FormLabel>Structured Data Name</FormLabel>
//                                                         <FormControl>
//                                                             <Input placeholder="Service name" {...field} />
//                                                         </FormControl>
//                                                         <FormMessage />
//                                                     </FormItem>
//                                                 )}
//                                             />

//                                             <FormField
//                                                 control={form.control}
//                                                 name={`seo.${index}.structuredData.provider.name`}
//                                                 render={({ field }) => (
//                                                     <FormItem>
//                                                         <FormLabel>Provider Name</FormLabel>
//                                                         <FormControl>
//                                                             <Input placeholder="Your Company" {...field} />
//                                                         </FormControl>
//                                                         <FormMessage />
//                                                     </FormItem>
//                                                 )}
//                                             />
//                                         </div>
//                                     </div>
//                                 ))}
//                             </div>
//                         </TabsContent>

//                         <TabsContent value="design" className="space-y-4">
//                             <div className="space-y-4">
//                                 <h3 className="text-lg font-medium">Design Phase</h3>

//                                 <div className="grid grid-cols-2 gap-4">
//                                     <FormField
//                                         control={form.control}
//                                         name="designPhase.title.en"
//                                         render={({ field }) => (
//                                             <FormItem>
//                                                 <FormLabel>Phase Title</FormLabel>
//                                                 <FormControl>
//                                                     <Input placeholder="e.g., Planning" {...field} />
//                                                 </FormControl>
//                                                 <FormMessage />
//                                             </FormItem>
//                                         )}
//                                     />
//                                     <FormField
//                                         control={form.control}
//                                         name="designPhase.title.ar"
//                                         render={({ field }) => (
//                                             <FormItem>
//                                                 <FormLabel>Phase Title (AR)</FormLabel>

//                                                 <FormControl>
//                                                     <Input placeholder="عنوان المرحلة بالعربية" {...field} />
//                                                 </FormControl>
//                                                 <FormMessage />
//                                             </FormItem>
//                                         )}
//                                     />
//                                 </div>
//                                 <div className="grid grid-cols-2 gap-4">

//                                     <FormField
//                                         control={form.control}
//                                         name="designPhase.satisfiedClientValues.title.en"
//                                         render={({ field }) => (
//                                             <FormItem>
//                                                 <FormLabel>Satisfied Clients</FormLabel>
//                                                 <FormControl>
//                                                     <Input placeholder="e.g., 100+ clients" {...field} />
//                                                 </FormControl>
//                                                 <FormMessage />
//                                             </FormItem>
//                                         )}
//                                     />
//                                     <FormField
//                                         control={form.control}
//                                         name="designPhase.satisfiedClientValues.title.ar"
//                                         render={({ field }) => (
//                                             <FormItem>
//                                                 <FormLabel>Satisfied Clients (AR)</FormLabel>

//                                                 <FormControl>
//                                                     <Input placeholder="عملاء راضون بالعربية" {...field} />
//                                                 </FormControl>
//                                                 <FormMessage />
//                                             </FormItem>
//                                         )}
//                                     />
//                                 </div>
//                                 <div className="grid grid-cols-2 gap-4">
//                                     <FormField
//                                         control={form.control}
//                                         name="designPhase.desc.en"
//                                         render={({ field }) => (
//                                             <FormItem>
//                                                 <FormLabel>Phase Description</FormLabel>
//                                                 <FormControl>
//                                                     <Textarea placeholder="e.g., Project wireframing" {...field} />
//                                                 </FormControl>
//                                                 <FormMessage />
//                                             </FormItem>
//                                         )}
//                                     />
//                                     <FormField
//                                         control={form.control}
//                                         name="designPhase.desc.ar"
//                                         render={({ field }) => (
//                                             <FormItem>
//                                                 <FormLabel>Phase Description(AR)</FormLabel>
//                                                 <FormControl>
//                                                     <Textarea placeholder="وصف المرحلة بالعربية" {...field} />
//                                                 </FormControl>
//                                                 <FormMessage />
//                                             </FormItem>
//                                         )}
//                                     />
//                                 </div>
//                                 <div className="space-y-4">
//                                     <div className="flex items-center justify-between">
//                                         <FormLabel>Design Values</FormLabel>
//                                         <Button type="button" variant="outline" size="sm" onClick={addDesignValue}>
//                                             <Plus className="h-4 w-4 mr-2" />
//                                             Add Value
//                                         </Button>
//                                     </div>
//                                     {form.watch("designPhase.values")?.map((_, index) => (
//                                         <div key={index} className="space-y-2 p-4 border rounded-md">
//                                             <div className="flex gap-2">
//                                                 <FormField
//                                                     control={form.control}
//                                                     name={`designPhase.values.${index}.title.en`}
//                                                     render={({ field }) => (
//                                                         <FormItem className="flex-1">
//                                                             <FormLabel>Value Title</FormLabel>
//                                                             <FormControl>
//                                                                 <Input placeholder="e.g., Innovation" {...field} />
//                                                             </FormControl>
//                                                             <FormMessage />
//                                                         </FormItem>
//                                                     )}
//                                                 />
//                                                 <FormField
//                                                     control={form.control}
//                                                     name={`designPhase.values.${index}.title.ar`}
//                                                     render={({ field }) => (
//                                                         <FormItem className="flex-1">
//                                                             <FormLabel>Value Title(AR)</FormLabel>
//                                                             <FormControl>
//                                                                 <Input placeholder="عنوان القيمة بالعربية" {...field} />
//                                                             </FormControl>
//                                                             <FormMessage />
//                                                         </FormItem>
//                                                     )}
//                                                 />
//                                                 <Button
//                                                     type="button"
//                                                     variant="outline"
//                                                     size="icon"
//                                                     onClick={() => removeDesignValue(index)}
//                                                     className="mt-8"
//                                                 >
//                                                     <Trash2 className="h-4 w-4" />
//                                                 </Button>
//                                             </div>
//                                             <FormField
//                                                 control={form.control}
//                                                 name={`designPhase.values.${index}.desc.en`}
//                                                 render={({ field }) => (
//                                                     <FormItem>
//                                                         <FormLabel>Value Description</FormLabel>
//                                                         <FormControl>
//                                                             <Textarea placeholder="e.g., We create cutting-edge solutions" {...field} />
//                                                         </FormControl>
//                                                         <FormMessage />
//                                                     </FormItem>
//                                                 )}
//                                             />
//                                             <FormField
//                                                 control={form.control}
//                                                 name={`designPhase.values.${index}.desc.ar`}
//                                                 render={({ field }) => (
//                                                     <FormItem>
//                                                         <FormLabel>Value Description (AR)</FormLabel>
//                                                         <FormControl>
//                                                             <Textarea placeholder="وصف القيمة بالعربية" {...field} />
//                                                         </FormControl>
//                                                         <FormMessage />
//                                                     </FormItem>
//                                                 )}
//                                             />
//                                         </div>
//                                     ))}
//                                 </div>

//                                 <div className="space-y-4">
//                                     <FormLabel>Design Phase Image</FormLabel>
//                                     <FileUpload
//                                         value={form.watch("designPhaseImage")}
//                                         onChange={handleDesignPhaseImageChange}
//                                         onBlur={() => form.trigger("designPhaseImage")}
//                                     />
//                                 </div>
//                             </div>
//                         </TabsContent>
//                     </Tabs>

//                     <DialogFooter>
//                         <Button type="button" variant="outline" onClick={closeModal}>
//                             Cancel
//                         </Button>
//                         <Button type="submit" disabled={form.formState.isSubmitting}>
//                             {form.formState.isSubmitting ? "Creating..." : "Create Service"}
//                         </Button>
//                     </DialogFooter>
//                 </form>
//             </Form>
//         </DialogContent>
//     )
// }
