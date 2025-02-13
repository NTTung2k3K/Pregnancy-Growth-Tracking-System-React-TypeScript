/* eslint-disable no-prototype-builtins */
import { IconBadge } from "@/components/IconBadge";
import {
  CircleArrowLeft,
  ClipboardPlus,
  Image,
  Trash,
  UserPen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { BASE_URL } from "@/services/config";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { API_ROUTES } from "@/routes/api";
import { useForm } from "react-hook-form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AvatarOverlay } from "@/components/AvatarOverlay";
import { AiOutlineLoading } from "react-icons/ai";
import { ROUTES } from "@/routes";
import toast from "react-hot-toast";
import { formatDateSliceTime } from "@/lib/text";
import { Child } from "@/containers/Dashboard/Children/components/IChild";
import { GrowthCharts } from "@/containers/Dashboard/Appointment/components/chart-record";
import AddRecordForm from "./components/AddRecordForm";
import ShareGrowthChart from "@/containers/Children/Detail/components/share-growth-chart";
import { CookiesService } from "@/services/cookies.service";

interface ChildFormValue {
  name: string;
  fetalGender: number;
  pregnancyStage: string;
  weightEstimate: number;
  heightEstimate: number;
  dueDate: string;
  deliveryPlan: string;
  complications: string;
  bloodType: string;
  pregnancyWeekAtBirth: string;
  isGenerateSampleAppointments: boolean;
}

const ChildDetailContainer = () => {
  const { id } = useParams();
  const userId = CookiesService.get();
  const [child, setChild] = useState<Child>();
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<ChildFormValue>();
  const [imageTemp, setImageTemp] = useState<string | undefined>(undefined);
  const [imageFile, setImageFile] = useState<File | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isEditingImg, setIsEditingImg] = useState<boolean>(false);

  const [isMember, setIsMember] = useState<boolean>(false);

  const fetchIsMember = async () => {
    try {
      const response = await axios.get(`${BASE_URL + API_ROUTES.IS_MEMBER}`, {
        params: { id: userId },
      });
      setIsMember(response.data.resultObj);
    } catch (error) {
      console.error("Failed to fetch employee:", error);
    }
  };

  const fetchChild = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL + API_ROUTES.CHILD_DETAIL}/${id}`
      );
      const fetchedChild = response.data.resultObj;
      setChild(response.data.resultObj);

      // Set form values
      for (const key in fetchedChild) {
        if (fetchedChild.hasOwnProperty(key)) {
          setValue(key as keyof ChildFormValue, fetchedChild[key]);
        }
      }
      setValue("fetalGender", fetchedChild.gender === "1" ? 1 : 0);
      setValue("dueDate", formatDateSliceTime(fetchedChild.dueDate));
    } catch (error) {
      console.error("Failed to fetch employee:", error);
    }
  };

  useEffect(() => {
    fetchChild();
    fetchIsMember();
  }, []);

  const onSubmit = async (data: ChildFormValue) => {
    try {
      setIsLoading(true);
      const response = await axios.put(
        `${BASE_URL + API_ROUTES.CHILD_UPDATE}/${id}`,
        {
          userId: child?.userId,
          name: data.name,
          fetalGender: data.fetalGender,
          pregnancyStage: data.pregnancyStage,
          weightEstimate: data.weightEstimate,
          heightEstimate: data.heightEstimate,
          dueDate: data.dueDate,
          deliveryPlan: data.deliveryPlan,
          complications: data.complications,
          pregnancyWeekAtBirth: data.pregnancyWeekAtBirth,
          isGenerateSampleAppointments: false,
          photoUrl: imageFile,
          bloodType: data.bloodType,
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.data.statusCode === 200) {
        window.location.href = `${ROUTES.CHILDREN_DETAIL.replace(
          ":id",
          String(id)
        )}`;
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Failed to update child:", error);
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

  const handleEditClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsEditingImg(true);
  };
  const handleUndoClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsEditingImg(false);
  };

  const handleDelete = async (id: string) => {
    const confirm = window.confirm(" Do you really want to delete?");
    if (!confirm) return;

    try {
      await axios.delete(`${BASE_URL + API_ROUTES.CHILD_DELETE}/${id}`);
      window.location.href = `${ROUTES.CHILDREN}`;
      toast.success("Deleted successfully");
    } catch (error) {
      console.error("Failed to delete child:", error);
      toast.error("Please login again to refresh token");
    }
  };

  if (!child) return <p>Loading child data...</p>;

  return (
    <>
      <div className="px-32 my-10">
        <div className="flex items-center justify-between">
          <Link to={`${ROUTES.CHILDREN}`}>
            <Button className="bg-sky-900 text-emerald-400 hover:bg-sky-700">
              <CircleArrowLeft />
              Back
            </Button>
          </Link>
          <Button
            onClick={() => handleDelete(id!)}
            className="bg-sky-900 text-emerald-400"
          >
            <Trash />
          </Button>
        </div>

        <div className="flex items-center justify-center mt-8">
          <div className="flex gap-y-2">
            <h1 className="text-2xl font-bold text-sky-800">Baby Detail</h1>
          </div>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={UserPen} />
                <h2 className="text-xl text-sky-900 font-semibold">
                  Baby Profile
                </h2>
              </div>
              <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
                <div className="font-medium flex items-center mr-10">
                  Full Name
                </div>
                <input
                  className="flex-1 p-2"
                  {...register("name", {
                    required: "Full Name is required",
                  })}
                />
              </div>
              {errors.name && (
                <span className="text-red-500 text-sm">
                  {errors.name.message}
                </span>
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
                <span className="text-red-500 text-sm">
                  {errors.dueDate.message}
                </span>
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
                <span className="text-red-500 text-sm">
                  {errors.pregnancyStage.message}
                </span>
              )}

              <div>
                <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
                  <div className="font-medium flex items-center mr-10">
                    Fetal Gender
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
                    validate: (value) =>
                      value > 0 ? true : "Weight must be a positive number",
                  })}
                />
              </div>
              {errors.weightEstimate && (
                <span className="text-red-500 text-sm">
                  {errors.weightEstimate.message}
                </span>
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
                <span className="text-red-500 text-sm">
                  {errors.heightEstimate.message}
                </span>
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
            </div>

            <div className="space-y-6">
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
                {child?.photoUrl && !isEditingImg ? (
                  <div className="flex items-center justify-center mt-4 border bg-slate-100 rounded-md p-4">
                    <img
                      className=""
                      width={200}
                      src={child?.photoUrl || ""}
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
                <div className="flex items-center justify-between gap-x-2">
                  <div className="flex items-center">
                    <IconBadge icon={ClipboardPlus} />
                    <h2 className="ml-4 text-xl text-sky-900 font-semibold">
                      Medical
                    </h2>
                  </div>
                </div>
                <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
                  <div className="font-medium flex items-center mr-10">
                    Delivery Plan
                  </div>
                  <input
                    className="flex-1 p-2"
                    {...register("deliveryPlan", {
                      required: "Delivery Plan is required",
                    })}
                  />
                </div>
                {errors.deliveryPlan && (
                  <span className="text-red-500 text-sm">
                    {errors.deliveryPlan.message}
                  </span>
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
                  <span className="text-red-500 text-sm">
                    {errors.complications.message}
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
                  <span className="text-red-500 text-sm">
                    {errors.pregnancyWeekAtBirth.message}
                  </span>
                )}
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
        </form>
        <div className="flex items-center justify-center mt-8">
          <div className="flex gap-y-2">
            <h1 className="text-2xl font-bold text-sky-800">
              Fetal Growth Record
            </h1>
          </div>
        </div>
        {isMember && (
          <>
            <div className="my-10 flex items-center justify-center">
              {child && <GrowthCharts child={child} />}
            </div>
            <div className="flex items-center justify-center my-10">
              <AddRecordForm child={child} />
              <div className="mx-3"></div>
              <ShareGrowthChart key={child.id} child={child} />
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default ChildDetailContainer;
