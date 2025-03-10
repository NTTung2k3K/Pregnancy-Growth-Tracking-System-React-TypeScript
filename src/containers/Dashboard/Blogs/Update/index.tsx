import { IconBadge } from "@/components/IconBadge";
import { Image, FileText, CircleArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import axios from "axios";
import { BASE_URL } from "@/services/config";
import { API_ROUTES } from "@/routes/api";
import { useState, useEffect } from "react";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AvatarOverlay } from "./components/AvatarOverlay";
import { AiOutlineLoading } from "react-icons/ai";
import toast from "react-hot-toast";
import { Editor } from "@tinymce/tinymce-react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ROUTES } from "@/routes";

interface BlogFormValues {
  title: string;
  content: string;
  week: number | null;
  authorId: string;
  blogTypeId: number;
  thumbnail: File | string;
  status: string;
  sources: string;
}

const BlogUpdateContainer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, dirtyFields },
    reset,
    setValue,
  } = useForm<BlogFormValues>({ mode: "onChange" });

  const [imagePreview, setImagePreview] = useState<string | undefined>(
    undefined
  );
  const [imageFile, setImageFile] = useState<File | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [blogTypes, setBlogTypes] = useState<any[]>([]);
  const [statusOptions, setStatusOptions] = useState<any[]>([]);
  const [editorContent, setEditorContent] = useState(""); // State cho nội dung Editor

  // Khi component mount, load dữ liệu blog, danh sách blog types và status options
  useEffect(() => {
    if (id) {
      fetchBlog();
    }
    fetchBlogTypes();
    fetchStatus();
  }, [id]);

  // Lấy dữ liệu blog theo id và điền vào form bằng reset()
  const fetchBlog = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/blog/${id}`);
      const blogData = response.data.resultObj;
      // Lấy id của blog type từ blogTypeModelView
      const blogTypeId = blogData.blogTypeModelView?.id || 0;
      const authorId = blogData.authorResponseModel?.id;
      reset({
        title: blogData.title,
        content: blogData.content,
        week: blogData.week,
        authorId: authorId,
        blogTypeId: blogTypeId,
        status: blogData.status,
        sources: blogData.sources,
        thumbnail: blogData.thumbnail || "",
      });
      // Cập nhật giá trị cho Editor
      setEditorContent(blogData.content);
      if (blogData.thumbnail) {
        setImagePreview(blogData.thumbnail);
      }
    } catch (error) {
      console.error("Error fetching blog data:", error);
    }
  };

  // Lấy danh sách blog types từ API
  const fetchBlogTypes = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL + API_ROUTES.DASHBOARD_BLOGTYPES}`
      );
      setBlogTypes(response.data.resultObj.items);
    } catch (error) {
      console.error("Error fetching blog types:", error);
    }
  };

  // Lấy danh sách status từ API
  const fetchStatus = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/blog/get-status-handler`);
      setStatusOptions(response.data.resultObj || []);
    } catch (error) {
      console.error("Error fetching status:", error);
      setStatusOptions([]);
    }
  };

  const onEditorChange = (content: string) => {
    setEditorContent(content);
    setValue("content", content);
  };

  const handleLoading = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 10000);
  };

  const onSubmit = async (data: BlogFormValues) => {
    try {
      handleLoading();

      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("content", editorContent); // dùng giá trị của Editor
      formData.append("authorId", data.authorId);

      // Nếu người dùng đã thay đổi week (dirty), mới append trường này
      if (dirtyFields.week) {
        formData.append("week", data.week !== null ? data.week.toString() : "");
      }

      formData.append("blogTypeId", data.blogTypeId.toString());
      formData.append("status", data.status);
      formData.append("sources", data.sources);

      // Nếu có file mới, gửi file, nếu không thì gửi URL cũ (nếu có)
      if (imageFile) {
        formData.append("thumbnail", imageFile);
      } else if (data.thumbnail) {
        formData.append("thumbnail", data.thumbnail);
      }

      const response = await axios.put(
        `${BASE_URL + API_ROUTES.DASHBOARD_BLOG_UPDATE}/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (
        response.data.isSuccessed ||
        response.data.message === "Blog updated successfully."
      ) {
        toast.success(response.data.message);
        navigate(ROUTES.DASHBOARD_BLOGS);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error updating blog:", error);
      toast.error("An error occurred while updating the blog");
    } finally {
      setIsLoading(false);
    }
  };

  // Xử lý thay đổi file ảnh (thumbnail)
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
      const newImageUrl = URL.createObjectURL(file);
      setImagePreview(newImageUrl);
      setImageFile(file);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="p-6">
          <Link to={ROUTES.DASHBOARD_BLOGS}>
            <Button className="bg-sky-900 text-emerald-400 hover:bg-sky-700">
              <CircleArrowLeft />
              Back
            </Button>
          </Link>
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-y-2">
              <h1 className="text-2xl font-medium">Update Blog</h1>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={FileText} />
                <h2 className="text-xl text-sky-900 font-semibold">
                  Blog Details
                </h2>
              </div>

              {/* Title Field */}
              <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
                <div className="font-medium flex items-center mr-10">Title</div>
                <input
                  className="flex-1 p-2"
                  {...register("title", { required: "Title is required" })}
                />
              </div>
              {errors.title && (
                <p className="text-red-500">{errors.title.message}</p>
              )}

              {/* Author Field (ẩn hoàn toàn) */}
              <input
                type="hidden"
                {...register("authorId", { required: "Author is required" })}
              />

              {/* Blog Type Field */}
              <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
                <div className="font-medium flex items-center mr-10">
                  Blog Type
                </div>
                <select
                  className="flex-1 p-2"
                  {...register("blogTypeId", {
                    required: "Blog Type is required",
                    valueAsNumber: true,
                  })}
                >
                  <option value="">Select Blog Type</option>
                  {blogTypes.length > 0 ? (
                    blogTypes.map((blogType) => (
                      <option key={blogType.id} value={blogType.id}>
                        {blogType.name}
                      </option>
                    ))
                  ) : (
                    <option disabled>No blog types available</option>
                  )}
                </select>
              </div>
              {errors.blogTypeId && (
                <p className="text-red-500">{errors.blogTypeId.message}</p>
              )}

              {/* Week Field */}
              <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
                <div className="font-medium flex items-center mr-10">Week</div>
                <input
                  type="number"
                  className="flex-1 p-2"
                  {...register("week", {
                    setValueAs: (value) =>
                      value === "" ? null : parseInt(value, 10),
                  })}
                />
              </div>

              {/* Status Field */}
              <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
                <div className="font-medium flex items-center mr-10">
                  Status
                </div>
                <select
                  className="flex-1 p-2"
                  {...register("status", { required: "Status is required" })}
                >
                  <option value="">Select status</option>
                  {statusOptions && statusOptions.length > 0 ? (
                    statusOptions.map((s: any) => (
                      <option key={s.id} value={s.id}>
                        {s.status}
                      </option>
                    ))
                  ) : (
                    <option disabled>Loading status...</option>
                  )}
                </select>
              </div>
              {errors.status && (
                <p className="text-red-500">{errors.status.message}</p>
              )}

              {/* Sources Field */}
              <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
                <div className="font-medium flex items-center mr-10">
                  Sources
                </div>
                <textarea
                  className="flex-1 p-2"
                  {...register("sources", { required: "Sources are required" })}
                />
              </div>
              {errors.sources && (
                <p className="text-red-500">{errors.sources.message}</p>
              )}
            </div>

            {/* Thumbnail Upload */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-x-2">
                  <IconBadge icon={Image} />
                  <h2 className="text-xl text-sky-900 font-semibold">
                    Thumbnail
                  </h2>
                </div>
                <div className="flex justify-center">
                  <Avatar className="h-32 w-32 border text-center">
                    <AvatarImage src={imagePreview} />
                    <AvatarFallback className="flex w-full items-center justify-center bg-sky-800 text-8xl font-light text-emerald-400">
                      ?
                    </AvatarFallback>
                    <AvatarOverlay onFileChange={handleFileChange} />
                  </Avatar>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Field */}
        <div className="p-6">
          <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center mr-10">Content</div>
            <div>
              <Editor
                apiKey="l9ld25hhisp2urw4o17zzc2y3nre42t6xpxlcfqgme6tnv9z"
                value={editorContent}
                init={{
                  plugins: [
                    "anchor",
                    "autolink",
                    "charmap",
                    "codesample",
                    "emoticons",
                    "image",
                    "link",
                    "lists",
                    "media",
                    "searchreplace",
                    "table",
                    "visualblocks",
                    "wordcount",
                    "checklist",
                    "mediaembed",
                    "casechange",
                    "export",
                    "formatpainter",
                    "pageembed",
                    "a11ychecker",
                    "tinymcespellchecker",
                    "permanentpen",
                    "powerpaste",
                    "advtable",
                    "advcode",
                    "editimage",
                    "advtemplate",
                    "ai",
                    "mentions",
                    "tinycomments",
                    "tableofcontents",
                    "footnotes",
                    "mergetags",
                    "autocorrect",
                    "typography",
                    "inlinecss",
                    "markdown",
                    "importword",
                    "exportword",
                    "exportpdf",
                  ],
                  toolbar:
                    "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat",
                  tinycomments_mode: "embedded",
                  tinycomments_author: "Author name",
                  ai_request: (_request: any, respondWith: any) =>
                    respondWith.string(() =>
                      Promise.reject("See docs to implement AI Assistant")
                    ),
                  images_upload_handler: async (blobInfo) => {
                    const file = blobInfo.blob();
                    const formData = new FormData();
                    formData.append("Image", file, blobInfo.filename());
                    try {
                      const response = await axios.post(
                        `${BASE_URL}/users/upload-image`,
                        formData,
                        {
                          headers: {
                            "Content-Type": "multipart/form-data",
                          },
                        }
                      );
                      if (
                        response.data &&
                        response.data.resultObj &&
                        response.data.resultObj.imageUrl
                      ) {
                        return response.data.resultObj.imageUrl;
                      } else {
                        throw new Error("Upload failed: Invalid response");
                      }
                    } catch (error: any) {
                      console.error("Image upload error:", error);
                      throw error;
                    }
                  },
                }}
                onEditorChange={onEditorChange}
              />
            </div>
          </div>
          {errors.content && (
            <p className="text-red-500">{errors.content.message}</p>
          )}
        </div>

        <div className="flex items-center justify-center mt-10 mr-10">
          <Button
            type="submit"
            disabled={isLoading}
            className="bg-sky-900 hover:bg-sky-700 text-emerald-400 px-10 py-6 text-xl"
          >
            {isLoading ? (
              <AiOutlineLoading className="animate-spin" />
            ) : (
              "Submit"
            )}
          </Button>
        </div>
      </form>
    </>
  );
};

export default BlogUpdateContainer;
