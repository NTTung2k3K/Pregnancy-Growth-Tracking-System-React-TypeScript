import { IconBadge } from "@/components/IconBadge";
import { Image, UserPen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import axios from "axios";
import { BASE_URL } from "@/services/config";
import { API_ROUTES } from "@/routes/api";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AiOutlineLoading } from "react-icons/ai";
import toast from "react-hot-toast";
import { ROUTES } from "@/routes";
import { AvatarOverlay } from "@/components/AvatarOverlay";
import { CookiesService } from "@/services/cookies.service";

interface ChildFormValues {
  id: string;
  userId: string;
  name: string;
  fetalGender: string;
  pregnancyStage: string;
  weightEstimate: number;
  heightEstimate: number;
  dueDate: string;
  deliveryPlan: string;
  complications: string;
  photoUrl: string;
  bloodType: string;
  pregnancyWeekAtBirth: number;
  isGenerateSampleAppointments: boolean;
}

const ChildCreateContainer = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ChildFormValues>({
    mode: "onChange",
  });

  const [imageTemp, setImageTemp] = useState<string | undefined>(undefined);
  const [imageFile, setImageFile] = useState<File | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const id = CookiesService.get();

  const handleLoading = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 10000);
  };

  const onSubmit = async (data: ChildFormValues) => {
    if (id) {
      try {
        handleLoading();
        const response = await axios.post(
          `${BASE_URL + API_ROUTES.CHILD_CREATE}`,
          {
            UserId: id,
            Name: data.name,
            FetalGender: data.fetalGender,
            PregnancyStage: data.pregnancyStage,
            WeightEstimate: data.weightEstimate,
            HeightEstimate: data.heightEstimate,
            DueDate: data.dueDate,
            DeliveryPlan: data.deliveryPlan,
            Complications: data.complications,
            PhotoUrl: imageFile,
            BloodType: data.bloodType,
            PregnancyWeekAtBirth: data.pregnancyWeekAtBirth,
            IsGenerateSampleAppointments: data.isGenerateSampleAppointments,
          },
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        if (response.data.statusCode === 200) {
          window.location.href = `${ROUTES.CHILDREN}`;
          toast.success(response.data.message);
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        console.error("Failed to create employee:", error);
      }
    } else {
      toast.error("Please login to create child");
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
      <form onSubmit={handleSubmit(onSubmit)} className="px-32 mb-20">
        <div className="p-6">
          <div className="flex items-center justify-center">
            <div className="flex flex-col gap-y-2">
              <h1 className="text-3xl font-medium text-sky-900">Create Baby</h1>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={UserPen} />
                <h2 className="text-xl text-sky-900 font-semibold">
                  Baby Profile
                </h2>
              </div>

              {/* Username Field */}
              <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
                <div className="font-medium flex items-center mr-10">
                  Full Name
                </div>
                <input
                  className="flex-1 p-2"
                  {...register("name", {
                    required: "Name is required",
                    minLength: {
                      value: 4,
                      message: "Name must be at least 4 characters",
                    },
                  })}
                />
              </div>
              {errors.name && (
                <p className="text-red-500">{errors.name.message}</p>
              )}
              <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
                <div className="font-medium flex items-center mr-10">
                  Due Date
                </div>
                <input
                  type="date"
                  className="flex-1 p-2"
                  {...register("dueDate", {
                    required: "Due Date is required",
                  })}
                />
              </div>
              {errors.dueDate && (
                <p className="text-red-500">{errors.dueDate.message}</p>
              )}

              <div>
                <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
                  <div className="font-medium flex items-center mr-10">
                    Gender
                  </div>
                  <select
                    className="flex-1 p-2"
                    {...register("fetalGender", {
                      required: "Gender is required",
                    })}
                  >
                    <option value="">Select Gender</option>
                    <option value="1">Male</option>
                    <option value="0">Female</option>
                  </select>
                </div>
              </div>
              {errors.fetalGender && (
                <p className="text-red-500">{errors.fetalGender.message}</p>
              )}

              <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
                <div className="font-medium flex items-center mr-10">
                  Pregnancy Stage
                </div>
                <input
                  className="flex-1 p-2"
                  {...register("pregnancyStage", {
                    required: "Pregnancy Stage is required",
                  })}
                />
              </div>
              {errors.pregnancyStage && (
                <p className="text-red-500">{errors.pregnancyStage.message}</p>
              )}
              <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
                <div className="font-medium flex items-center mr-10">
                  Weight Estimate
                </div>
                <input
                  type="number"
                  step="any"
                  className="flex-1 p-2"
                  {...register("weightEstimate", {
                    required: "Weight Estimate is required",
                    setValueAs: (value) =>
                      value ? parseFloat(value) : undefined,
                  })}
                />
              </div>
              {errors.weightEstimate && (
                <p className="text-red-500">{errors.weightEstimate.message}</p>
              )}
              <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
                <div className="font-medium flex items-center mr-10">
                  Height Estimate
                </div>
                <input
                  type="number"
                  step="any"
                  className="flex-1 p-2"
                  {...register("heightEstimate", {
                    required: "Height Estimate is required",
                    setValueAs: (value) =>
                      value ? parseFloat(value) : undefined,
                  })}
                />
              </div>
              {errors.heightEstimate && (
                <p className="text-red-500">{errors.heightEstimate.message}</p>
              )}
            </div>

            <div className="space-y-6">
              <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
                <div className="font-medium flex items-center mr-10">
                  DeliveryPlan
                </div>
                <input
                  className="flex-1 p-2"
                  {...register("deliveryPlan", {
                    required: "Delivery Plan is required",
                  })}
                />
              </div>
              {errors.deliveryPlan && (
                <p className="text-red-500">{errors.deliveryPlan.message}</p>
              )}
              <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
                <div className="font-medium flex items-center mr-10">
                  Complications
                </div>
                <input
                  className="flex-1 p-2"
                  {...register("complications", {
                    required: "Complications is required",
                  })}
                />
              </div>
              {errors.complications && (
                <p className="text-red-500">{errors.complications.message}</p>
              )}

              <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
                <div className="font-medium flex items-center mr-10">
                  Blood Type
                </div>
                <select
                  className="flex-1 p-2"
                  {...register("bloodType", {
                    required: "Blood Type is required",
                  })}
                >
                  <option value="">Select Group</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>
              {errors.bloodType && (
                <span className="text-red-500 text-sm">
                  {errors.bloodType.message}
                </span>
              )}
              <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
                <div className="font-medium flex items-center mr-10">
                  Pregnancy Week At Birth
                </div>
                <input
                  className="flex-1 p-2"
                  {...register("pregnancyWeekAtBirth", {
                    required: "Pregnancy Week At Birth is required",
                  })}
                />
              </div>
              {errors.pregnancyWeekAtBirth && (
                <p className="text-red-500">
                  {errors.pregnancyWeekAtBirth.message}
                </p>
              )}
              <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    {...register("isGenerateSampleAppointments")}
                  />
                  <label
                    htmlFor="terms"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Accept to generate sample appointments
                  </label>
                </div>
              </div>
              {/* Image Upload */}
              <div>
                <div className="flex items-center gap-x-2">
                  <IconBadge icon={Image} />
                  <h2 className="text-xl text-sky-900 font-semibold">Image</h2>
                </div>
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
              </div>
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

export default ChildCreateContainer;
