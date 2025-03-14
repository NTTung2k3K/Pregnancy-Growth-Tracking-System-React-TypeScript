import { IconBadge } from "@/components/IconBadge";
import { CircleArrowLeft, Image, ShieldCheck, UserPen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import axios from "axios";
import { BASE_URL } from "@/services/config";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AiOutlineLoading } from "react-icons/ai";
import toast from "react-hot-toast";
import { ROUTES } from "@/routes";
import { formatDate } from "@/lib/text";
import { User } from "../components/IUser";
import { API_ROUTES } from "@/routes/api";

interface UserFormValues {
  status: number;
}

const UserUpdateContainer = () => {
  const { register, handleSubmit, setValue } = useForm<UserFormValues>();
  const { id } = useParams();
  const [employee, setEmployee] = useState<User>();
  const [status, setStatus] = useState([]);
  const navigate = useNavigate();

  const fetchStatus = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL + API_ROUTES.DASHBOARD_USER_GET_STATUS}`
      );
      setStatus(response.data.resultObj);
    } catch (error) {
      console.error("Failed to fetch employee:", error);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchEmployee = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL + API_ROUTES.DASHBOARD_USER_DETAIL}`,
        {
          params: { Id: id },
        }
      );
      const fetchedEmployee = {
        ...response.data.resultObj,
        role: response.data.resultObj.role?.name || null,
      };

      setValue("status", fetchedEmployee.status == "Active" ? 1 : 0);

      setEmployee(fetchedEmployee);
    } catch (error) {
      console.error("Failed to fetch employee:", error);
    }
  };

  useEffect(() => {
    fetchEmployee();
  }, []);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onSubmit = async (data: UserFormValues) => {
    try {
      setIsLoading(true);

      const response = await axios.put(
        `${BASE_URL + API_ROUTES.DASHBOARD_USER_UPDATE_STATUS}`,
        {
          id: id,
          status: Number(data.status),
        }
      );
      if (response.data.statusCode === 200) {
        if (!id) {
          console.error("ID is undefined or null");
          return;
        }
        navigate(
          ROUTES.DASHBOARD_USER_DETAIL.replace(
            ":id",
            id.toString()
          )
        );
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Failed to update employee:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="mt-10">
        <Link className="p-6" to={ROUTES.DASHBOARD_USERS}>
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
              <h1 className="text-2xl font-medium">Update Employee</h1>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={UserPen} />
                <h2 className="text-xl text-sky-900 font-semibold">
                  Employee Profile
                </h2>
              </div>
              <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
                <div className="font-medium flex items-center mr-10">ID</div>
                <p className="flex-1 p-2">{employee?.id}</p>
              </div>
              <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
                <div className="font-medium flex items-center mr-10">
                  Full Name
                </div>
                <p className="flex-1 p-2">{employee?.fullName}</p>
              </div>
              <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
                <div className="font-medium flex items-center mr-10">
                  Date Of Birth
                </div>
                <p className="flex-1 p-2">
                  {formatDate(employee?.dateOfBirth!)}
                </p>
              </div>
              <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
                <div className="font-medium flex items-center mr-10">
                  Address
                </div>
                <p className="flex-1 p-2">{employee?.address}</p>
              </div>
              <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
                <div className="font-medium flex items-center mr-10">
                  Gender
                </div>
                <p className="flex-1 p-2">{employee?.gender}</p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-x-2">
                  <IconBadge icon={ShieldCheck} />
                  <h2 className="text-xl text-sky-900 font-semibold">Status</h2>
                </div>
                <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
                  <div className="font-medium flex items-center mr-10">
                    Status
                  </div>
                  <select className="flex-1 p-2" {...register("status")}>
                    {status.map((item: any) => (
                      <option value={item.id}>{item.status}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <div className="flex items-center gap-x-2">
                  <IconBadge icon={Image} />
                  <h2 className="text-xl text-sky-900 font-semibold">Image</h2>
                </div>
                <div className="flex items-center justify-center mt-4 border bg-slate-100 rounded-md p-4">
                  <img
                    className=""
                    width={200}
                    src={employee?.image || ""}
                    alt="Img"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-end mt-10 mr-10">
            <Button
              disabled={isLoading}
              className="bg-sky-900 text-emerald-400 px-10 py-6 text-xl"
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

export default UserUpdateContainer;
