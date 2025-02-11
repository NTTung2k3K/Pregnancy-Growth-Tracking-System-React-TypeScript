import { IconBadge } from "@/components/IconBadge";
import { Image, FileText, CircleArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import axios from "axios";
import { BASE_URL } from "@/services/config";
import { API_ROUTES } from "@/routes/api";
import { useEffect, useState } from "react";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AvatarOverlay } from "./components/AvatarOverlay";
import { AiOutlineLoading } from "react-icons/ai";
import toast from "react-hot-toast";
import { Link, useParams } from "react-router-dom";
import { ROUTES } from "@/routes";

interface BlogTypeFormValues {
  name: string;
  description: string;
  thumbnail: File | null;
}

const BlogTypeUpdateContainer = () => {
  const { id } = useParams<{ id: string }>();
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<BlogTypeFormValues>({
    mode: "onChange",
  });

  const [imagePreview, setImagePreview] = useState<string | undefined>(undefined);
  const [imageFile, setImageFile] = useState<File | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchBlogType = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/blogtype/${id}`);
        console.log(response.data)
        if (response.data.resultObj) {
          setValue("name", response.data.resultObj.name);
          setValue("description", response.data.resultObj.description);
          setImagePreview(response.data.resultObj.thumbnail);
        }
      } catch (error) {
        console.error("Error fetching blog type:", error);
      }
    };
    fetchBlogType();
  }, [id, setValue]);

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

  const handleLoading = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 10000);
  };

  const onSubmit = async (data: BlogTypeFormValues) => {
    try {
      handleLoading();
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description);
      if (imageFile) formData.append("thumbnail", imageFile);

      const response = await axios.put(
        `${BASE_URL + API_ROUTES.DASHBOARD_BLOGTYPE_UPDATE}/${id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response.data.statusCode === 200) {
        toast.success(response.data.message);
        window.location.href = `/dashboard/blogtypes`;
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error updating blog type:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="p-6">
        <Link to={ROUTES.DASHBOARD_BLOGTYPES}>
          <Button className="bg-sky-900 text-emerald-400 hover:bg-sky-700 mt-10 mb-10">
            <CircleArrowLeft />
            Back
          </Button>
        </Link>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-medium">Update BlogType</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={FileText} />
              <h2 className="text-xl text-sky-900 font-semibold">BlogType Details</h2>
            </div>
            <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
              <div className="font-medium flex items-center mr-10">Name</div>
              <input className="flex-1 p-2" {...register("name", { required: "Name is required" })} />
            </div>
            {errors.name && <p className="text-red-500">{errors.name.message}</p>}

            <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
              <div className="font-medium flex items-center mr-10">Description</div>
              <textarea className="flex-1 p-2" {...register("description", { required: "Description is required" })} />
            </div>
            {errors.description && <p className="text-red-500">{errors.description.message}</p>}

            <div className="space-y-6 mt-10">
              <div>
                <div className="flex items-center gap-x-2">
                  <IconBadge icon={Image} />
                  <h2 className="text-xl text-sky-900 font-semibold">Thumbnail</h2>
                </div>
                <div className="flex justify-center">
                  <Avatar className="h-32 w-32 border text-center">
                    <AvatarImage src={imagePreview} />
                    <AvatarFallback className="flex w-full items-center justify-center bg-sky-800 text-8xl font-light text-emerald-400">?</AvatarFallback>
                    <AvatarOverlay onFileChange={handleFileChange} />
                  </Avatar>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center mt-10 mr-10">
        <Button type="submit" disabled={isLoading} className="bg-sky-900 hover:bg-sky-700 text-emerald-400 px-10 py-6 text-xl">
          {isLoading ? <AiOutlineLoading className="animate-spin" /> : "Update"}
        </Button>
      </div>
    </form>
  );
};

export default BlogTypeUpdateContainer;