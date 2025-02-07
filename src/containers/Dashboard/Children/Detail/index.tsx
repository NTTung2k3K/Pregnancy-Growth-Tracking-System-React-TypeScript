import { IconBadge } from "@/components/IconBadge";
import { CircleArrowLeft, ClipboardPlus, Image, UserPen } from "lucide-react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { BASE_URL } from "@/services/config";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { API_ROUTES } from "@/routes/api";
import { useForm } from "react-hook-form";
import { ROUTES } from "@/routes";
import { formatDateSliceTime } from "@/lib/text";
import { Child } from "@/containers/Dashboard/Children/components/IChild";
import { GrowthCharts } from "../../Appointment/components/chart-record";

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

const ChildDashboardDetailContainer = () => {
  const { id } = useParams();
  const [child, setChild] = useState<Child>();
  const {
    register,
    setValue,

    formState: { errors },
  } = useForm<ChildFormValue>();

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
  }, []);

  return (
    <>
      <div className="px-32 my-10">
        <div className="flex items-center justify-between">
          <Link to={`${ROUTES.DASHBOARD_CHILDREN}`}>
            <Button className="bg-sky-900 text-emerald-400 hover:bg-sky-700">
              <CircleArrowLeft />
              Back
            </Button>
          </Link>
        </div>
        <div className="flex items-center justify-between mt-8">
          <div className="flex flex-col gap-y-2">
            <h1 className="text-2xl font-medium">Baby Detail</h1>
          </div>
        </div>
        <form>
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
                  disabled
                  className="flex-1 p-2"
                  {...register("name", {
                    required: "Full Name is required",
                  })}
                />
              </div>
              <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
                <div className="font-medium flex items-center mr-10">
                  Due Date
                </div>
                <input
                  disabled
                  type="date"
                  className="flex-1 p-2"
                  {...register("dueDate", {
                    required: "Due Date is required",
                  })}
                />
              </div>

              <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
                <div className="font-medium flex items-center mr-10">
                  Pregnancy Stage
                </div>
                <input
                  disabled
                  className="flex-1 p-2"
                  {...register("pregnancyStage", {
                    required: "Pregnancy Stage is required",
                  })}
                />
              </div>

              <div>
                <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
                  <div className="font-medium flex items-center mr-10">
                    Fetal Gender
                  </div>
                  <p>{child?.fetalGender}</p>
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
                  disabled
                  type="number"
                  className="flex-1 p-2"
                  {...register("weightEstimate", {
                    required: "Weight Estimate is required",
                  })}
                />
              </div>
              <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
                <div className="font-medium flex items-center mr-10">
                  Height Estimate
                </div>
                <input
                  disabled
                  type="number"
                  className="flex-1 p-2"
                  {...register("heightEstimate", {
                    required: "Height Estimate is required",
                  })}
                />
              </div>
              <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
                <div className="font-medium flex items-center mr-10">
                  Blood Type
                </div>
                <p>{child?.bloodType}</p>
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
                </div>
                <div className="flex items-center justify-center mt-4 border bg-slate-100 rounded-md p-4">
                  <img
                    className=""
                    width={200}
                    src={child?.photoUrl || ""}
                    alt="Img"
                  />
                </div>
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
                    disabled
                    className="flex-1 p-2"
                    {...register("deliveryPlan", {
                      required: "Delivery Plan is required",
                    })}
                  />
                </div>
                <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
                  <div className="font-medium flex items-center mr-10">
                    Complications
                  </div>
                  <input
                    disabled
                    className="flex-1 p-2"
                    {...register("complications", {
                      required: "Complications is required",
                    })}
                  />
                </div>
                <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
                  <div className="font-medium flex items-center mr-10">
                    Pregnancy Week At Birth
                  </div>
                  <input
                    disabled
                    className="flex-1 p-2"
                    {...register("pregnancyWeekAtBirth", {
                      required: "Pregnancy Week At Birth is required",
                    })}
                  />
                </div>
              </div>
            </div>
          </div>
        </form>
        <div className="my-10">{child && <GrowthCharts child={child} />}</div>
      </div>
    </>
  );
};

export default ChildDashboardDetailContainer;
