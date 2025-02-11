import { IconBadge } from "@/components/IconBadge";
import { Image, FileText, CircleArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import axios from "axios";
import { BASE_URL } from "@/services/config";
import { API_ROUTES } from "@/routes/api";
import { useState } from "react";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AvatarOverlay } from "./components/AvatarOverlay";
import { AiOutlineLoading } from "react-icons/ai";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { ROUTES } from "@/routes";

interface BlogTypeFormValues {
  name: string;
  description: string;
  thumbnail: File | null;
}

const BlogTypeCreateContainer = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BlogTypeFormValues>({
    mode: "onChange",
  });

  const [imagePreview, setImagePreview] = useState<string | undefined>(
    undefined
  );
  const [imageFile, setImageFile] = useState<File | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onSubmit = async (data: BlogTypeFormValues) => {
    try {
      setIsLoading(true);

      const response = await axios.post(
        `${BASE_URL + API_ROUTES.DASHBOARD_BLOGTYPE_CREATE}`,
        {
          name: data.name,
          description: data.description,
          thumbnail: imageFile,
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response.data);

      if (response.data.statusCode === 200) {
        window.location.href = `/dashboard/blogtypes`;
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error creating blogtype:", error);
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
          <Link to={ROUTES.DASHBOARD_BLOGTYPES}>
            <Button className="bg-sky-900 text-emerald-400 hover:bg-sky-700 mt-10 mb-10">
              <CircleArrowLeft />
              Back
            </Button>
          </Link>
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-y-2">
              <h1 className="text-2xl font-medium">Create BlogType</h1>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={FileText} />
                <h2 className="text-xl text-sky-900 font-semibold">
                  BlogType Details
                </h2>
              </div>

              {/* Name Field */}
              <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
                <div className="font-medium flex items-center mr-10">Name</div>
                <input
                  className="flex-1 p-2"
                  {...register("name", { required: "Name is required" })}
                />
              </div>
              {errors.name && (
                <p className="text-red-500">{errors.name.message}</p>
              )}

              {/* Description Field */}
              <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
                <div className="font-medium flex items-center mr-10">
                  Description
                </div>
                <input
                  className="flex-1 p-2"
                  {...register("description", {
                    required: "Description is required",
                  })}
                />
              </div>
              {errors.description && (
                <p className="text-red-500">{errors.description.message}</p>
              )}

              {/* Thumbnail Upload */}
              <div className="space-y-6 mt-10">
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

export default BlogTypeCreateContainer;
