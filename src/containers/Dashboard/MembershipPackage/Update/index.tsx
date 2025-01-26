import { IconBadge } from "@/components/IconBadge";
import { CircleArrowLeft, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import axios from "axios";
import { BASE_URL } from "@/services/config";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AiOutlineLoading } from "react-icons/ai";
import toast from "react-hot-toast";
import { ROUTES } from "@/routes";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AvatarOverlay } from "@/containers/Dashboard/MembershipPackage/Create/components/AvatarOverlay";
import { log } from "console";

interface MembershipPackageFormValues {
  id: number;
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
}

export interface MembershipPackage {
  id: number;
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
}

interface Status {
  id: number;
  status: string;
}
interface PackageLevel {
  id: number;
  status: string;
}
const MembershipPackageUpdateContainer = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<MembershipPackageFormValues>({
    mode: "onChange",
  });
  const [displayValue, setDisplayValue] = useState(""); // Giá trị hiển thị trong input

  const { id } = useParams();
  const [membershipPackage, setMembershipPackage] =
    useState<MembershipPackage>();

  const [imageTemp, setImageTemp] = useState<string | undefined>(undefined);
  const [imageFile, setImageFile] = useState<File | undefined>(undefined);

  const [status, setStatus] = useState<Status[]>([]);
  const [packageLevel, setPackageLevel] = useState<PackageLevel[]>([]);

  const fetchStatus = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/membershippackages/get-membership-package-status-handler`
      );
      setStatus(response.data.resultObj.status);
      setPackageLevel(response.data.resultObj.packageLevel);
      return response.data.resultObj;
    } catch (error) {
      console.error("Failed to fetch roles:", error);
    }
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fetchMembershipPackage = async (statusData: any) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/membershippackages/get-by-id`,
        {
          params: { id: id },
        }
      );
      const fetchedMembershipPackage = response.data.resultObj;

      // Set form values using setValue
      setValue("id", fetchedMembershipPackage.id || "");
      setValue("packageName", fetchedMembershipPackage.packageName || "");
      setValue("description", fetchedMembershipPackage.description || "");
      setValue("price", fetchedMembershipPackage.price || "");
      setValue("duration", fetchedMembershipPackage.duration || "");
      setValue("originalPrice", fetchedMembershipPackage.originalPrice || "");
      setValue("discount", fetchedMembershipPackage.discount || "");
      setValue("showPriority", fetchedMembershipPackage.showPriority || "");
      setValue("imageUrl", fetchedMembershipPackage.imageUrl || "");

      const statusId = statusData.status.find(
        (x) => x.status === fetchedMembershipPackage.status
      )?.id;

      const packageLevelId = statusData.packageLevel.find(
        (x) => x.status === fetchedMembershipPackage.packageLevel
      )?.id;
      setValue("status", statusId?.toString() || "0");
      setValue("packageLevel", packageLevelId?.toString() || "0");
      setDisplayValue(
        formatNumber(fetchedMembershipPackage.originalPrice.toString())
      );
      // setValue("status", fetchedMembershipPackage.status == "Active" ? 1 : 0);

      setMembershipPackage(fetchedMembershipPackage);
    } catch (error) {
      console.error("Failed to fetch MembershipPackage:", error);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      const statusData = await fetchStatus(); // Lấy dữ liệu status
      if (statusData) {
        await fetchMembershipPackage(statusData); // Truyền dữ liệu status vào
      }
    };
    fetchData();
  }, []);

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
    // Block spacing character
    if (inputValue.includes(" ")) return;

    // Loại bỏ ký tự không phải số
    const rawValue = unformatNumber(inputValue);

    // Không cho phép hiển thị chuỗi quá dài
    if (rawValue.length > 15) return;

    // Định dạng lại và cập nhật giá trị hiển thị
    setDisplayValue(formatNumber(rawValue));
  };

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleLoading = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 10000);
  };

  const onSubmit = async (data: MembershipPackageFormValues) => {
    try {
      handleLoading();

      const response = await axios.put(
        `${BASE_URL}/membershippackages/update`,
        {
          id: data.id,
          packageName: data.packageName,
          description: data.description,
          originalPrice: unformatNumber(displayValue),
          duration: data.duration,
          status: data.status,
          packageLevel: data.packageLevel,
          discount: data.discount,
          showPriority: data.showPriority,
          imageUrl: imageFile ? imageFile : null,
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
      console.error("Failed to update MembershipPackage:", error);
    }
  };

  return (
    <div>
      <div className="mt-10">
        <Link className="p-6" to={ROUTES.DASHBOARD_MEMBERSHIPPACKAGE}>
          <Button className="bg-sky-900 text-emerald-400 hover:bg-sky-700">
            <CircleArrowLeft />
            Back
          </Button>
        </Link>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-y-2">
              <h1 className="text-2xl font-medium">
                Update membership package
              </h1>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
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
                <div className="font-medium flex items-center mr-10 w-1/6  w-1/6">
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
                <div className="font-medium flex items-center mr-10 w-1/6 ">
                  Duration
                </div>
                <input
                  type="number"
                  className="flex-1 p-2 bg-white"
                  {...register("duration", {
                    required: "Duration is required",
                    validate: (value) =>
                      value > 0 || "Duration must be positive",
                  })}
                  min={1}
                />
              </div>
              {errors.duration && (
                <p className="text-red-500">{errors.duration.message}</p>
              )}
            </div>

            <div className="space-y-6">
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
              {/* Image Upload */}
              <div className="">
                <div className="flex items-center gap-x-2">
                  <IconBadge icon={Image} />
                  <h2 className="text-xl text-sky-900 font-semibold">
                    Thumbnail
                  </h2>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-center ">
                    <Avatar className="h-52 w-52 border text-center ">
                      <AvatarImage
                        src={
                          imageFile ? imageTemp : membershipPackage?.imageUrl
                        }
                      />
                      <AvatarFallback className="flex w-full h-full items-center justify-center bg-sky-800 text-8xl font-light text-emerald-400">
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
    </div>
  );
};

export default MembershipPackageUpdateContainer;
