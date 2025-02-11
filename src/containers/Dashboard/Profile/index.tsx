import { IconBadge } from "@/components/IconBadge";
import { ClipboardPlus, Image, UserPen } from "lucide-react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { BASE_URL } from "@/services/config";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  CookiesEmployeeService,
  CookiesTokenService,
} from "@/services/cookies.service";
import { formatDateSliceTime } from "@/lib/text";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AvatarOverlay } from "@/components/AvatarOverlay";
import { API_ROUTES } from "@/routes/api";
import { ROUTES } from "@/routes";
import toast from "react-hot-toast";
import { AiOutlineLoading } from "react-icons/ai";

export interface Employee {
  image: string | null;
  dateOfBirth: string | null;
  address: string | null;
  gender: number;
  role: string | null;
  phoneNumber: string | null;
  fullName: string | null;
}

const EmployeeProfileContainer = () => {
  const id = CookiesEmployeeService.get();
  const [employee, setEmployee] = useState<Employee>();
  const [imageTemp, setImageTemp] = useState<string | undefined>(undefined);
  const [imageFile, setImageFile] = useState<File | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isEditingImg, setIsEditingImg] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<Employee>({
    mode: "onChange",
  });

  const fetchEmployee = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/employees/get-employee-by-id`,
        {
          params: { Id: id },
        }
      );
      const fetchedEmployee = {
        ...response.data.resultObj,
        role: response.data.resultObj.role?.name || "",
      };

      Object.keys(fetchedEmployee).forEach((key) => {
        setValue(key as keyof Employee, fetchedEmployee[key]);
      });
      setValue("gender", fetchedEmployee.gender === "Male" ? 1 : 0);
      setValue("dateOfBirth", formatDateSliceTime(fetchedEmployee.dateOfBirth));
      setEmployee(fetchedEmployee);
    } catch (error) {
      console.error("Failed to fetch employee:", error);
    }
  };

  useEffect(() => {
    fetchEmployee();
  }, []);

  const onSubmit = async (data: Employee) => {
    try {
      setIsLoading(true);
      const response = await axios.put(
        `${BASE_URL + API_ROUTES.DASHBOARD_EMPLOYEE_UPDATE_PROFILE}`,
        {
          Id: id,
          PhoneNumber: data.phoneNumber,
          FullName: data.fullName,
          Image: imageFile,
          DateOfBirth: data.dateOfBirth,
          Address: data.address,
          Gender: Number(data.gender),
        },
        {
          headers: {
            Authorization: `Bearer ${CookiesTokenService.get()}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.data.statusCode === 200) {
        window.location.href = `${ROUTES.DASHBOARD_EMPLOYEE_PROFILE}`;
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Failed to create employee:", error);
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

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-y-2">
          <h1 className="text-2xl font-medium">Update Employee</h1>
        </div>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={UserPen} />
              <h2 className="text-xl text-sky-900 font-semibold">
                Employee Profile
              </h2>
            </div>
            <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
              <div className="font-medium flex items-center mr-10">
                FullName
              </div>
              <input
                className="flex-1 p-2"
                {...register("fullName", { required: true })}
              />
            </div>
            {errors.fullName && (
              <span className="text-red-500">Full name is required</span>
            )}
            <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
              <div className="font-medium flex items-center mr-10">
                Phone Number
              </div>
              <input
                className="flex-1 p-2"
                {...register("phoneNumber", { required: true })}
              />
            </div>
            {errors.phoneNumber && (
              <span className="text-red-500">Phone is required</span>
            )}
            <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
              <div className="font-medium flex items-center mr-10">
                Date Of Birth
              </div>
              <input
                type="date"
                className="flex-1 p-2"
                {...register("dateOfBirth", { required: true })}
              />
            </div>
            {errors.dateOfBirth && (
              <span className="text-red-500">Date of birth is required</span>
            )}
            <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
              <div className="font-medium flex items-center mr-10">Address</div>
              <input
                className="flex-1 p-2"
                {...register("address", { required: true })}
              />
            </div>
            {errors.address && (
              <span className="text-red-500">Address is required</span>
            )}
            <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
              <div className="font-medium flex items-center mr-10">Gender</div>
              <select
                className="flex-1 p-2"
                {...register("gender", { required: true })}
              >
                <option value="">Select Gender</option>
                <option value="1">Male</option>
                <option value="0">Female</option>
              </select>
            </div>
            {errors.gender && (
              <span className="text-red-500">Gender is required</span>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={ClipboardPlus} />
                <h2 className="text-xl text-sky-900 font-semibold">Role</h2>
              </div>
              <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
                <div className="font-medium flex items-center mr-10">Role</div>
                <input
                  disabled
                  className="flex-1 p-2"
                  {...register("role", { required: true })}
                />
              </div>
            </div>
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
              {employee?.image && !isEditingImg ? (
                <div className="flex items-center justify-center mt-4 border bg-slate-100 rounded-md p-4">
                  <img
                    className=""
                    width={200}
                    src={employee?.image || ""}
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
    </div>
  );
};

export default EmployeeProfileContainer;
