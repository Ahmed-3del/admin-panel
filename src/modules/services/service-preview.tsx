// "use client"

// import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import type { ServiceFormValues } from "@/modules/services/validation/service-schema"
// import { Eye, Globe, Star, Users } from "lucide-react"
// import Image from "next/image"
// import { useEffect, useState } from "react"

// interface ServicePreviewProps {
//     data: ServiceFormValues
//     selectedLanguages?: Set<string>
//     language?: string
//     setActiveLanguage?: (lang: string) => void
// }

// export function ServicePreview({
//     data,
//     selectedLanguages = new Set(["en"]),
//     activeLanguage = "en",
//     setActiveLanguage = (lang: string) => { }
// }: ServicePreviewProps) {
//     const hasBasicInfo = data.name?.en || data.description?.en
//     const hasFeatures = (data.importance?.length ?? 0) > 0 || (data.distingoshesUs?.length ?? 0) > 0
//     const hasTech = (data.techUsedInService?.length ?? 0) > 0
//     const hasSEO = (data.seo?.length ?? 0) > 0
//     const hasDesign = data.designPhase?.title?.en || (data.designPhase?.values?.length ?? 0) > 0
//     const url = data.image

//     console.log(data, "Sdf from watched values")
//     const getLanguageLabel = (lang: string) => {
//         const langMap: Record<string, string> = {
//             en: "English",
//             ar: "العربية",
//         }
//         return langMap[lang] || lang
//     }
//     const getImageUrl = (imageFile: any) => {
//         if (imageFile instanceof File || imageFile instanceof Blob) {
//             try {
//                 return URL.createObjectURL(imageFile);
//             } catch (error) {
//                 console.warn('Failed to create object URL:', error);
//                 return null;
//             }
//         } else if (typeof imageFile === "string") {
//             if (imageFile.startsWith("http://") || imageFile.startsWith("https://")) {
//                 return imageFile;
//             }
//         }
//         return null;
//     };

//     // Clean up object URLs when component unmounts or image changes
//     const [imageUrls, setImageUrls] = useState<string[]>([]);

//     useEffect(() => {
//         return () => {
//             imageUrls.forEach(url => {
//                 try {
//                     URL.revokeObjectURL(url);
//                 } catch (error) {
//                     console.warn('Failed to revoke object URL:', error);
//                 }
//             });
//         };
//     }, [imageUrls]);

//     const mainImageUrl = getImageUrl(url);
//     return (
//         <div className="space-y-6 p-6 bg-white">
//             <div className="text-center space-y-2">
//                 <h2 className="text-2xl font-bold text-gray-900">Live Preview</h2>
//                 <p className="text-sm text-gray-500">See how your service will appear</p>

//                 {/* Language indicator */}
//                 <div className="flex justify-center gap-2 mt-4">
//                     {Array.from(selectedLanguages).map((lang) => (
//                         <Badge key={lang} variant={activeLanguage === lang ? "default" : "secondary"} onClick={() => setActiveLanguage(lang)} className="text-xs">
//                             {getLanguageLabel(lang)}
//                         </Badge>
//                     ))}

//                 </div>
//             </div>

//             {/* Hero Section */}
//             <Card className="overflow-hidden pt-0">
//                 <div className="relative">
//                     {data.image ? (
//                         <div className="w-full max-h-64 aspect-square relative bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg overflow-hidden">
//                             {mainImageUrl ? (
//                                 <img
//                                     src={mainImageUrl}
//                                     alt={'Main image'}
//                                     className=" size-full aspect-square object-cover object-center"
//                                     onError={(e) => {
//                                         const target = e.target as HTMLImageElement;
//                                         target.style.display = 'none';
//                                     }}
//                                 />
//                             ) : (
//                                 <div className="w-full h-full flex items-center justify-center">
//                                     <div className="text-white text-center">
//                                         <div className="w-16 h-16 mx-auto mb-2 bg-white/20 rounded-lg flex items-center justify-center">
//                                             <Eye className="w-8 h-8" />
//                                         </div>
//                                         <p className="text-sm opacity-90">Main Image Preview</p>
//                                     </div>
//                                 </div>
//                             )}
//                         </div>
//                     ) : (
//                         <div className="h-48 bg-gradient-to-r from-gray-100 to-gray-200 flex items-center justify-center">
//                             <span className="text-gray-400 text-sm">No image uploaded</span>
//                         </div>
//                     )}
//                 </div>
//                 <CardHeader>
//                     <div className="flex items-start justify-between">
//                         <div className="space-y-2">
//                             <CardTitle className={`text-2xl ${activeLanguage === "ar" ? "text-right font-arabic" : ""}`}>
//                                 {activeLanguage === "en" ? data.name?.en || "Service Title" : data.name?.ar || "عنوان الخدمة"}
//                             </CardTitle>
//                             {data.category && (
//                                 <Badge variant="secondary" className="w-fit">
//                                     {data.category}
//                                 </Badge>
//                             )}
//                         </div>
//                     </div>
//                     <CardDescription
//                         className={`text-base leading-relaxed ${activeLanguage === "ar" ? "text-right font-arabic" : ""}`}
//                     >
//                         {data.description?.[activeLanguage as keyof typeof data.description] ||
//                             "Service description will appear here..."}
//                     </CardDescription>
//                 </CardHeader>
//             </Card>

//             {/* Importance Points */}
//             {hasFeatures && (
//                 <Card>
//                     <CardHeader>
//                         <CardTitle className="flex items-center gap-2">
//                             <Star className="h-5 w-5 text-yellow-500" />
//                             Key Benefits
//                         </CardTitle>
//                     </CardHeader>
//                     <CardContent className="space-y-4">
//                         {data.importance?.map((item, index) => (
//                             <div key={index} className="flex items-start gap-3">
//                                 <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
//                                 <div className="space-y-1">
//                                     <p className="text-sm font-medium">{item.desc?.en || `Benefit ${index + 1}`}</p>
//                                     {/* {item.desc?.ar && <p className="text-sm text-gray-600 font-arabic text-right">{item.desc.ar}</p>} */}
//                                 </div>
//                             </div>
//                         ))}
//                     </CardContent>
//                 </Card>
//             )}

//             {/* What Distinguishes Us */}
//             {(data.distingoshesUs?.length ?? 0) > 0 && (
//                 <Card>
//                     <CardHeader>
//                         <CardTitle className="flex items-center gap-2">
//                             <Users className="h-5 w-5 text-green-500" />
//                             What Makes Us Different
//                         </CardTitle>
//                     </CardHeader>
//                     <CardContent className="space-y-4">
//                         {data.distingoshesUs?.map((item, index) => (
//                             <div key={index} className="flex items-start gap-3">
//                                 <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
//                                 <div className="space-y-1">
//                                     <p className="text-sm font-medium">{item.description?.en || `Feature ${index + 1}`}</p>
//                                     {/* {item.description?.ar && (
//                                         <p className="text-sm text-gray-600 font-arabic text-right">{item.description.ar}</p>
//                                     )} */}
//                                 </div>
//                             </div>
//                         ))}
//                     </CardContent>
//                 </Card>
//             )}

//             {/* Technology Stack */}
//             {hasTech && (
//                 <Card>
//                     <CardHeader>
//                         <CardTitle>Technology Stack</CardTitle>
//                     </CardHeader>
//                     <CardContent className="space-y-4">
//                         {data.techUsedInService?.map((tech, index) => (
//                             <div key={index} className="p-4 border rounded-lg space-y-2">
//                                 <h4 className="font-semibold text-sm">{tech.title?.en || `Technology ${index + 1}`}</h4>
//                                 {/* {tech.title?.ar && (
//                                     <h4 className="font-semibold text-sm text-gray-600 font-arabic text-right">{tech.title.ar}</h4>
//                                 )} */}
//                                 <p className="text-sm text-gray-600">{tech.desc?.en || "Technology description..."}</p>
//                                 {/* {tech.desc?.ar && <p className="text-sm text-gray-600 font-arabic text-right">{tech.desc.ar}</p>} */}
//                             </div>
//                         ))}
//                     </CardContent>
//                 </Card>
//             )}

//             {/* Design Phase */}
//             {hasDesign && (
//                 <Card>
//                     <CardHeader>
//                         <CardTitle>{data.designPhase?.title?.en || "Design Process"}</CardTitle>
//                         {/* {data.designPhase?.title?.ar && (
//                             <CardTitle className="text-lg text-gray-600 font-arabic text-right">
//                                 {data.designPhase.title.ar}
//                             </CardTitle>
//                         )} */}
//                         <CardDescription>{data.designPhase?.desc?.en || "Design process description..."}</CardDescription>
//                         {/* {data.designPhase?.desc?.ar && (
//                             <CardDescription className="font-arabic text-right">{data.designPhase.desc.ar}</CardDescription>
//                         )} */}
//                     </CardHeader>
//                     <CardContent className="space-y-4">
//                         {data.designPhase?.satisfiedClientValues?.title?.en && (
//                             <div className="text-center p-4 bg-blue-50 rounded-lg">
//                                 <p className="font-semibold text-blue-700">{data.designPhase.satisfiedClientValues.title.en}</p>
//                                 {/* {data.designPhase.satisfiedClientValues.title.ar && (
//                                     <p className="font-semibold text-blue-700 font-arabic">
//                                         {data.designPhase.satisfiedClientValues.title.ar}
//                                     </p>
//                                 )} */}
//                             </div>
//                         )}

//                         {data.designPhase?.values?.map((value, index) => (
//                             <div key={index} className="p-4 border-l-4 border-blue-500 bg-gray-50">
//                                 <h4 className="font-semibold text-sm mb-1">{value.title?.en || `Value ${index + 1}`}</h4>
//                                 {/* {value.title?.ar && (
//                                     <h4 className="font-semibold text-sm mb-1 text-gray-600 font-arabic text-right">{value.title.ar}</h4>
//                                 )} */}
//                                 <p className="text-sm text-gray-600">{value.desc?.en || "Value description..."}</p>
//                                 {/* {value.desc?.ar && <p className="text-sm text-gray-600 font-arabic text-right">{value.desc.ar}</p>} */}
//                             </div>
//                         ))}
//                     </CardContent>
//                 </Card>
//             )}

//             {/* SEO Preview */}
//             {/* {hasSEO && (
//                 <Card>
//                     <CardHeader>
//                         <CardTitle className="flex items-center gap-2">
//                             <Globe className="h-5 w-5 text-blue-500" />
//                             SEO Configuration
//                         </CardTitle>
//                     </CardHeader>
//                     <CardContent className="space-y-4">
//                         {data.seo?.map((seoItem, index) => (
//                             <div key={index} className="p-4 border rounded-lg space-y-2">
//                                 <div className="flex items-center gap-2">
//                                     <Badge variant="outline">{seoItem.language}</Badge>
//                                 </div>
//                                 {seoItem.metaTitle && (
//                                     <div>
//                                         <p className="text-xs text-gray-500 uppercase tracking-wide">Meta Title</p>
//                                         <p className="text-sm font-medium">{seoItem.metaTitle}</p>
//                                     </div>
//                                 )}
//                                 {seoItem.metaDescription && (
//                                     <div>
//                                         <p className="text-xs text-gray-500 uppercase tracking-wide">Meta Description</p>
//                                         <p className="text-sm text-gray-600">{seoItem.metaDescription}</p>
//                                     </div>
//                                 )}
//                                 {seoItem.keywords && (
//                                     <div>
//                                         <p className="text-xs text-gray-500 uppercase tracking-wide">Keywords</p>
//                                         <div className="flex flex-wrap gap-1 mt-1">
//                                             {seoItem.keywords.split(",").map((keyword, i) => (
//                                                 <Badge key={i} variant="secondary" className="text-xs">
//                                                     {keyword.trim()}
//                                                 </Badge>
//                                             ))}
//                                         </div>
//                                     </div>
//                                 )}
//                             </div>
//                         ))}
//                     </CardContent>
//                 </Card>
//             )} */}

//             {/* Completion Status */}
//             <Card>
//                 <CardHeader>
//                     <CardTitle className="text-lg">Form Completion</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                     <div className="space-y-2">
//                         <div className="flex items-center justify-between">
//                             <span className="text-sm">Basic Information</span>
//                             <Badge variant={hasBasicInfo ? "default" : "secondary"}>{hasBasicInfo ? "Complete" : "Incomplete"}</Badge>
//                         </div>
//                         <div className="flex items-center justify-between">
//                             <span className="text-sm">Features</span>
//                             <Badge variant={hasFeatures ? "default" : "secondary"}>{hasFeatures ? "Complete" : "Incomplete"}</Badge>
//                         </div>
//                         <div className="flex items-center justify-between">
//                             <span className="text-sm">Technology</span>
//                             <Badge variant={hasTech ? "default" : "secondary"}>{hasTech ? "Complete" : "Incomplete"}</Badge>
//                         </div>
//                         <div className="flex items-center justify-between">
//                             <span className="text-sm">SEO</span>
//                             <Badge variant={hasSEO ? "default" : "secondary"}>{hasSEO ? "Complete" : "Incomplete"}</Badge>
//                         </div>
//                         <div className="flex items-center justify-between">
//                             <span className="text-sm">Design</span>
//                             <Badge variant={hasDesign ? "default" : "secondary"}>{hasDesign ? "Complete" : "Incomplete"}</Badge>
//                         </div>
//                     </div>
//                 </CardContent>
//             </Card>
//         </div>
//     )
// }
"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { ServiceFormValues } from "@/modules/services/validation/service-schema"
import { Eye, Globe, Star, Users } from "lucide-react"
import { useEffect, useState } from "react"

interface ServicePreviewProps {
    data: ServiceFormValues
    selectedLanguages?: Set<string>
    activeLanguage?: string
}

export function ServicePreview({
    data,
    selectedLanguages = new Set(["en"]),
    activeLanguage = "en",
}: ServicePreviewProps) {
    const hasBasicInfo =
        data.name?.[activeLanguage as keyof typeof data.name] ||
        data.description?.[activeLanguage as keyof typeof data.description]
    const hasFeatures = (data.importance?.length ?? 0) > 0 || (data.distingoshesUs?.length ?? 0) > 0
    const hasTech = (data.techUsedInService?.length ?? 0) > 0
    const hasSEO = (data.seo?.length ?? 0) > 0
    const hasDesign =
        data.designPhase?.title?.[activeLanguage as keyof typeof data.designPhase.title] ||
        (data.designPhase?.values?.length ?? 0) > 0
    const url = data.image

    const [language, setLang] = useState(activeLanguage)

    const getLanguageLabel = (lang: string) => {
        const langMap: Record<string, string> = {
            en: "English",
            ar: "العربية",
        }
        return langMap[lang] || lang
    }

    const isRTL = activeLanguage === "ar"

    const getImageUrl = (imageFile: any) => {
        if (imageFile instanceof File || imageFile instanceof Blob) {
            try {
                return URL.createObjectURL(imageFile)
            } catch (error) {
                console.warn("Failed to create object URL:", error)
                return null
            }
        } else if (typeof imageFile === "string") {
            if (imageFile.startsWith("http://") || imageFile.startsWith("https://")) {
                return imageFile
            }
        }
        return null
    }

    // Clean up object URLs when component unmounts or image changes
    const [imageUrls, setImageUrls] = useState<string[]>([])

    useEffect(() => {
        return () => {
            imageUrls.forEach((url) => {
                try {
                    URL.revokeObjectURL(url)
                } catch (error) {
                    console.warn("Failed to revoke object URL:", error)
                }
            })
        }
    }, [imageUrls])

    const mainImageUrl = getImageUrl(url)

    // Helper function to get text in active language with fallback
    const getText = (textObj: any, fallback = "") => {
        if (!textObj) return fallback
        return textObj[language] || textObj.en || fallback
    }
    return (
        <div className="space-y-6 p-6 bg-white">
            <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-gray-900">Live Preview</h2>
                <p className="text-sm text-gray-500">See how your service will appear</p>

                {/* Language indicator */}
                <div className="flex justify-center gap-2 mt-4">
                    {Array.from(selectedLanguages).map((lang) => (
                        <Badge
                            key={lang}
                            variant={lang === language ? "default" : "secondary"}
                            onClick={() => {
                                setLang(lang)
                            }}
                            className={`text-xs cursor-pointer hover:opacity-80 transition-opacity ${lang === language ? "opacity-100" : "opacity-60"
                                }`}
                        >
                            {getLanguageLabel(lang)}
                        </Badge>
                    ))}
                </div>
            </div>

            {/* Hero Section */}
            <Card className="overflow-hidden pt-0">
                <div className="relative">
                    {data.image ? (
                        <div className="w-full max-h-64 aspect-square relative bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg overflow-hidden">
                            {mainImageUrl ? (
                                <img
                                    src={mainImageUrl || "/placeholder.svg"}
                                    alt={"Main image"}
                                    className="size-full aspect-square object-cover object-center"
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement
                                        target.style.display = "none"
                                    }}
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <div className="text-white text-center">
                                        <div className="w-16 h-16 mx-auto mb-2 bg-white/20 rounded-lg flex items-center justify-center">
                                            <Eye className="w-8 h-8" />
                                        </div>
                                        <p className="text-sm opacity-90">Main Image Preview</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="h-48 bg-gradient-to-r from-gray-100 to-gray-200 flex items-center justify-center">
                            <span className="text-gray-400 text-sm">No image uploaded</span>
                        </div>
                    )}
                </div>

                <CardHeader>
                    <div className="flex items-start justify-between">
                        <div className="space-y-2">
                            <CardTitle className={`text-2xl ${isRTL ? "text-right font-arabic" : ""}`}>
                                {getText(data.name, language === "ar" ? "عنوان الخدمة" : "Service Title")}

                            </CardTitle>
                            {data.category && (
                                <Badge variant="secondary" className="w-fit">
                                    {data.category}
                                </Badge>
                            )}
                        </div>
                    </div>

                    <CardDescription className={`text-base leading-relaxed ${isRTL ? "text-right font-arabic" : ""}`}>
                        {getText(
                            data.description,
                            language === "ar" ? "وصف الخدمة سيظهر هنا..." : "Service description will appear here...",
                        )}
                    </CardDescription>
                </CardHeader>
            </Card>

            {/* Importance Points */}
            {hasFeatures && (
                <Card>
                    <CardHeader>
                        <CardTitle className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                            <Star className="h-5 w-5 text-yellow-500" />
                            {language === "ar" ? "الفوائد الرئيسية" : "Key Benefits"}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {data.importance?.map((item, index) => (
                            <div key={index} className={`flex items-start gap-3 ${isRTL ? "flex-row-reverse text-right" : ""}`}>
                                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                                <div className="space-y-1">
                                    <p className="text-sm font-medium">
                                        {getText(item.desc, `${language === "ar" ? "فائدة" : "Benefit"} ${index + 1}`)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            )}

            {/* What Distinguishes Us */}
            {(data.distingoshesUs?.length ?? 0) > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                            <Users className="h-5 w-5 text-green-500" />
                            {language === "ar" ? "ما يميزنا" : "What Makes Us Different"}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {data.distingoshesUs?.map((item, index) => (
                            <div key={index} className={`flex items-start gap-3 ${isRTL ? "flex-row-reverse text-right" : ""}`}>
                                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                                <div className="space-y-1">
                                    <p className="text-sm font-medium">
                                        {getText(item.description, `${language === "ar" ? "ميزة" : "Feature"} ${index + 1}`)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            )}

            {/* Technology Stack */}
            {hasTech && (
                <Card>
                    <CardHeader>
                        <CardTitle className={isRTL ? "text-right font-arabic" : ""}>
                            {language === "ar" ? "التقنيات المستخدمة" : "Technology Stack"}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {data.techUsedInService?.map((tech, index) => (
                            <div key={index} className={`p-4 border rounded-lg space-y-2 ${isRTL ? "text-right" : ""}`}>
                                <h4 className="font-semibold text-sm">
                                    {getText(tech.title, `${language === "ar" ? "تقنية" : "Technology"} ${index + 1}`)}
                                </h4>
                                <p className="text-sm text-gray-600">
                                    {getText(tech.desc, language === "ar" ? "وصف التقنية..." : "Technology description...")}
                                </p>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            )}

            {/* Design Phase */}
            {hasDesign && (
                <Card>
                    <CardHeader>
                        <CardTitle className={isRTL ? "text-right font-arabic" : ""}>
                            {getText(data.designPhase?.title, language === "ar" ? "عملية التصميم" : "Design Process")}
                        </CardTitle>
                        <CardDescription className={isRTL ? "text-right font-arabic" : ""}>
                            {getText(
                                data.designPhase?.desc,
                                language === "ar" ? "وصف عملية التصميم..." : "Design process description...",
                            )}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {data.designPhase?.satisfiedClientValues?.title && (
                            <div className={`text-center p-4 bg-blue-50 rounded-lg ${isRTL ? "text-right" : ""}`}>
                                <p className="font-semibold text-blue-700">{getText(data.designPhase.satisfiedClientValues.title)}</p>
                            </div>
                        )}

                        {data.designPhase?.values?.map((value, index) => (
                            <div
                                key={index}
                                className={`p-4 border-l-4 border-blue-500 bg-gray-50 ${isRTL ? "border-l-0 border-r-4 text-right" : ""}`}
                            >
                                <h4 className="font-semibold text-sm mb-1">
                                    {getText(value.title, `${language === "ar" ? "قيمة" : "Value"} ${index + 1}`)}
                                </h4>
                                <p className="text-sm text-gray-600">
                                    {getText(value.desc, language === "ar" ? "وصف القيمة..." : "Value description...")}
                                </p>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            )}

            {/* SEO Preview */}
            {hasSEO && (
                <Card>
                    <CardHeader>
                        <CardTitle className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                            <Globe className="h-5 w-5 text-blue-500" />
                            {language === "ar" ? "إعدادات SEO" : "SEO Configuration"}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {data.seo
                            ?.filter((seoItem) => seoItem.language === language)
                            .map((seoItem, index) => (
                                <div key={index} className={`p-4 border rounded-lg space-y-2 ${isRTL ? "text-right" : ""}`}>
                                    <div className="flex items-center gap-2">
                                        <Badge variant="outline">{getLanguageLabel(seoItem.language)}</Badge>
                                    </div>
                                    {seoItem.metaTitle && (
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase tracking-wide">
                                                {language === "ar" ? "عنوان الميتا" : "Meta Title"}
                                            </p>
                                            <p className="text-sm font-medium">{seoItem.metaTitle}</p>
                                        </div>
                                    )}
                                    {seoItem.metaDescription && (
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase tracking-wide">
                                                {language === "ar" ? "وصف الميتا" : "Meta Description"}
                                            </p>
                                            <p className="text-sm text-gray-600">{seoItem.metaDescription}</p>
                                        </div>
                                    )}
                                    {seoItem.keywords && (
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase tracking-wide">
                                                {language === "ar" ? "الكلمات المفتاحية" : "Keywords"}
                                            </p>
                                            <div className="flex flex-wrap gap-1 mt-1">
                                                {seoItem.keywords.split(",").map((keyword, i) => (
                                                    <Badge key={i} variant="secondary" className="text-xs">
                                                        {keyword.trim()}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                    </CardContent>
                </Card>
            )}

            {/* Completion Status */}
            <Card>
                <CardHeader>
                    <CardTitle className={`text-lg ${isRTL ? "text-right font-arabic" : ""}`}>
                        {language === "ar" ? "حالة إكمال النموذج" : "Form Completion"}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <div className={`flex items-center justify-between ${isRTL ? "flex-row-reverse" : ""}`}>
                            <span className="text-sm">{language === "ar" ? "المعلومات الأساسية" : "Basic Information"}</span>
                            <Badge variant={hasBasicInfo ? "default" : "secondary"}>
                                {hasBasicInfo
                                    ? language === "ar"
                                        ? "مكتمل"
                                        : "Complete"
                                    : language === "ar"
                                        ? "غير مكتمل"
                                        : "Incomplete"}
                            </Badge>
                        </div>
                        <div className={`flex items-center justify-between ${isRTL ? "flex-row-reverse" : ""}`}>
                            <span className="text-sm">{language === "ar" ? "الميزات" : "Features"}</span>
                            <Badge variant={hasFeatures ? "default" : "secondary"}>
                                {hasFeatures
                                    ? language === "ar"
                                        ? "مكتمل"
                                        : "Complete"
                                    : language === "ar"
                                        ? "غير مكتمل"
                                        : "Incomplete"}
                            </Badge>
                        </div>
                        <div className={`flex items-center justify-between ${isRTL ? "flex-row-reverse" : ""}`}>
                            <span className="text-sm">{language === "ar" ? "التقنيات" : "Technology"}</span>
                            <Badge variant={hasTech ? "default" : "secondary"}>
                                {hasTech
                                    ? language === "ar"
                                        ? "مكتمل"
                                        : "Complete"
                                    : language === "ar"
                                        ? "غير مكتمل"
                                        : "Incomplete"}
                            </Badge>
                        </div>
                        <div className={`flex items-center justify-between ${isRTL ? "flex-row-reverse" : ""}`}>
                            <span className="text-sm">SEO</span>
                            <Badge variant={hasSEO ? "default" : "secondary"}>
                                {hasSEO
                                    ? language === "ar"
                                        ? "مكتمل"
                                        : "Complete"
                                    : language === "ar"
                                        ? "غير مكتمل"
                                        : "Incomplete"}
                            </Badge>
                        </div>
                        <div className={`flex items-center justify-between ${isRTL ? "flex-row-reverse" : ""}`}>
                            <span className="text-sm">{language === "ar" ? "التصميم" : "Design"}</span>
                            <Badge variant={hasDesign ? "default" : "secondary"}>
                                {hasDesign
                                    ? language === "ar"
                                        ? "مكتمل"
                                        : "Complete"
                                    : language === "ar"
                                        ? "غير مكتمل"
                                        : "Incomplete"}
                            </Badge>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
