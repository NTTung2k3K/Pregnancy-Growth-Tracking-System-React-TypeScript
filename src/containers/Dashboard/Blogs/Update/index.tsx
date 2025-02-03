import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Editor } from "@tinymce/tinymce-react";
import { Button } from "@/components/ui/button";
import { CircleArrowLeft } from "lucide-react";
import { BASE_URL } from "@/services/config";
import { ROUTES } from "@/routes";

export interface BlogFormValues {
  title: string;
  content: string;
  week: number | null;
  authorId: string;
  blogTypeId: number;
  isFeatured: boolean;
  thumbnail: string | File | null; 
  likesCount: number;
  viewCount: number;
  status: string;
  sources: string;
}

export interface Blog {
  id: string;
  title: string;
  content: string;
  week: number | null;
  authorId: string;
  blogTypeId: number;
  isFeatured: boolean;
  thumbnail: string | null;
  likesCount: number;
  viewCount: number;
  status: string;
  sources: string;
}

const BlogUpdateContainer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [, setBlog] = useState<Blog | undefined>(undefined);
  const [imagePreview, setImagePreview] = useState<string | undefined>(undefined);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [formValues, setFormValues] = useState<BlogFormValues>({
    title: "",
    content: "",
    week: null,
    authorId: "",
    blogTypeId: 0,
    isFeatured: false,
    thumbnail: null,
    likesCount: 0,
    viewCount: 0,
    status: "",
    sources: "",
  });

  useEffect(() => {
    if (id) {
      fetchBlog();
    }
  }, [id]);

  const fetchBlog = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/blog/${id}`);
      const fetchedBlog: Blog = response.data.resultObj;
      setBlog(fetchedBlog);
      setFormValues({
        ...fetchedBlog,
        thumbnail: fetchedBlog.thumbnail || null,
      });
      setImagePreview(fetchedBlog.thumbnail || undefined);
    } catch (error) {
      console.error("Failed to fetch blog:", error);
    }
  };

  // Hàm chuyển File sang chuỗi Base64
  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  // Xử lý khi thay đổi input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setFormValues((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  // Xử lý thay đổi nội dung Editor
  const handleEditorChange = (content: string) => {
    setFormValues((prev) => ({ ...prev, content }));
  };

  // Xử lý chọn file ảnh
  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
  
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setFormValues((prev) => ({ ...prev, thumbnail: file }));
    } else {
      setImagePreview(undefined);
      setImageFile(null);
      setFormValues((prev) => ({ ...prev, thumbnail: null }));
    }
  };
  

  // Xử lý submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("title", formValues.title);
      formData.append("content", formValues.content);
      formData.append("week", formValues.week?.toString() || "");
      formData.append("authorId", formValues.authorId);
      formData.append("blogTypeId", formValues.blogTypeId.toString());
      formData.append("isFeatured", formValues.isFeatured.toString());
      formData.append("likesCount", formValues.likesCount.toString());
      formData.append("viewCount", formValues.viewCount.toString());
      formData.append("status", formValues.status);
      formData.append("sources", formValues.sources);
      
      // Nếu có ảnh mới, chuyển thành base64
      if (imageFile) {
        const base64String = await convertFileToBase64(imageFile);
        formData.append("thumbnail", base64String);
      } else if (formValues.thumbnail) {
        // Nếu thumbnail không phải null, append ảnh gốc
        formData.append("thumbnail", formValues.thumbnail);
      }
      
      await axios.put(`${BASE_URL}/blog/update/${id}`, formData);
      navigate(ROUTES.DASHBOARD_BLOG_DETAIL.replace(":id", id!));
    } catch (error) {
      console.error("Failed to update blog:", error);
    }
  };
  

  return (
    <div className="p-6">
      <Link to={ROUTES.DASHBOARD_BLOGS}>
        <Button className="bg-sky-900 text-emerald-400 hover:bg-sky-700">
          <CircleArrowLeft />
          Back
        </Button>
      </Link>
      <h1 className="text-2xl font-medium mt-8">Update Blog</h1>
      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        {/* Title */}
        <div>
          <label className="block font-medium">Title</label>
          <input
            type="text"
            name="title"
            value={formValues.title}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            required
          />
        </div>
        {/* Content với TinyMCE Editor */}
        <div>
          <label className="block font-medium">Content</label>
          <Editor
            apiKey="rcdz0k6v268ooj7bboucuugdnfclrmjyhwihtuxuf7vz8ugk"
            init={{
              plugins: ['image', 'link', 'lists', 'media', 'table', 'visualblocks'],
              toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline | link image | numlist bullist',
            }}
            initialValue={formValues.content}
            onEditorChange={handleEditorChange}
          />
        </div>
        {/* Week */}
        <div>
          <label className="block font-medium">Week</label>
          <input
            type="number"
            name="week"
            value={formValues.week === null ? "" : formValues.week}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
          <p className="text-sm text-gray-500">Week can null.</p>
        </div>
        {/* Author ID */}
        <div>
          <label className="block font-medium">Author ID</label>
          <input
            readOnly
            type="text"
            name="authorId"
            value={formValues.authorId}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            required
          />
        </div>
        {/* Blog Type ID */}
        <div>
          <label className="block font-medium">Blog Type ID</label>
          <input
            type="number"
            name="blogTypeId"
            value={formValues.blogTypeId}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            required
          />
        </div>
        {/* Featured */}
        <div className="flex items-center gap-x-2">
          <label className="block font-medium">Featured</label>
          <input
            type="checkbox"
            name="isFeatured"
            checked={formValues.isFeatured}
            onChange={handleChange}
            className="p-2"
          />
        </div>
    {/* Thumbnail */}
    <div>
        <label className="block font-medium">Thumbnail</label>
        <div className="flex items-center gap-4">
            {/* Display image preview if there's one */}
            {imagePreview ? (
            <div className="relative">
                <img
                src={imagePreview}
                alt="Thumbnail Preview"
                className="w-32 h-32 object-cover rounded shadow"
                />
                <button
                type="button"
                className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"
                onClick={() => {
                    setImagePreview(undefined);
                    setImageFile(null);
                    setFormValues((prev) => ({ ...prev, thumbnail: null }));
                }}
                >
                ✕
                </button>
            </div>
            ) : formValues.thumbnail === null ? (
            <span>No Thumbnail</span>
            ) : null}
            {/* Input file to choose a new image */}
            <div>
            <input
                type="file"
                accept="image/*"
                onChange={handleThumbnailChange}
                className="border border-gray-300 p-2 rounded cursor-pointer"
            />
            <p className="text-sm text-gray-500">Choose a new image (JPG, PNG, etc.).</p>
            </div>
        </div>
    </div>


        {/* Like Count */}
        <div>
          <label className="block font-medium">Like Count</label>
          <input
            type="number"
            name="likesCount"
            value={formValues.likesCount}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            required
          />
        </div>
        {/* View Count */}
        <div>
          <label className="block font-medium">View Count</label>
          <input
            type="number"
            name="viewCount"
            value={formValues.viewCount}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            required
          />
        </div>
        {/* Status */}
        <div>
          <label className="block font-medium">Status</label>
          <input
            type="text"
            name="status"
            value={formValues.status}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            required
          />
        </div>
        {/* Sources */}
        <div>
          <label className="block font-medium">Sources</label>
          <input
            type="text"
            name="sources"
            value={formValues.sources}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            required
          />
        </div>
        <Button type="submit" className="w-full bg-blue-600 text-white">
          Update Blog
        </Button>
      </form>
    </div>
  );
};

export default BlogUpdateContainer;