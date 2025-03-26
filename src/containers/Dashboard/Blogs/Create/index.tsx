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
import { CookiesEmployeeService } from "@/services/cookies.service";
import { Editor } from "@tinymce/tinymce-react";
import { Link } from "react-router-dom";
import { ROUTES } from "@/routes";

interface BlogFormValues {
  title: string;
  content: string;
  week: number | null;
  authorId: string;
  blogTypeId: number;
  thumbnail: File;
  status: string;
  sources: string;
}

const BlogCreateContainer = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<BlogFormValues>({
    mode: "onChange",
  });

  const [imagePreview, setImagePreview] = useState<string | undefined>(
    undefined
  );
  const [imageFile, setImageFile] = useState<File | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [blogTypes, setBlogTypes] = useState<any[]>([]);
  const [statusOptions, setStatusOptions] = useState<any[]>([]);

  useEffect(() => {
    const fetchedUserId = CookiesEmployeeService.get();
    if (fetchedUserId !== null && fetchedUserId !== undefined) {
      setValue("authorId", fetchedUserId);
    }

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

    const fetchStatus = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/blog/get-status-handler`);
        setStatusOptions(response.data.resultObj || []);
      } catch (error) {
        console.error("Error fetching status:", error);
        setStatusOptions([]);
      }
    };

    fetchBlogTypes();
    fetchStatus();
  }, [setValue]);

  const onEditorChange = (content: string) => {
    setValue("content", content);
  };

  const onSubmit = async (data: BlogFormValues) => {
    try {
      setIsLoading(true);

      const response = await axios.post(
        `${BASE_URL + API_ROUTES.DASHBOARD_BLOG_CREATE}`,
        {
          title: data.title,
          content: data.content,
          authorId: data.authorId,
          week: data.week,
          blogTypeId: data.blogTypeId,
          status: data.status,
          sources: data.sources,
          thumbnail: imageFile,
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.statusCode === 200) {
        window.location.href = `/dashboard/blogs`;
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error creating blog:", error);
    } finally {
      setIsLoading(false);
    }
  };

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
              <h1 className="text-2xl font-medium">Create Blog</h1>
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

              {/* Author Field */}
              <div className="hidden mt-4 border bg-slate-100 rounded-md p-4">
                <div className="font-medium flex items-center mr-10">
                  Author
                </div>
                <input
                  className="flex-1 p-2"
                  readOnly
                  {...register("authorId", { required: "Author is required" })}
                />
              </div>

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

              <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
                <div className="font-medium flex items-center mr-10">Week</div>
                <input
                  type="number"
                  className="flex-1 p-2"
                  {...register("week", {
                    setValueAs: (value) =>
                      value === "" ? null : parseInt(value, 10),
                    validate: (value) =>
                      (value != null && value > 0) ||
                      "Week must be a positive number",
                  })}
                />
              </div>
              {errors.week && (
                <span className="text-red-500 text-sm">
                  {errors.week.message}
                </span>
              )}

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
                <input
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
        <div className="p-6">
          {/* Content Field */}
          <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center mr-10">Content</div>
            <div>
              <Editor
                apiKey="fopyhr808wdoc86vvbb3f6wx6ntkawc2mhcpm38t08kk2bxy"
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
                }}
                initialValue="Welcome to TinyMCE!"
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

export default BlogCreateContainer;
