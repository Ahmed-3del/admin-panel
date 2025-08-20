import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarIcon, UserIcon, EyeIcon, TagIcon, LinkIcon } from "lucide-react"
import { format } from "date-fns"
import axios from "axios"
import { toast } from "sonner"
import Image from "next/image"

interface BlogViewModalProps {
  isOpen: boolean
  onClose: () => void
  blogId: string
}

// واجهة لبيانات المدونة بلغة واحدة
interface BlogData {
  _id: string
  title: string
  description: string
  content: string
  image: {
    url: string
    altText: string
  }
  section: Array<{
    title: string
    description: string
    image: {
      altText: string
      url?: string
    }
  }>
  categories: string[]
  author: string
  publishedDate: string
  seo: {
    language: string
    metaTitle: string
    metaDescription: string
    keywords: string
    canonicalTag: string
    structuredData: any
  }
  similarArticles: Array<{
    id: string
    title: string
    url: string
    image: {
      url: string
      altText: string
    }
  }>
}

// الواجهة الرئيسية التي تحتوي على اللغتين
interface BilingualBlogDetails {
  ar: BlogData
  en: BlogData
}

// مكون لعرض تفاصيل المدونة بلغة محددة
const BlogLanguageView = ({ blogData, language }: { blogData: BlogData, language: 'ar' | 'en' }) => (
  <div className="space-y-6" dir={language === 'ar' ? 'rtl' : 'ltr'}>
    <div className="space-y-4">
      <h1 className="text-3xl font-bold leading-tight">{blogData.title}</h1>
      <p className="text-lg text-muted-foreground">{blogData.description}</p>
      
      <div className="flex flex-wrap gap-4 items-center text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <UserIcon className="h-4 w-4" />
          <span>{blogData.author}</span>
        </div>
        <div className="flex items-center gap-2">
          <CalendarIcon className="h-4 w-4" />
          <span>{format(new Date(blogData.publishedDate), "MMM dd, yyyy 'at' HH:mm")}</span>
        </div>
      </div>

      {blogData.categories && blogData.categories.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <TagIcon className="h-4 w-4 text-muted-foreground" />
          {blogData.categories.map((category, index) => (
            <Badge key={index} variant="secondary">
              {category}
            </Badge>
          ))}
        </div>
      )}
    </div>

    <Separator />

    {blogData.image?.url && (
      <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
        <Image
          src={blogData.image.url}
          alt={blogData.image.altText || blogData.title}
          fill
          className="object-cover"
          onError={(e) => { e.currentTarget.style.display = 'none' }}
        />
      </div>
    )}

    <Card>
      <CardHeader>
        <CardTitle>{language === 'ar' ? 'المحتوى' : 'Content'}</CardTitle>
      </CardHeader>
      <CardContent>
        <div 
          className="prose prose-sm max-w-none dark:prose-invert"
          dangerouslySetInnerHTML={{ __html: blogData.content }}
        />
      </CardContent>
    </Card>

    {blogData.section && blogData.section.length > 0 && (
      <Card>
        <CardHeader>
          <CardTitle>{language === 'ar' ? 'الأقسام' : 'Sections'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {blogData.section.map((section, index) => (
            <div key={index} className="space-y-2">
              <h4 className="font-semibold">{section.title}</h4>
              <p className="text-sm text-muted-foreground">{section.description}</p>
              {section.image?.url && (
                <div className="relative aspect-video w-full max-w-sm overflow-hidden rounded border">
                  <Image
                    src={section.image.url}
                    alt={section.image.altText || section.title}
                    fill
                    className="object-cover"
                    onError={(e) => { e.currentTarget.style.display = 'none' }}
                  />
                </div>
              )}
              {index < blogData.section.length - 1 && <Separator />}
            </div>
          ))}
        </CardContent>
      </Card>
    )}

    <Card>
      <CardHeader>
        <CardTitle>{language === 'ar' ? 'معلومات تحسين محركات البحث (SEO)' : 'SEO Information'}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">{language === 'ar' ? 'اللغة' : 'Language'}</label>
            <p className="text-sm text-muted-foreground">{blogData.seo.language}</p>
          </div>
          <div>
            <label className="text-sm font-medium">{language === 'ar' ? 'عنوان الميتا' : 'Meta Title'}</label>
            <p className="text-sm text-muted-foreground">{blogData.seo.metaTitle}</p>
          </div>
        </div>
        <div>
          <label className="text-sm font-medium">{language === 'ar' ? 'وصف الميتا' : 'Meta Description'}</label>
          <p className="text-sm text-muted-foreground">{blogData.seo.metaDescription}</p>
        </div>
        <div>
          <label className="text-sm font-medium">{language === 'ar' ? 'الكلمات المفتاحية' : 'Keywords'}</label>
          <p className="text-sm text-muted-foreground">{blogData.seo.keywords}</p>
        </div>
        {blogData.seo.canonicalTag && (
          <div>
            <label className="text-sm font-medium">{language === 'ar' ? 'الرابط الأساسي' : 'Canonical URL'}</label>
            <div className="flex items-center gap-2">
              <LinkIcon className="h-4 w-4" />
              <a 
                href={blogData.seo.canonicalTag} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline"
              >
                {blogData.seo.canonicalTag}
              </a>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  </div>
);


export function BlogViewModal({ isOpen, onClose, blogId }: BlogViewModalProps) {
  const [blog, setBlog] = useState<BilingualBlogDetails | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const fetchBlogById = async (id: string) => {
    setIsLoading(true)
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}blogs/all/${id}`)
      setBlog(response.data.data)
    } catch (error: any) {
      const errorMessage = error.response?.data?.message ?? error.message ?? "Failed to fetch blog"
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (isOpen && blogId) {
      fetchBlogById(blogId)
    }
  }, [isOpen, blogId])

  const handleClose = () => {
    setBlog(null)
    onClose()
  }

  if (!isOpen) return null

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="flex items-center gap-2">
            <EyeIcon className="h-5 w-5" />
            Blog Details
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="max-h-[calc(90vh-80px)]">
          <div className="p-6 pt-4">
            {isLoading ? (
              <div className="flex items-center justify-center h-40">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : blog ? (
              <Tabs defaultValue="en" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="en">English</TabsTrigger>
                  <TabsTrigger value="ar">العربية</TabsTrigger>
                </TabsList>
                <TabsContent value="en" className="pt-4">
                  <BlogLanguageView blogData={blog.en} language="en" />
                </TabsContent>
                <TabsContent value="ar" className="pt-4">
                  <BlogLanguageView blogData={blog.ar} language="ar" />
                </TabsContent>
              </Tabs>
            ) : (
              <div className="flex items-center justify-center h-40">
                <p className="text-muted-foreground">Failed to load blog details</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
