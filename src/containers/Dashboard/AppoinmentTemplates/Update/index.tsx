import { IconBadge } from "@/components/IconBadge";
import { CircleArrowLeft, Image, UserPen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import axios from "axios";
import { BASE_URL } from "@/services/config";
import { API_ROUTES } from "@/routes/api";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AiOutlineLoading } from "react-icons/ai";
import toast from "react-hot-toast";
import { ROUTES } from "@/routes";
import { AvatarOverlay } from "@/components/AvatarOverlay";
import { Link, useParams } from "react-router-dom";
import { AppointmentTemplates } from "../components/IAppointmentTemplates";

interface AppointmentTemplatesFormValues {
  name: string;
  daysFromBirth: number;
  description: string;
  status: number;
}

const AppointmentTemplatesUpdateContainer = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<AppointmentTemplatesFormValues>({
    mode: "onChange",
  });

  const { id } = useParams();

  const [imageTemp, setImageTemp] = useState<string | undefined>(undefined);
  const [imageFile, setImageFile] = useState<File | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [template, setTemplate] = useState<AppointmentTemplates>();
  const [isEditingImg, setIsEditingImg] = useState<boolean>(false);

  const handleLoading = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 10000);
  };

  const fetchAppointmentTemplate = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL + API_ROUTES.DASHBOARD_APPOINTMENT_TEMPLATES_DETAIL}`,
        {
          params: { Id: id },
        }
      );
      const fetchedAppointmentTemplate = response.data.resultObj;

      for (const key in fetchedAppointmentTemplate) {
        if (fetchedAppointmentTemplate.hasOwnProperty(key)) {
          setValue(
            key as keyof AppointmentTemplatesFormValues,
            fetchedAppointmentTemplate[key]
          );
        }
      }
      setValue(
        "status",
        fetchedAppointmentTemplate.status === "Active" ? 1 : 0
      );
      setTemplate(fetchedAppointmentTemplate);
    } catch (error) {
      console.error("Failed to fetch template:", error);
    }
  };

  useEffect(() => {
    fetchAppointmentTemplate();
  }, []);

  const onSubmit = async (data: AppointmentTemplatesFormValues) => {
    try {
      handleLoading();
      const image = imageFile ? imageFile : template?.image;
      console.log(image);
      const response = await axios.put(
        `${BASE_URL + API_ROUTES.DASHBOARD_APPOINTMENT_TEMPLATES_UPDATE}`,
        {
          Id: id,
          Name: data.name,
          DaysFromBirth: data.daysFromBirth,
          Description: data.description,
          Status: Number(data.status),
          Image: imageFile ? imageFile : null,
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.data.statusCode === 200) {
        window.location.href = `${ROUTES.DASHBOARD_APPOINTMENT_TEMPLATES}`;
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Failed to update template:", error);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (imageTemp) {
        URL.revokeObjectURL(imageTemp);
      }
      const newImageUrl = URL.createObjectURL(file);
      setImageTemp(newImageUrl);
      setImageFile(file);
    }
  };

  const handleEditClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsEditingImg(true);
  };
  const handleUndoClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsEditingImg(false);
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="p-6 mt-20">
          <Link to={ROUTES.DASHBOARD_APPOINTMENT_TEMPLATES}>
            <Button className="bg-sky-900 text-emerald-400 hover:bg-sky-700 mb-10">
              <CircleArrowLeft />
              Back
            </Button>
          </Link>
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-y-2">
              <h1 className="text-2xl font-medium">
                Create Appoinment Template
              </h1>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={UserPen} />
                <h2 className="text-xl text-sky-900 font-semibold">
                  Information
                </h2>
              </div>

              <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
                <div className="font-medium flex items-center mr-10">Name</div>
                <input
                  className="flex-1 p-2"
                  {...register("name", {
                    required: "Name is required",
                  })}
                />
              </div>
              {errors.name && (
                <p className="text-red-500">{errors.name.message}</p>
              )}

              <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
                <div className="font-medium flex items-center mr-10">
                  Day From Birth
                </div>
                <input
                  type="number"
                  className="flex-1 p-2"
                  {...register("daysFromBirth", {
                    required: "Days From Birth Name is required",
                  })}
                />
              </div>
              {errors.daysFromBirth && (
                <p className="text-red-500">{errors.daysFromBirth.message}</p>
              )}

              {/* Address Field */}
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
            </div>

            <div className="space-y-6">
              {/* Image Upload */}
              <div>
                <div className="flex items-center justify-between gap-x-2">
                  <div className="flex items-center">
                    <IconBadge icon={Image} />
                    <h2 className="ml-4 text-xl text-sky-900 font-semibold">
                      Image
                    </h2>
                  </div>
                  {isEditingImg ? (
                    <div className="">
                      <Button
                        onClick={handleUndoClick}
                        className="bg-sky-900 hover:bg-sky-700 text-emerald-400 "
                      >
                        Undo
                      </Button>
                    </div>
                  ) : (
                    <div className="">
                      <Button
                        onClick={handleEditClick}
                        className="bg-sky-900 hover:bg-sky-700 text-emerald-400 "
                      >
                        Edit
                      </Button>
                    </div>
                  )}
                </div>
                {template?.image && !isEditingImg ? (
                  <div className="flex items-center justify-center mt-4 border bg-slate-100 rounded-md p-4">
                    <img
                      className=""
                      width={200}
                      src={template?.image || ""}
                      alt="Img"
                    />
                  </div>
                ) : (
                  <div className="space-y-1">
                    <div className="flex justify-center">
                      <Avatar className="h-32 w-32 border text-center ">
                        <AvatarImage src={imageTemp} />
                        <AvatarFallback className="flex w-full items-center justify-center bg-sky-800 text-8xl font-light text-emerald-400">
                          ?
                        </AvatarFallback>
                        <AvatarOverlay onFileChange={handleFileChange} />
                      </Avatar>
                    </div>
                  </div>
                )}
              </div>
              <div>
                <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
                  <div className="font-medium flex items-center mr-10">
                    Status
                  </div>
                  <select
                    className="flex-1 p-2"
                    {...register("status", {
                      required: "Status is required",
                    })}
                  >
                    <option value="">Select Status</option>
                    <option value="1">Active</option>
                    <option value="0">Inactive</option>
                  </select>
                </div>
              </div>
              {errors.status && (
                <p className="text-red-500">{errors.status.message}</p>
              )}
            </div>
          </div>
          <div className="flex items-center justify-end mt-10 mr-10">
            <Button
              disabled={isLoading}
              className="bg-sky-900 hover:bg-sky-700 text-emerald-400 px-10 py-6 text-xl"
              type="submit"
            >
              {isLoading && <AiOutlineLoading className="animate-spin" />}
              Save
            </Button>
          </div>
        </div>
      </form>
    </>
  );
};

export default AppointmentTemplatesUpdateContainer;
