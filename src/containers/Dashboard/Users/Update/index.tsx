import { IconBadge } from "@/components/IconBadge";
import { Actions } from "./components/Actions";
import { ClipboardPlus, Image, UserPen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import axios from "axios";
import { BASE_URL } from "@/services/config";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { API_ROUTES } from "@/routes/api";

interface UserFormValues {
  id: string;
  dateOfBirth: string;
  address: string;
  gender: string;
  bloodGroup: string;
  dueDate: string;
  image: FileList | null;
}

export interface User {
  id: string;
  email: string | null;
  fullName: string | null;
  image: string | null;
  dateOfBirth: string | null;
  address: string | null;
  gender: string | null;
  bloodGroup: string | null;
  status: string;
  dueDate: string | null;
}

const UserUpdataContainer = () => {
  const { register, handleSubmit, setValue } = useForm<UserFormValues>();
  const { id } = useParams();
  const [user, setUser] = useState<User>();

  const fetchUser = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/users/get-user-by-id`, {
        params: { Id: id },
      });
      const fetchedUser = response.data.resultObj || {};

      // Set form values using setValue
      setValue("id", fetchedUser.id || "");
      setValue("dateOfBirth", fetchedUser.dateOfBirth || "");
      setValue("address", fetchedUser.address || "");
      setValue("gender", fetchedUser.gender || "");
      setValue("bloodGroup", fetchedUser.bloodGroup || "");
      setValue("dueDate", fetchedUser.dueDate || "");

      setUser(fetchedUser);
    } catch (error) {
      console.error("Failed to fetch user:", error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const onSubmit = async (data: UserFormValues) => {
    try {
      await axios.put(
        `${BASE_URL + "" + API_ROUTES.DASHBOARD_USER_UPDATE}`,
        {
          Id: data.id,
          Image: data.image,
          DateOfBirth: data.dateOfBirth,
          Address: data.address,
          Gender: data.gender,
          BloodGroup: data.bloodGroup,
          DueDate: data.dueDate,
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      fetchUser();
    } catch (error) {
      console.error("Failed to update user:", error);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-y-2">
              <h1 className="text-2xl font-medium">Update User</h1>
            </div>
            <Actions id={"1"} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={UserPen} />
                <h2 className="text-xl text-sky-900 font-semibold">
                  User Profile
                </h2>
              </div>
              <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
                <div className="font-medium flex items-center mr-10">ID</div>
                <input
                  disabled={true}
                  className="flex-1 p-2"
                  {...register("id")}
                />
              </div>
              <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
                <div className="font-medium flex items-center mr-10">
                  Date Of Birth
                </div>
                <input
                  type="date"
                  className="flex-1 p-2"
                  {...register("dateOfBirth")}
                />
              </div>
              <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
                <div className="font-medium flex items-center mr-10">
                  Address
                </div>
                <input className="flex-1 p-2" {...register("address")} />
              </div>
              <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
                <div className="font-medium flex items-center mr-10">
                  Gender
                </div>
                <select className="flex-1 p-2" {...register("gender")}>
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-x-2">
                  <IconBadge icon={ClipboardPlus} />
                  <h2 className="text-xl text-sky-900 font-semibold">
                    Medical
                  </h2>
                </div>
                <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
                  <div className="font-medium flex items-center mr-10">
                    Blood Group
                  </div>
                  <input className="flex-1 p-2" {...register("bloodGroup")} />
                </div>
                <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
                  <div className="font-medium flex items-center mr-10">
                    Due Date
                  </div>
                  <input
                    type="date"
                    className="flex-1 p-2"
                    {...register("dueDate")}
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-x-2">
                  <IconBadge icon={Image} />
                  <h2 className="text-xl text-sky-900 font-semibold">Image</h2>
                </div>
                <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
                  <div className="font-medium flex items-center mr-10">
                    Upload
                  </div>
                  <input
                    type="file"
                    className="flex-1 p-2"
                    {...register("image")}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-end mt-10 mr-40">
            <Button
              className="bg-sky-900 text-emerald-400 px-10 py-6 text-xl"
              type="submit"
            >
              Save
            </Button>
          </div>
        </div>
      </form>
    </>
  );
};

export default UserUpdataContainer;
