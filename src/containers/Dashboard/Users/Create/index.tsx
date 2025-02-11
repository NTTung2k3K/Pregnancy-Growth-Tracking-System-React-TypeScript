import { IconBadge } from "@/components/IconBadge";
import { Image, UserPen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import axios from "axios";
import { BASE_URL } from "@/services/config";
import { API_ROUTES } from "@/routes/api";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AvatarOverlay } from "./components/AvatarOverlay";
import { AiOutlineLoading } from "react-icons/ai";
import toast from "react-hot-toast";

interface EmployeeFormValues {
  username: string;
  password: string;
  fullName: string;
  dob: string;
  address: string;
  phone: string;
  email: string;
  gender: string;
}

export interface Employee {
  username: string;
  password: string | null;
  fullname: string | null;
  dob: string | null;
  address: string | null;
  phone: string | null;
  email: string;
  gender: number;
}

interface Role {
  id: string;
  name: string;
}

const EmployeeCreateContainer = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EmployeeFormValues>({
    mode: "onChange",
  });

  const [imageTemp, setImageTemp] = useState<string | undefined>(undefined);
  const [imageFile, setImageFile] = useState<File | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [roles, setRoles] = useState<Role[]>([]);

  const fetchRoles = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/role/all`);
      setRoles(response.data.resultObj.items);
    } catch (error) {
      console.error("Failed to fetch roles:", error);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const onSubmit = async (data: EmployeeFormValues) => {
    try {
      setIsLoading(true);

      const response = await axios.post(
        `${BASE_URL + API_ROUTES.DASHBOARD_EMPLOYEE_CREATE}`,
        {
          UserName: data.username,
          Password: data.password,
          FullName: data.fullName,
          Image: imageFile,
          DateOfBirth: data.dob,
          Address: data.address,
          PhoneNumber: data.phone,
          Email: data.email,
          RoleId: roles[1].id,
          Gender: Number(data.gender),
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.data.statusCode === 200) {
        window.location.href = `/dashboard/employees`;
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

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-y-2">
              <h1 className="text-2xl font-medium">Create Employee</h1>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={UserPen} />
                <h2 className="text-xl text-sky-900 font-semibold">
                  Employee Profile
                </h2>
              </div>

              {/* Username Field */}
              <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
                <div className="font-medium flex items-center mr-10">
                  Username
                </div>
                <input
                  className="flex-1 p-2"
                  {...register("username", {
                    required: "Username is required",
                    minLength: {
                      value: 4,
                      message: "Username must be at least 4 characters",
                    },
                  })}
                />
              </div>
              {errors.username && (
                <p className="text-red-500">{errors.username.message}</p>
              )}

              {/* Password Field */}
              <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
                <div className="font-medium flex items-center mr-10">
                  Password
                </div>
                <input
                  type="password"
                  className="flex-1 p-2"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters long",
                    },
                    pattern: {
                      value: /^(?=.*[A-Z])(?=.*\d)(?=.*\W).+$/,
                      message:
                        "Password must include at least one uppercase letter, one digit, and one non-alphanumeric character.",
                    },
                  })}
                />
              </div>
              {errors.password && (
                <p className="text-red-500">{errors.password.message}</p>
              )}

              {/* Full Name Field */}
              <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
                <div className="font-medium flex items-center mr-10">
                  Full Name
                </div>
                <input
                  className="flex-1 p-2"
                  {...register("fullName", {
                    required: "Full Name is required",
                  })}
                />
              </div>
              {errors.fullName && (
                <p className="text-red-500">{errors.fullName.message}</p>
              )}

              {/* Date of Birth Field */}
              <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
                <div className="font-medium flex items-center mr-10">
                  Date of Birth
                </div>
                <input
                  type="date"
                  className="flex-1 p-2"
                  {...register("dob", {
                    required: "Date of Birth is required",
                    validate: (value) =>
                      new Date(value) <= new Date() ||
                      "Date of Birth cannot be in the future",
                  })}
                />
              </div>
              {errors.dob && (
                <p className="text-red-500">{errors.dob.message}</p>
              )}

              {/* Address Field */}
              <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
                <div className="font-medium flex items-center mr-10">
                  Address
                </div>
                <input
                  className="flex-1 p-2"
                  {...register("address", {
                    required: "Address is required",
                  })}
                />
              </div>
              {errors.address && (
                <p className="text-red-500">{errors.address.message}</p>
              )}
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
                  <div className="font-medium flex items-center mr-10">
                    Gender
                  </div>
                  <select
                    className="flex-1 p-2"
                    {...register("gender", {
                      required: "Gender is required",
                    })}
                  >
                    <option value="">Select Gender</option>
                    <option value="1">Male</option>
                    <option value="0">Female</option>
                  </select>
                </div>
              </div>
              {errors.gender && (
                <p className="text-red-500">{errors.gender.message}</p>
              )}
              {/* Phone Field */}
              <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
                <div className="font-medium flex items-center mr-10">Phone</div>
                <input
                  className="flex-1 p-2"
                  {...register("phone", {
                    required: "Phone is required",
                    pattern: {
                      value: /^[0-9]{10,12}$/,
                      message: "Enter a valid phone number",
                    },
                  })}
                />
              </div>
              {errors.phone && (
                <p className="text-red-500">{errors.phone.message}</p>
              )}

              {/* Email Field */}
              <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
                <div className="font-medium flex items-center mr-10">Email</div>
                <input
                  type="email"
                  className="flex-1 p-2"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Enter a valid email address",
                    },
                  })}
                />
              </div>
              {errors.email && (
                <p className="text-red-500">{errors.email.message}</p>
              )}

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

export default EmployeeCreateContainer;
