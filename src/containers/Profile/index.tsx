import { IconBadge } from "@/components/IconBadge";
import { CircleArrowLeft, Image, UserPen } from "lucide-react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { BASE_URL } from "@/services/config";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API_ROUTES } from "@/routes/api";
import { useForm } from "react-hook-form";
import { CookiesService } from "@/services/cookies.service";
import { User } from "../Dashboard/Users/components/IUser";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AvatarOverlay } from "@/components/AvatarOverlay";
import { AiOutlineLoading } from "react-icons/ai";
import { ROUTES } from "@/routes";
import toast from "react-hot-toast";
import { formatDateSliceTime } from "@/lib/text";

interface UserFormValue {
  phoneNumber: string;
  dateOfBirth: string;
  address: string;
  gender: number;
  email: string;
  bloodGroup: string;
  fullName: string;
}

const UserProfileContainer = () => {
  const id = CookiesService.get();
  const [user, setUser] = useState<User>();
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<UserFormValue>();
  const [imageTemp, setImageTemp] = useState<string | undefined>(undefined);
  const [imageFile, setImageFile] = useState<File | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isEditingImg, setIsEditingImg] = useState<boolean>(false);

  const fetchUser = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL + API_ROUTES.DASHBOARD_USER_DETAIL}`,
        {
          params: { Id: id },
        }
      );
      const fetchedUser = {
        ...response.data.resultObj,
        role: response.data.resultObj.role?.name || null,
      };
      setUser(fetchedUser);

      // Set form values
      for (const key in fetchedUser) {
        if (fetchedUser.hasOwnProperty(key)) {
          setValue(key as keyof UserFormValue, fetchedUser[key]);
        }
      }
      setValue("gender", fetchedUser.gender === "Male" ? 1 : 0);
      setValue("dateOfBirth", formatDateSliceTime(fetchedUser.dateOfBirth));
    } catch (error) {
      console.error("Failed to update user:", error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const onSubmit = async (data: UserFormValue) => {
    try {
      handleLoading();
      const response = await axios.put(
        `${BASE_URL + API_ROUTES.USER_UPDATE_PROFILE}`,
        {
          Id: id,
          Image: imageFile,
          FullName: data.fullName,
          DateOfBirth: data.dateOfBirth,
          Address: data.address,
          Gender: Number(data.gender),
          BloodGroup: data.bloodGroup,
          PhoneNumber: data.phoneNumber,
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.data.statusCode === 200) {
        window.location.href = `${ROUTES.PROFILE}`;
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Failed to create employee:", error);
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

  const handleLoading = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 10000);
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
      <div className="px-32 my-10">
        <Link to={"/"}>
          <Button className="bg-sky-900 text-emerald-400 hover:bg-sky-700">
            <CircleArrowLeft />
            Back
          </Button>
        </Link>
        <div className="flex items-center justify-between mt-8">
          <div className="flex flex-col gap-y-2">
            <h1 className="text-2xl font-medium">User Detail</h1>
          </div>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={UserPen} />
                <h2 className="text-xl text-sky-900 font-semibold">
                  User Profile
                </h2>
              </div>
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
                <span className="text-red-500 text-sm">
                  {errors.fullName.message}
                </span>
              )}
              <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
                <div className="font-medium flex items-center mr-10">
                  Phone Number
                </div>
                <input
                  className="flex-1 p-2"
                  {...register("phoneNumber", {
                    required: "Phone number is required",
                  })}
                />
              </div>
              {errors.phoneNumber && (
                <span className="text-red-500 text-sm">
                  {errors.phoneNumber.message}
                </span>
              )}
              <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
                <div className="font-medium flex items-center mr-10">
                  Date Of Birth
                </div>
                <input
                  type="date"
                  className="flex-1 p-2"
                  {...register("dateOfBirth", {
                    required: "Date of Birth is required",
                  })}
                />
              </div>
              {errors.dateOfBirth && (
                <span className="text-red-500 text-sm">
                  {errors.dateOfBirth.message}
                </span>
              )}

              <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
                <div className="font-medium flex items-center mr-10">
                  Address
                </div>
                <input
                  className="flex-1 p-2"
                  {...register("address", { required: "Address is required" })}
                />
              </div>
              {errors.address && (
                <span className="text-red-500 text-sm">
                  {errors.address.message}
                </span>
              )}

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
              <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
                <div className="font-medium flex items-center mr-10">Email</div>
                <input
                  type="email"
                  className="flex-1 p-2"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Invalid email address",
                    },
                  })}
                />
              </div>
              {errors.email && (
                <span className="text-red-500 text-sm">
                  {errors.email.message}
                </span>
              )}
              <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
                <div className="font-medium flex items-center mr-10">
                  Blood Group
                </div>
                <select
                  className="flex-1 p-2"
                  {...register("bloodGroup", {
                    required: "Gender is required",
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
              {errors.bloodGroup && (
                <span className="text-red-500 text-sm">
                  {errors.bloodGroup.message}
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
                {user?.image && !isEditingImg ? (
                  <div className="flex items-center justify-center mt-4 border bg-slate-100 rounded-md p-4">
                    <img
                      className=""
                      width={200}
                      src={user?.image || ""}
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
    </>
  );
};

export default UserProfileContainer;
