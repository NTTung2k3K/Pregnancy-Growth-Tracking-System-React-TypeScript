import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { CircleArrowLeft } from "lucide-react";
import { BASE_URL } from "@/services/config";
import { ROUTES } from "@/routes";

export interface BlogTypeFormValues {
  name: string;
  description: string;
  thumbnail: string | File | null;
}

export interface BlogType {
  id: string;
  name: string;
  description: string;
  thumbnail: string | null;
}

const BlogTypeUpdateContainer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
    const [, setBlogType] = useState<BlogType | undefined>(undefined);

  // Quản lý state cho các trường form
  const [formValues, setFormValues] = useState<BlogTypeFormValues>({
    name: "",
    description: "",
    thumbnail: null,
  });

  // Quản lý preview ảnh và file ảnh mới nếu có thay đổi
  const [imagePreview, setImagePreview] = useState<string | undefined>(undefined);
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Fetch dữ liệu blogtype ban đầu khi component mount
  useEffect(() => {
    if (id) {
      fetchBlogType();
    }
  }, [id]);

  const fetchBlogType = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/blogtype/${id}`);
      const fetchedBlogType: BlogType = response.data.resultObj;
      setBlogType(fetchedBlogType);
      setFormValues({
        ...fetchedBlogType,
        thumbnail: fetchedBlogType.thumbnail || null,
      });
      setImagePreview(fetchedBlogType.thumbnail || undefined);
    } catch (error) {
      console.error("Failed to fetch blogtype:", error);
    }
  };

  // Xử lý thay đổi cho các input (name, description)
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Xử lý chọn file ảnh mới
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
      formData.append("name", formValues.name);
      formData.append("description", formValues.description);

      if (imageFile) {
        formData.append("thumbnail", imageFile); // Gửi file thực tế
      } else if (formValues.thumbnail == null) {
        formData.append("thumbnail", "null");
      } else {
        formData.append("thumbnail", formValues.thumbnail); // Gửi URL nếu cần
      }

      console.log(formValues)
      await axios.put(
        `${BASE_URL}/blogtype/update/${id}`,formData);
        navigate(ROUTES.DASHBOARD_BLOGTYPE_DETAIL.replace(":id", id!));
    } catch (error) {
      console.error("Failed to update blogtype:", error);
    }
  };

  return (
    <div className="p-6">
      <Link to={ROUTES.DASHBOARD_BLOGTYPES}>
        <Button className="bg-sky-900 text-emerald-400 hover:bg-sky-700">
          <CircleArrowLeft />
          Back
        </Button>
      </Link>
      <h1 className="text-2xl font-medium mt-8">Update BlogType</h1>
      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        {/* Field: Name */}
        <div>
          <label className="block font-medium">Name</label>
          <input
            type="text"
            name="name"
            value={formValues.name}
            onChange={handleInputChange}
            className="border p-2 rounded w-full"
            required
          />
        </div>
        {/* Field: Description */}
        <div>
          <label className="block font-medium">Description</label>
          <textarea
            name="description"
            value={formValues.description}
            onChange={handleInputChange}
            className="border p-2 rounded w-full"
            required
          ></textarea>
        </div>
        {/* Field: Thumbnail */}
        <div>
          <label className="block font-medium">Thumbnail</label>
          <div className="flex items-center gap-4">
            {/* Hiển thị preview nếu có */}
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
            {/* Input file chọn ảnh mới */}
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={handleThumbnailChange}
                className="border border-gray-300 p-2 rounded cursor-pointer"
              />
              <p className="text-sm text-gray-500">
                Choose a new image (JPG, PNG, etc.).
              </p>
            </div>
          </div>
        </div>
        <Button type="submit" className="w-full bg-blue-600 text-white">
          Update BlogType
        </Button>
      </form>
    </div>
  );
};

export default BlogTypeUpdateContainer;