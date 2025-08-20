// /* eslint-disable security/detect-object-injection */
// /* eslint-disable @typescript-eslint/no-unused-vars */
// /* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable @typescript-eslint/prefer-nullish-coalescing */

// "use client"

// import * as React from "react"

// import Image from "next/image"

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
// import type { ModalProps } from "@/context/modal-context-provider"
// import { CategoryEnum, statusOptions, platformOptions, screenTypeOptions, regionOptions } from "@/data/categories-enums"
// import { useModal } from "@/hooks/use-modal"
// import useGetContacts from "@/modules/contacts/hooks/use-get-contacts"
// import { useGetProjectById } from "@/modules/main/hooks/use-get-projects"

// import projectSchema, { type ProjectFormValues } from "../validation/project-sgema"

// export function UpdateProjectModal({ project, refetch }: ModalProps) {
//     const { closeModal } = useModal()
//     const { contacts, isLoading: loadingContacts } = useGetContacts()
//     const [responsiveImageFile, setResponsiveImageFile] = React.useState<File | null>(null)

//     const { project: projectData, isLoading: loadingProjects } = useGetProjectById(project?._id || "")

//     const form = useForm<ProjectFormValues>({
//         resolver: zodResolver(projectSchema),
//         defaultValues: {
//             projectName: "",
//             description: "",
//             category: "",
//             designScreens: {
//                 app: "",
//                 web: "",
//             },
//             images: [],
//             client: "",
//             status: "",
//             seo: {
//                 metaDescription: "",
//                 metaTitle: "",
//             },
//             region: "",
//             screenTypes: [],
//             screenshots: [],
//             platform: "",
//             responsive: {
//                 image: "",
//                 title: "",
//                 description: "",
//             },
//             url: "",
//             name: "",
//             hero: {
//                 region: "",
//                 tech: [],
//                 platforms: [],
//                 downloads: "",
//                 description: "",
//                 title: "",
//             },
//             contacts: [],
//         },
//     })

//     React.useEffect(() => {
//         if (projectData) {
//             form.reset({
//                 projectName: projectData.projectName || "",
//                 description: projectData.description || "",
//                 category: projectData.category || "",
//                 designScreens: {
//                     app: projectData.designScreens?.app || "",
//                     web: projectData.designScreens?.web || "",
//                 },
//                 images: projectData.images || [],
//                 client: projectData.client || "",
//                 status: projectData.status || "",
//                 seo: {
//                     metaDescription: projectData.seo?.metaDescription || "",
//                     metaTitle: projectData.seo?.metaTitle || "",
//                 },
//                 region: projectData.region || "",
//                 screenTypes: projectData.screenTypes || [],
//                 screenshots: projectData.screenshots || [],
//                 platform: projectData.platform || "",
//                 responsive: {
//                     image: projectData.responsive?.image || "",
//                     title: projectData.responsive?.title || "",
//                     description: projectData.responsive?.description || "",
//                 },
//                 url: projectData.url || "",
//                 name: projectData.name || "",
//                 hero: {
//                     region: projectData.hero?.region || "",
//                     tech: projectData.hero?.tech || [],
//                     platforms: projectData.hero?.platforms || [],
//                     downloads: projectData.hero?.downloads || "",
//                     description: projectData.hero?.description || "",
//                     title: projectData.hero?.title || "",
//                 },
//                 contacts: projectData.contacts || [],
//             })
//         }
//     }, [projectData, form])

//     const onSubmit = async (data: ProjectFormValues) => {
//         if (!projectData?._id) {
//             toast.error("Project ID is missing")
//             return
//         }

//         const formData = new FormData()
//         const images = data.images || []
//         images.forEach((image: any, index: number) => {
//             if (image?.file instanceof File) {
//                 formData.append("images", image.file)
//             }
//         })
//         if (responsiveImageFile) {
//             formData.append("responsive.image", responsiveImageFile)
//         }

//         const dataWithoutFiles = { ...data }
//         formData.append("responsive.description", JSON.stringify(dataWithoutFiles.responsive.description))
//         formData.append("responsive.title", JSON.stringify(dataWithoutFiles.responsive.title))

//         delete dataWithoutFiles.images
//         const appendToFormData = (obj: any, formData: FormData, prefix = "") => {
//             Object.keys(obj).forEach((key) => {
//                 const value = obj[key]
//                 const formKey = prefix ? `${prefix}[${key}]` : key
//                 if (value === null || value === undefined) return
//                 if (Array.isArray(value)) {
//                     value.forEach((item, index) => {
//                         if (typeof item === "object" && item !== null && !(item instanceof File)) {
//                             appendToFormData(item, formData, `${formKey}[${index}]`)
//                         } else {
//                             formData.append(`${formKey}[${index}]`, String(item))
//                         }
//                     })
//                 } else if (value instanceof File) {
//                     formData.append(formKey, value)
//                 } else if (typeof value === "object") {
//                     appendToFormData(value, formData, formKey)
//                 } else {
//                     formData.append(formKey, String(value))
//                 }
//             })
//         }
//         appendToFormData(dataWithoutFiles, formData)

//         try {
//             // Add project ID to identify which project to update
//             formData.append("id", projectData._id || "")

//             const response = await fetch(`/api/projects/${projectData._id}`, {
//                 method: "PUT",
//                 body: formData,
//             })

//             if (!response.ok) {
//                 const errorData = await response.json()
//                 console.log("Error response data:", errorData)
//                 throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.message || "Unknown error"}`)
//             }

//             const result = await response.json()
//             toast.success("Project updated successfully!")
//             refetch?.()
//             closeModal()
//         } catch (error) {
//             console.error("Error updating project:", error)
//             toast.error(`Failed to update project: ${error instanceof Error ? error.message : "Unknown error"}`)
//         }
//     }

//     const contactOptions = React.useMemo(() => {
//         return (
//             contacts?.map((contact: { name: any; email: any; _id: any }) => ({
//                 label: contact.name,
//                 value: contact._id,
//                 id: contact._id,
//             })) || []
//         )
//     }, [contacts])

//     const handleFileChange = async (file: File | null) => {
//         if (file) {
//             try {
//                 const fileData = await new Promise<string>((resolve, reject) => {
//                     const reader = new FileReader()
//                     reader.onload = () => resolve(reader.result as string)
//                     reader.onerror = reject
//                     reader.readAsDataURL(file)
//                 })

//                 const currentImages = form.getValues("images") ?? []
//                 const newImage = {
//                     file: file,
//                     data: fileData,
//                     name: file.name,
//                     type: file.type,
//                     size: file.size,
//                     altText: file.name,
//                 }

//                 form.setValue("images", [...currentImages, newImage])
//                 form.trigger("images")
//             } catch (error) {
//                 console.error("Error reading file:", error)
//                 toast.error(`Error reading file: ${error instanceof Error ? error.message : "Unknown error"}`)
//             }
//         }
//     }

//     const handleResponsiveImageUpload = async (file: File | null) => {
//         if (file) {
//             try {
//                 const fileData = await new Promise<string>((resolve, reject) => {
//                     const reader = new FileReader()
//                     reader.onload = () => resolve(reader.result as string)
//                     reader.onerror = reject
//                     reader.readAsDataURL(file)
//                 })
//                 setResponsiveImageFile(file)

//                 form.setValue("responsive.image", fileData)
//                 form.trigger("responsive.image")
//             } catch (error) {
//                 console.error("Error reading responsive image file:", error)
//                 toast.error(`Error reading responsive image file: ${error instanceof Error ? error.message : "Unknown error"}`)
//             }
//         }
//     }

//     const removeImage = (index: number) => {
//         const currentImages = form.getValues("images") ?? []
//         form.setValue(
//             "images",
//             currentImages.filter((_: any, i: number) => i !== index),
//         )
//         form.trigger("images")
//     }

//     const removeResponsiveImage = () => {
//         setResponsiveImageFile(null)
//         form.setValue("responsive.image", "")
//         form.trigger("responsive.image")
//     }

//     const addTechItem = () => {
//         const currentTech = form.getValues("hero.tech") ?? []
//         form.setValue("hero.tech", [...currentTech, { icon: "" }])
//     }

//     const removeTechItem = (index: number) => {
//         const currentTech = form.getValues("hero.tech") ?? []
//         form.setValue(
//             "hero.tech",
//             currentTech.filter((_: any, i: number) => i !== index),
//         )
//     }

//     const addScreenshot = () => {
//         const currentScreenshots = form.getValues("screenshots") ?? []
//         form.setValue("screenshots", [...currentScreenshots, { url: "" }])
//     }

//     const removeScreenshot = (index: number) => {
//         const currentScreenshots = form.getValues("screenshots") ?? []
//         form.setValue(
//             "screenshots",
//             currentScreenshots.filter((_: any, i: number) => i !== index),
//         )
//     }

//     console.log("Project Data:", projectData)

//     if (loadingProjects) {
//         return (
//             <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
//                 <DialogHeader>
//                     <DialogTitle>Update Project</DialogTitle>
//                     <DialogDescription>Loading project data...</DialogDescription>
//                 </DialogHeader>
//                 <div className="flex items-center justify-center p-8">
//                     <div className="text-center">Loading...</div>
//                 </div>
//             </DialogContent>
//         )
//     }

//     if (!projectData) {
//         return (
//             <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
//                 <DialogHeader>
//                     <DialogTitle>Update Project</DialogTitle>
//                     <DialogDescription>Error loading project data.</DialogDescription>
//                 </DialogHeader>
//                 <div className="flex items-center justify-center p-8">
//                     <div className="text-center">Error loading project.</div>
//                 </div>
//             </DialogContent>
//         )
//     }

//     return (
//         <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
//             <DialogHeader>
//                 <DialogTitle>Update Project</DialogTitle>
//                 <DialogDescription>Update the details of your project.</DialogDescription>
//             </DialogHeader>

//             <Form {...form}>
//                 <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
//                     <Tabs defaultValue="basic" className="w-full">
//                         <TabsList className="grid w-full grid-cols-4">
//                             <TabsTrigger value="basic">Basic</TabsTrigger>
//                             <TabsTrigger value="content">Content</TabsTrigger>
//                             <TabsTrigger value="media">Media</TabsTrigger>
//                             <TabsTrigger value="advanced">Advanced</TabsTrigger>
//                         </TabsList>

//                         <TabsContent value="basic" className="space-y-4">
//                             <FormField
//                                 control={form.control}
//                                 name="projectName"
//                                 render={({ field }) => (
//                                     <FormItem>
//                                         <FormLabel>Project Name *</FormLabel>
//                                         <FormControl>
//                                             <Input placeholder="Enter project name" {...field} />
//                                         </FormControl>
//                                         <FormMessage />
//                                     </FormItem>
//                                 )}
//                             />

//                             <FormField
//                                 control={form.control}
//                                 name="description"
//                                 render={({ field }) => (
//                                     <FormItem>
//                                         <FormLabel>Description *</FormLabel>
//                                         <FormControl>
//                                             <Textarea placeholder="Enter project description" className="min-h-[80px]" {...field} />
//                                         </FormControl>
//                                         <FormMessage />
//                                     </FormItem>
//                                 )}
//                             />

//                             <div className="grid grid-cols-2 gap-4">
//                                 <FormField
//                                     control={form.control}
//                                     name="category"
//                                     render={({ field }) => (
//                                         <FormItem>
//                                             <FormLabel>Category *</FormLabel>
//                                             <FormControl>
//                                                 <Select onValueChange={field.onChange} value={field.value}>
//                                                     <SelectTrigger>
//                                                         <SelectValue placeholder="Select category" />
//                                                     </SelectTrigger>
//                                                     <SelectContent>
//                                                         {Object.keys(CategoryEnum.Projects).map((categoryKey) => (
//                                                             <SelectItem key={categoryKey} value={categoryKey}>
//                                                                 {categoryKey}
//                                                             </SelectItem>
//                                                         ))}
//                                                     </SelectContent>
//                                                 </Select>
//                                             </FormControl>
//                                             <FormMessage />
//                                         </FormItem>
//                                     )}
//                                 />

//                                 <FormField
//                                     control={form.control}
//                                     name="status"
//                                     render={({ field }) => (
//                                         <FormItem>
//                                             <FormLabel>Status</FormLabel>
//                                             <FormControl>
//                                                 <Select onValueChange={field.onChange} value={field.value}>
//                                                     <SelectTrigger>
//                                                         <SelectValue placeholder="Select status" />
//                                                     </SelectTrigger>
//                                                     <SelectContent>
//                                                         {statusOptions.map((status: { value: any; label: string }) => (
//                                                             <SelectItem key={status.value} value={status.value}>
//                                                                 {status.label}
//                                                             </SelectItem>
//                                                         ))}
//                                                     </SelectContent>
//                                                 </Select>
//                                             </FormControl>
//                                             <FormMessage />
//                                         </FormItem>
//                                     )}
//                                 />
//                             </div>

//                             <div className="grid grid-cols-2 gap-4">
//                                 <FormField
//                                     control={form.control}
//                                     name="platform"
//                                     render={({ field }) => (
//                                         <FormItem>
//                                             <FormLabel>Platform</FormLabel>
//                                             <FormControl>
//                                                 <Select onValueChange={field.onChange} value={field.value}>
//                                                     <SelectTrigger>
//                                                         <SelectValue placeholder="Select platform" />
//                                                     </SelectTrigger>
//                                                     <SelectContent>
//                                                         {platformOptions.map((platform: { value: any; label: string }) => (
//                                                             <SelectItem key={platform.value} value={platform.value}>
//                                                                 {platform.label}
//                                                             </SelectItem>
//                                                         ))}
//                                                     </SelectContent>
//                                                 </Select>
//                                             </FormControl>
//                                             <FormMessage />
//                                         </FormItem>
//                                     )}
//                                 />

//                                 <FormField
//                                     control={form.control}
//                                     name="region"
//                                     render={({ field }) => (
//                                         <FormItem>
//                                             <FormLabel>Region</FormLabel>
//                                             <FormControl>
//                                                 <Select onValueChange={field.onChange} value={field.value}>
//                                                     <SelectTrigger>
//                                                         <SelectValue placeholder="Select region" />
//                                                     </SelectTrigger>
//                                                     <SelectContent>
//                                                         {regionOptions.map((region: { value: any; label: string }) => (
//                                                             <SelectItem key={region.value} value={region.value}>
//                                                                 {region.label}
//                                                             </SelectItem>
//                                                         ))}
//                                                     </SelectContent>
//                                                 </Select>
//                                             </FormControl>
//                                             <FormMessage />
//                                         </FormItem>
//                                     )}
//                                 />
//                             </div>

//                             <FormField
//                                 control={form.control}
//                                 name="client"
//                                 render={({ field }) => (
//                                     <FormItem>
//                                         <FormLabel>Client</FormLabel>
//                                         <FormControl>
//                                             <Input placeholder="Enter client name" {...field} />
//                                         </FormControl>
//                                         <FormMessage />
//                                     </FormItem>
//                                 )}
//                             />

//                             <FormField
//                                 control={form.control}
//                                 name="url"
//                                 render={({ field }) => (
//                                     <FormItem>
//                                         <FormLabel>Project URL</FormLabel>
//                                         <FormControl>
//                                             <Input placeholder="https://example.com" {...field} />
//                                         </FormControl>
//                                         <FormMessage />
//                                     </FormItem>
//                                 )}
//                             />
//                         </TabsContent>

//                         <TabsContent value="content" className="space-y-4">
//                             <div className="space-y-4">
//                                 <h3 className="text-lg font-medium">Hero Section</h3>
//                                 <FormField
//                                     control={form.control}
//                                     name="hero.title"
//                                     render={({ field }) => (
//                                         <FormItem>
//                                             <FormLabel>Hero Title</FormLabel>
//                                             <FormControl>
//                                                 <Input placeholder="Enter hero title" {...field} />
//                                             </FormControl>
//                                             <FormMessage />
//                                         </FormItem>
//                                     )}
//                                 />

//                                 <FormField
//                                     control={form.control}
//                                     name="hero.description"
//                                     render={({ field }) => (
//                                         <FormItem>
//                                             <FormLabel>Hero Description</FormLabel>
//                                             <FormControl>
//                                                 <Textarea placeholder="Enter hero description" className="min-h-[80px]" {...field} />
//                                             </FormControl>
//                                             <FormMessage />
//                                         </FormItem>
//                                     )}
//                                 />

//                                 <FormField
//                                     control={form.control}
//                                     name="hero.downloads"
//                                     render={({ field }) => (
//                                         <FormItem>
//                                             <FormLabel>Downloads</FormLabel>
//                                             <FormControl>
//                                                 <Input placeholder="e.g., 10,000+" {...field} />
//                                             </FormControl>
//                                             <FormMessage />
//                                         </FormItem>
//                                     )}
//                                 />

//                                 <FormField
//                                     control={form.control}
//                                     name="hero.platforms"
//                                     render={({ field }) => (
//                                         <FormItem>
//                                             <FormLabel>Hero Platforms</FormLabel>
//                                             <FormControl>
//                                                 <MultiSelect
//                                                     options={platformOptions}
//                                                     selected={field.value ?? []}
//                                                     onChange={field.onChange}
//                                                     placeholder="Select platforms"
//                                                 />
//                                             </FormControl>
//                                             <FormMessage />
//                                         </FormItem>
//                                     )}
//                                 />

//                                 <div className="space-y-2">
//                                     <FormLabel>Tech Stack</FormLabel>
//                                     {form.watch("hero.tech")?.map((_: any, index: number) => (
//                                         <div key={index} className="flex gap-2">
//                                             <FormField
//                                                 control={form.control}
//                                                 name={`hero.tech.${index}.icon`}
//                                                 render={({ field }) => (
//                                                     <FormItem className="flex-1">
//                                                         <FormControl>
//                                                             <Input placeholder="Icon URL or name" {...field} />
//                                                         </FormControl>
//                                                         <FormMessage />
//                                                     </FormItem>
//                                                 )}
//                                             />
//                                             <Button type="button" variant="outline" size="icon" onClick={() => removeTechItem(index)}>
//                                                 <Trash2 className="h-4 w-4" />
//                                             </Button>
//                                         </div>
//                                     ))}
//                                     <Button type="button" variant="outline" size="sm" onClick={addTechItem} className="w-full">
//                                         <Plus className="h-4 w-4 mr-2" />
//                                         Add Tech Item
//                                     </Button>
//                                 </div>
//                             </div>

//                             <Separator />

//                             <div className="space-y-4">
//                                 <h3 className="text-lg font-medium">SEO</h3>
//                                 <FormField
//                                     control={form.control}
//                                     name="seo.metaTitle"
//                                     render={({ field }) => (
//                                         <FormItem>
//                                             <FormLabel>Meta Title</FormLabel>
//                                             <FormControl>
//                                                 <Input placeholder="Enter meta title" {...field} />
//                                             </FormControl>
//                                             <FormMessage />
//                                         </FormItem>
//                                     )}
//                                 />

//                                 <FormField
//                                     control={form.control}
//                                     name="seo.metaDescription"
//                                     render={({ field }) => (
//                                         <FormItem>
//                                             <FormLabel>Meta Description</FormLabel>
//                                             <FormControl>
//                                                 <Textarea placeholder="Enter meta description" className="min-h-[80px]" {...field} />
//                                             </FormControl>
//                                             <FormMessage />
//                                         </FormItem>
//                                     )}
//                                 />
//                             </div>
//                         </TabsContent>
//                         <TabsContent value="media" className="space-y-4">
//                             <div className="space-y-4">
//                                 <FormLabel>Project Images</FormLabel>
//                                 <FileUpload value={null} onChange={handleFileChange} onBlur={() => form.trigger("images")} />

//                                 {(form.watch("images") ?? []).length > 0 && (
//                                     <div className="space-y-2">
//                                         <div className="text-sm text-muted-foreground">
//                                             {(form.watch("images") ?? []).length} image(s) uploaded
//                                         </div>
//                                         <div className="grid grid-cols-2 gap-2">
//                                             {(form.watch("images") ?? []).map((image: any, index: number) => (
//                                                 <div key={index} className="relative border rounded-lg p-2">
//                                                     <div className="flex items-center justify-between">
//                                                         <span className="text-sm truncate">{image.name || image.altText}</span>
//                                                         <Button type="button" variant="ghost" size="sm" onClick={() => removeImage(index)}>
//                                                             <Trash2 className="h-4 w-4" />
//                                                         </Button>
//                                                     </div>
//                                                     {image.data && (
//                                                         <Image
//                                                             key={index}
//                                                             width={100}
//                                                             height={80}
//                                                             loading="lazy"
//                                                             src={image.data || "/placeholder.svg"}
//                                                             alt={image.altText}
//                                                             className="w-full h-20 object-cover rounded mt-2"
//                                                         />
//                                                     )}
//                                                     <div className="text-xs text-muted-foreground mt-1">
//                                                         {image.type} • {Math.round((image.size || 0) / 1024)}KB
//                                                     </div>
//                                                 </div>
//                                             ))}
//                                         </div>
//                                     </div>
//                                 )}
//                                 <FormMessage />
//                             </div>

//                             <Separator />

//                             <div className="space-y-4">
//                                 <h3 className="text-lg font-medium">Design Screens</h3>
//                                 <div className="grid grid-cols-2 gap-4">
//                                     <FormField
//                                         control={form.control}
//                                         name="designScreens.app"
//                                         render={({ field }) => (
//                                             <FormItem>
//                                                 <FormLabel>App Design URL</FormLabel>
//                                                 <FormControl>
//                                                     <Input placeholder="https://figma.com/..." {...field}

//                                                     />
//                                                 </FormControl>
//                                                 <FormMessage />
//                                             </FormItem>
//                                         )}
//                                     />

//                                     <FormField
//                                         control={form.control}
//                                         name="designScreens.web"
//                                         render={({ field }) => (
//                                             <FormItem>
//                                                 <FormLabel>Web Design URL</FormLabel>
//                                                 <FormControl>
//                                                     <Input placeholder="https://figma.com/..." {...field} />
//                                                 </FormControl>
//                                                 <FormMessage />
//                                             </FormItem>
//                                         )}
//                                     />
//                                 </div>
//                             </div>

//                             <Separator />

//                             <div className="space-y-4">
//                                 <h3 className="text-lg font-medium">Screenshots</h3>
//                                 {form.watch("screenshots")?.map((_: any, index: number) => (
//                                     <div key={index} className="flex gap-2">
//                                         <FormField
//                                             control={form.control}
//                                             name={`screenshots.${index}.url`}
//                                             render={({ field }) => (
//                                                 <FormItem className="flex-1">
//                                                     <FormControl>
//                                                         <Input placeholder="Screenshot URL" {...field} />
//                                                     </FormControl>
//                                                     <FormMessage />
//                                                 </FormItem>
//                                             )}
//                                         />
//                                         <Button type="button" variant="outline" size="icon" onClick={() => removeScreenshot(index)}>
//                                             <Trash2 className="h-4 w-4" />
//                                         </Button>
//                                     </div>
//                                 ))}
//                                 <Button type="button" variant="outline" size="sm" onClick={addScreenshot} className="w-full">
//                                     <Plus className="h-4 w-4 mr-2" />
//                                     Add Screenshot
//                                 </Button>
//                             </div>

//                             <Separator />

//                             <div className="space-y-4">
//                                 <h3 className="text-lg font-medium">Responsive Design</h3>
//                                 <FormField
//                                     control={form.control}
//                                     name="responsive.title"
//                                     render={({ field }) => (
//                                         <FormItem>
//                                             <FormLabel>Responsive Title</FormLabel>
//                                             <FormControl>
//                                                 <Input placeholder="Enter responsive design title" {...field} />
//                                             </FormControl>
//                                             <FormMessage />
//                                         </FormItem>
//                                     )}
//                                 />

//                                 <FormField
//                                     control={form.control}
//                                     name="responsive.description"
//                                     render={({ field }) => (
//                                         <FormItem>
//                                             <FormLabel>Responsive Description</FormLabel>
//                                             <FormControl>
//                                                 <Textarea
//                                                     placeholder="Enter responsive design description"
//                                                     className="min-h-[80px]"
//                                                     {...field}
//                                                 />
//                                             </FormControl>
//                                             <FormMessage />
//                                         </FormItem>
//                                     )}
//                                 />
//                                 <div className="space-y-4">
//                                     <FormLabel>Responsive Image</FormLabel>
//                                     <FileUpload
//                                         value={null}
//                                         onChange={handleResponsiveImageUpload}
//                                         onBlur={() => form.trigger("responsive.image")}
//                                     />
//                                     {form.watch("responsive.image") && (
//                                         <div className="relative border rounded-lg p-2">
//                                             <div className="flex items-center justify-between">
//                                                 <span className="text-sm truncate">{responsiveImageFile?.name || "Responsive Image"}</span>
//                                                 <Button type="button" variant="ghost" size="sm" onClick={removeResponsiveImage}>
//                                                     <Trash2 className="h-4 w-4" />
//                                                 </Button>
//                                             </div>
//                                             <Image
//                                                 width={100}
//                                                 height={80}
//                                                 loading="lazy"
//                                                 src={form.watch("responsive.image") || "/placeholder.svg"}
//                                                 alt="Responsive Design Preview"
//                                                 className="w-full h-20 object-cover rounded mt-2"
//                                             />
//                                             {responsiveImageFile && (
//                                                 <div className="text-xs text-muted-foreground mt-1">
//                                                     {responsiveImageFile.type} • {Math.round(responsiveImageFile.size / 1024)}KB
//                                                 </div>
//                                             )}
//                                         </div>
//                                     )}
//                                     <FormMessage />
//                                 </div>
//                             </div>
//                         </TabsContent>
//                         <TabsContent value="advanced" className="space-y-4">
//                             <FormField
//                                 control={form.control}
//                                 name="screenTypes"
//                                 render={({ field }) => (
//                                     <FormItem>
//                                         <FormLabel>Screen Types</FormLabel>
//                                         <FormControl>
//                                             <MultiSelect
//                                                 options={screenTypeOptions}
//                                                 selected={field.value ?? []}
//                                                 onChange={field.onChange}
//                                                 placeholder="Select screen types"
//                                             />
//                                         </FormControl>
//                                         <FormMessage />
//                                     </FormItem>
//                                 )}
//                             />

//                             <FormField
//                                 control={form.control}
//                                 name="contacts"
//                                 render={({ field }) => (
//                                     <FormItem>
//                                         <FormLabel>Contacts</FormLabel>
//                                         <FormControl>
//                                             <MultiSelect
//                                                 options={contactOptions}
//                                                 selected={field.value ?? []}
//                                                 onChange={field.onChange}
//                                                 placeholder="Select contacts"
//                                                 disabled={loadingContacts}
//                                                 emptyMessage={loadingContacts ? "Loading contacts..." : "No contacts found"}
//                                             />
//                                         </FormControl>
//                                         <FormMessage />
//                                     </FormItem>
//                                 )}
//                             />

//                             <FormField
//                                 control={form.control}
//                                 name="name"
//                                 render={({ field }) => (
//                                     <FormItem>
//                                         <FormLabel>Internal Name</FormLabel>
//                                         <FormControl>
//                                             <Input placeholder="Enter internal project name" {...field} />
//                                         </FormControl>
//                                         <FormMessage />
//                                     </FormItem>
//                                 )}
//                             />

//                             <FormField
//                                 control={form.control}
//                                 name="hero.region"
//                                 render={({ field }) => (
//                                     <FormItem>
//                                         <FormLabel>Hero Region</FormLabel>
//                                         <FormControl>
//                                             <Select onValueChange={field.onChange} value={field.value}>
//                                                 <SelectTrigger>
//                                                     <SelectValue placeholder="Select hero region" />
//                                                 </SelectTrigger>
//                                                 <SelectContent>
//                                                     {regionOptions.map((region: { value: any; label: string }) => (
//                                                         <SelectItem key={region.value} value={region.value}>
//                                                             {region.label}
//                                                         </SelectItem>
//                                                     ))}
//                                                 </SelectContent>
//                                             </Select>
//                                         </FormControl>
//                                         <FormMessage />
//                                     </FormItem>
//                                 )}
//                             />
//                         </TabsContent>
//                     </Tabs>

//                     <DialogFooter>
//                         <Button type="button" variant="outline" onClick={closeModal}>
//                             Cancel
//                         </Button>
//                         <Button type="submit" disabled={form.formState.isSubmitting} className="ml-2">
//                             {form.formState.isSubmitting ? "Updating..." : "Update Project"}
//                         </Button>
//                     </DialogFooter>
//                 </form>
//             </Form>
//         </DialogContent>
//     )
// }
