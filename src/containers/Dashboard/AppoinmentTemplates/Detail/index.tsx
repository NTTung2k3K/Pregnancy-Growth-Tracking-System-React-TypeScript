import { IconBadge } from "@/components/IconBadge";
import { CircleArrowLeft, Image, UserPen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import axios from "axios";
import { BASE_URL } from "@/services/config";
import { API_ROUTES } from "@/routes/api";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import toast from "react-hot-toast";
import { ROUTES } from "@/routes";
import { AvatarOverlay } from "@/components/AvatarOverlay";
import { Link, useParams } from "react-router-dom";
import { AppointmentTemplates } from "../components/IAppointmentTemplates";

interface AppointmentTemplatesFormValues {
  name: string;
  daysFromBirth: number;
  fee: number;
  description: string;
  status: number;
  dueDateStatus: string;
}

const AppointmentTemplatesDetailContainer = () => {
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
  const [, setIsLoading] = useState<boolean>(false);

  const [template, setTemplate] = useState<AppointmentTemplates>();
  const [isEditingImg] = useState<boolean>(false);

  const [dueDateStatus, setDueDateStatus] = useState<string | undefined>(
    undefined
  );

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
      setValue(
        "dueDateStatus",
        fetchedAppointmentTemplate.daysFromBirth < 0 ? "before" : "after"
      );
      setValue(
        "daysFromBirth",
        Math.abs(Math.floor(fetchedAppointmentTemplate.daysFromBirth / 7))
      );
      setDueDateStatus(
        fetchedAppointmentTemplate.daysFromBirth < 0 ? "before" : "after"
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
      setIsLoading(true);
      const image = imageFile ? imageFile : template?.image;
      console.log(image);
      const response = await axios.put(
        `${BASE_URL + API_ROUTES.DASHBOARD_APPOINTMENT_TEMPLATES_UPDATE}`,
        {
          Id: id,
          Name: data.name,
          DaysFromBirth:
            dueDateStatus === "before"
              ? -data.daysFromBirth * 7
              : data.daysFromBirth * 7,
          Fee: data.fee,
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
    } finally {
      setIsLoading(false);
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

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="p-6">
          <Link to={ROUTES.DASHBOARD_APPOINTMENT_TEMPLATES}>
            <Button className="bg-sky-900 text-emerald-400 hover:bg-sky-700 mb-10">
              <CircleArrowLeft />
              Back
            </Button>
          </Link>
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-y-2">
              <h1 className="text-2xl font-medium">
                 Appoinment Template Detail
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
                  Due date
                </div>
                <select
                  disabled
                  className="flex-1 p-2"
                  {...register("dueDateStatus")}
                  value={dueDateStatus}
                  onChange={(e) => setDueDateStatus(e.target.value)}
                >
                  <option value="">Select status</option>
                  <option value="before">Before</option>
                  <option value="after">After</option>
                </select>
              </div>
              <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
                <div className="font-medium flex items-center mr-10">Week</div>
                <input
                  disabled
                  type="number"
                  className="flex-1 p-2"
                  {...register("daysFromBirth", {
                    required: "Days From Birth is required",
                    min: {
                      value: 1,
                      message: "Value must be at least 1",
                    },
                    max: {
                      value: dueDateStatus === "before" ? 42 : 8,
                      message: `Value must be at most ${
                        dueDateStatus === "before" ? 42 : 8
                      }`,
                    },
                  })}
                />
              </div>
              {errors.daysFromBirth && (
                <p className="text-red-500">{errors.daysFromBirth.message}</p>
              )}

              <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
                <div className="font-medium flex items-center mr-10">Fee</div>
                <input
                  disabled
                  type="number"
                  step="1000"
                  className="flex-1 p-2"
                  {...register("fee", {
                    required: "Fee is required",
                    min: {
                      value: 100000,
                      message: "Fee must be at least 100000",
                    },
                    validate: {
                      positive: (value) =>
                        value > 0 || "Fee must be a positive number",
                      step: (value) =>
                        value % 1000 === 0 || "Fee must be a multiple of 1000",
                    },
                  })}
                />
              </div>
              {errors.fee && (
                <p className="text-red-500">{errors.fee.message}</p>
              )}

              <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
                <div className="font-medium flex items-center mr-10">
                  Description
                </div>
                <input
                  disabled
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
                    disabled
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
        </div>
      </form>
    </>
  );
};

export default AppointmentTemplatesDetailContainer;
