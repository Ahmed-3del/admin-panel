/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable security/detect-object-injection */
/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable complexity */
/* eslint-disable max-lines */
"use client";

import { useState } from "react";
import { format } from "date-fns";
import axios from "axios";
import { toast } from "sonner";

import { DataTable } from "@/components/data-table/data-table";
import { TableActions } from "@/components/data-table/table-actions";
import { Badge } from "@/components/ui/badge";
import { useModal } from "@/hooks/use-modal";
import useGetBlogs from "@/modules/main/hooks/use-get-blogs";
import { BlogViewModal } from "@/modules/blogs/modals/view-blog-modal";
import { Blog } from "@/modules/blogs/types";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Plus, Eye, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function BlogsPage() {
  const { blogs, isLoading, refetch } = useGetBlogs();
  const { openModal } = useModal();
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedBlogId, setSelectedBlogId] = useState<string>("");
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const router = useRouter();
  const { t } = useTranslation();

  const createBlog = async (formData: FormData) => {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}blogs`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      refetch();
    } catch (error: unknown) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message || error.message
        : "Failed to create blog";
      toast.error(message);
      throw error;
    }
  };

  const updateBlog = async (data: { id: string; formData: FormData }) => {
    try {
      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}blogs/${data.id}`, data.formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      refetch();
    } catch (error: unknown) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message || error.message
        : "Failed to update blog";
      toast.error(message);
      throw error;
    }
  };

  const deleteBlog = async (id: string) => {
    try {
      setIsDeleting(id);
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}blogs/${id}`);
      toast.success("Blog deleted successfully");
      refetch();
    } catch (error: unknown) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message || error.message
        : "Failed to delete blog";
      toast.error(message);
    } finally {
      setIsDeleting(null);
    }
  };

  const handleViewBlog = (blogId: string) => {
    setSelectedBlogId(blogId);
    setViewModalOpen(true);
  };

  const handleEditBlog = (blogId: string) => {
    router.push(`/dashboard/blogs/edit/${blogId}`);
  };

  const blogsData = !isLoading && Array.isArray(blogs) ? blogs : [];
  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <header className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold">{t("blogs.title")}</h1>
          <p className="text-muted-foreground">{t("blogs.description")}</p>
        </header>
        <Button
          onClick={() => router.push("/dashboard/blogs/create-blog")}
          className="bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          {t("blogs.add_button_text")}
        </Button>
      </div>

      {blogsData.length > 0 ? (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 ">
          {blogsData.map((blog: Blog) => (
            <Card key={blog._id} className="p-4 flex flex-col justify-between hover:shadow-lg transition-shadow">
              <div>
                <h2 className="text-lg font-semibold truncate mb-1" title={blog.title}>
                  {blog.title}
                </h2>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {blog.description}
                </p>

                <div className="mt-2 flex flex-wrap gap-1">
                  {blog.categories?.slice(0, 2).map((cat, i) => (
                    <Badge key={i} variant="secondary" className="text-xs">
                      {cat}
                    </Badge>
                  ))}
                  {blog.categories?.length > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{blog.categories.length - 2}
                    </Badge>
                  )}
                </div>

                <p className="text-xs text-muted-foreground mt-2">
                  {format(new Date(blog.createdAt), "MMM dd, yyyy")}
                </p>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleViewBlog(blog._id)}
                  className="flex items-center gap-1 text-blue-600 hover:text-blue-700"
                >
                  <Eye className="w-3 h-3" />
                  {t("blogs.view_button_text")}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEditBlog(blog._id)}
                  className="flex items-center gap-1 text-green-600 hover:text-green-700"
                >
                  <Edit className="w-3 h-3" />
                  {t("blogs.edit_button_text")}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openModal("deleteBlog", {
                    data: blog,
                    onConfirm: () => deleteBlog(blog._id),
                    refetch,
                  })}
                  disabled={isDeleting === blog._id}
                  className="flex items-center gap-1 text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-3 h-3" />
                  {isDeleting === blog._id ? "Deleting..." : t("blogs.delete_blog")}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center text-muted-foreground py-12">
          <div className="max-w-md mx-auto">
            <h3 className="text-lg font-medium mb-2">{t("blogs.empty_message")}</h3>
            <p className="text-sm mb-4">{t("blogs.add_button_text")}</p>
            <Button
              onClick={() => router.push("/dashboard/blogs/create-blog")}
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              {t("blogs.add_button_text")}
            </Button>
          </div>
        </div>
      )}

      <BlogViewModal
        isOpen={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        blogId={selectedBlogId}
      />
    </div>
  );
}

