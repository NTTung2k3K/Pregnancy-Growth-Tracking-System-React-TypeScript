import { CircleArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import axios from "axios";
import { BASE_URL } from "@/services/config";
import { API_ROUTES } from "@/routes/api";
import { useEffect, useState } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { ROUTES } from "@/routes";

interface MembershipPackageFormValues {
  packageName: string;
  description: string;
  price: number;
  duration: number;
  status: string;
  packageLevel: string;
  originalPrice: number;
  imageUrl: string;
  discount: number;
  showPriority: number;
  maxRecordAdded: number;
  maxGrowthChartShares: number;
  maxAppointmentCanBooking: number;
  hasGenerateAppointments: boolean;
  hasStandardDeviationAlerts: boolean;
  hasViewGrowthChart: boolean;
}

export interface MembershipPackage {
  packageName: string;
  description: string;
  price: number;
  duration: number;
  status: string;
  packageLevel: string;
  originalPrice: number;
  imageUrl: string;
  discount: number;
  showPriority: number;
  maxRecordAdded: number;
  maxGrowthChartShares: number;
  hasGenerateAppointments: boolean;
  hasStandardDeviationAlerts: boolean;
  hasViewGrowthChart: boolean;
}

export interface Status {
  id: number;
  status: string;
}
export interface PackageLevel {
  id: number;
  status: string;
}
const MembershipPackageCreateContainer = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MembershipPackageFormValues>({
    mode: "onChange",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [status, setStatus] = useState<Status[]>([]);
  const [packageLevel, setPackageLevel] = useState<PackageLevel[]>([]);

  const fetchStatus = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/membershippackages/get-membership-package-status-handler`
      );
      setStatus(response.data.resultObj.status);
      setPackageLevel(response.data.resultObj.packageLevel);
    } catch (error) {
      console.error("Failed to fetch roles:", error);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const onSubmit = async (data: MembershipPackageFormValues) => {
    try {
      setIsLoading(true);
      const response = await axios.post(
        `${BASE_URL + API_ROUTES.DASHBOARD_MEMBERSHIPPACKAGE_CREATE}`,
        {
          packageName: data.packageName,
          description: data.description,
          originalPrice: unformatNumber(displayValue),
          duration: data.duration,
          status: data.status,
          packageLevel: data.packageLevel,
          discount: data.discount,
          showPriority: data.showPriority,
          imageUrl: null,
          maxRecordAdded: data.maxRecordAdded,
          maxGrowthChartShares: data.maxGrowthChartShares,
          maxAppointmentCanBooking: data.maxAppointmentCanBooking,
          hasGenerateAppointments: data.hasGenerateAppointments,
          hasStandardDeviationAlerts: data.hasStandardDeviationAlerts,
          hasViewGrowthChart: data.hasViewGrowthChart,
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.data.statusCode === 200) {
        window.location.href = `/dashboard/membership-packages`;
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Failed to create MembershipPackage:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const [displayValue, setDisplayValue] = useState(""); // Giá trị hiển thị trong input

  const formatNumber = (value: string) => {
    if (!value) return "";
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const unformatNumber = (value: string) => {
    if (!value) return "";
    return value.replace(/\./g, "");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    // Loại bỏ ký tự không phải số
    const rawValue = unformatNumber(inputValue);

    // Không cho phép hiển thị chuỗi quá dài
    if (rawValue.length > 15) return;

    // Định dạng lại và cập nhật giá trị hiển thị
    setDisplayValue(formatNumber(rawValue));
  };
  return (
    <>
      <div className="p-6">
        <Link to={ROUTES.DASHBOARD_MEMBERSHIPPACKAGE}>
          <Button className="bg-sky-900 text-emerald-400 hover:bg-sky-700">
            <CircleArrowLeft />
            Back
          </Button>
        </Link>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-y-2">
                <h1 className="text-2xl font-medium">
                  Create membership package
                </h1>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                {/* Username Field */}
                <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
                  <div className="font-medium flex items-center mr-10 w-1/6 ">
                    Package Name
                  </div>
                  <input
                    className="flex-1 p-2 bg-white"
                    {...register("packageName", {
                      required: "Package Name is required",
                      minLength: {
                        value: 2,
                        message: "Package name must be at least 2 characters",
                      },
                    })}
                  />
                </div>
                {errors.packageName && (
                  <p className="text-red-500">{errors.packageName.message}</p>
                )}
                <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
                  <div className="font-medium flex items-center mr-10 w-1/6">
                    Description
                  </div>
                  <textarea
                    className="flex-1 p-2 bg-white h-40"
                    {...register("description", {
                      minLength: {
                        value: 2,
                        message: "Description must be at least 2 characters",
                      },
                    })}
                  />
                </div>
                {errors.description && (
                  <p className="text-red-500">{errors.description.message}</p>
                )}
                <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
                  <div className="font-medium flex items-center mr-10 w-1/6 ">
                    Original Price
                  </div>
                  <input
                    {...register("originalPrice", {
                      required: "Original price is required",
                    })}
                    className="flex-1 p-2 bg-white"
                    value={displayValue} // Hiển thị giá trị định dạng
                    onChange={handleInputChange} // Xử lý khi người dùng nhập
                    onBlur={
                      (e) => register("originalPrice").onBlur(e) // Gọi hàm onBlur mặc định của react-hook-form nếu cần
                    }
                  />
                </div>
                {errors.originalPrice && (
                  <p className="text-red-500">{errors.originalPrice.message}</p>
                )}
                <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
                  <div className="font-medium flex items-center mr-10 w-1/6 ">
                    Discount(%)
                  </div>
                  <input
                    type="number"
                    className="flex-1 p-2 bg-white"
                    {...register("discount", {
                      required: "Discount is required",
                      validate: (value) =>
                        value >= 0 || "Discount must be positive",
                    })}
                    min={1}
                  />
                </div>
                {errors.discount && (
                  <p className="text-red-500">{errors.discount.message}</p>
                )}
                <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
                  <div className="font-medium flex items-center mr-10 w-1/6">
                    Duration
                  </div>
                  <input
                    type="number"
                    className="flex-1 p-2 bg-white"
                    {...register("duration", {
                      required: "Duration is required",
                      validate: (value) => {
                        const numValue = Number(value);
                        return (
                          numValue === -1 ||
                          numValue > 0 ||
                          "Only -1 or a positive number is allowed"
                        );
                      },
                    })}
                  />
                </div>
                {errors.duration && (
                  <p className="text-red-500">{errors.duration.message}</p>
                )}

                <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
                  <div className="font-medium flex items-center mr-10 w-1/6 ">
                    Max Record Added
                  </div>
                  <input
                    type="number"
                    className="flex-1 p-2 bg-white"
                    {...register("maxRecordAdded", {
                      required: "maxRecordAdded is required",
                      validate: (value) => {
                        const numValue = Number(value);
                        return (
                          numValue === -1 ||
                          numValue > 0 ||
                          "Only -1 or a positive number is allowed"
                        );
                      },
                    })}
                    min={1}
                  />
                </div>
                {errors.maxRecordAdded && (
                  <p className="text-red-500">
                    {errors.maxRecordAdded.message}
                  </p>
                )}
                <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
                  <div className="font-medium flex items-center mr-10 w-1/6 ">
                    Max Growth Chart Shared
                  </div>
                  <input
                    type="number"
                    className="flex-1 p-2 bg-white"
                    {...register("maxGrowthChartShares", {
                      required: "maxGrowthChartShares is required",
                      validate: (value) => {
                        const numValue = Number(value);
                        return (
                          numValue === -1 ||
                          numValue > 0 ||
                          "Only -1 or a positive number is allowed"
                        );
                      },
                    })}
                    min={1}
                  />
                </div>
                {errors.maxGrowthChartShares && (
                  <p className="text-red-500">
                    {errors.maxGrowthChartShares.message}
                  </p>
                )}
              </div>

              <div className="space-y-6">
                <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
                  <div className="font-medium flex items-center mr-10 w-1/6 ">
                    Max Appointment Can Booking
                  </div>
                  <input
                    type="number"
                    className="flex-1 p-2 bg-white"
                    {...register("maxAppointmentCanBooking", {
                      required: "Max Appointment CanBooking is required",
                      validate: (value) => {
                        const numValue = Number(value);
                        return (
                          numValue === -1 ||
                          numValue > 0 ||
                          "Only -1 or a positive number is allowed"
                        );
                      },
                    })}
                    min={1}
                  />
                </div>
                {errors.maxAppointmentCanBooking && (
                  <p className="text-red-500">
                    {errors.maxAppointmentCanBooking.message}
                  </p>
                )}
                <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
                  <div className="font-medium flex items-center mr-10 w-1/6 ">
                    Show priority
                  </div>
                  <input
                    type="number"
                    className="flex-1 p-2 bg-white"
                    {...register("showPriority", {
                      required: " Show priority is required",
                      validate: (value) =>
                        value > 0 || "Show priority must be greater than 0",
                    })}
                    min={1}
                  />
                </div>
                {errors.showPriority && (
                  <p className="text-red-500">{errors.showPriority.message}</p>
                )}
                <div>
                  <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
                    <div className="font-medium flex items-center mr-10 w-1/6 ">
                      Package Level
                    </div>
                    <select
                      className="flex-1 p-2 bg-white"
                      {...register("packageLevel", {
                        required: "Package Level is required",
                      })}
                    >
                      <option value="">Select package level</option>
                      {packageLevel.map((item: PackageLevel) => (
                        <option value={item.id}>{item.status}</option>
                      ))}
                    </select>
                  </div>
                </div>
                {errors.packageLevel && (
                  <p className="text-red-500">{errors.packageLevel.message}</p>
                )}
                <div>
                  <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
                    <div className="font-medium flex items-center mr-10 w-1/6 ">
                      Status
                    </div>
                    <select
                      className="flex-1 p-2 bg-white"
                      {...register("status", {
                        required: "Status Level is required",
                      })}
                    >
                      <option value="">Select status</option>
                      {status.map((item) => (
                        <option value={item.id}>{item.status}</option>
                      ))}
                    </select>
                  </div>
                </div>
                {errors.packageLevel && (
                  <p className="text-red-500">{errors.packageLevel.message}</p>
                )}
                <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
                  <input
                    type="checkbox"
                    className=" p-2 bg-white mr-4"
                    {...register("showPriority")}
                  />
                  <div className="flex-1 font-medium flex items-center mr-10 w-1/6 ">
                    Has Generate Appointments
                  </div>
                </div>
                <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
                  <input
                    type="checkbox"
                    className=" p-2 bg-white mr-4"
                    {...register("hasStandardDeviationAlerts")}
                  />
                  <div className="flex-1 font-medium flex items-center mr-10 w-1/6 ">
                    Has Standard Deviation Alerts
                  </div>
                </div>
                <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
                  <input
                    type="checkbox"
                    className=" p-2 bg-white mr-4"
                    {...register("hasViewGrowthChart")}
                  />
                  <div className="flex-1 font-medium flex items-center mr-10 w-1/6 ">
                    Has View Growth Chart
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
      </div>
    </>
  );
};

export default MembershipPackageCreateContainer;
