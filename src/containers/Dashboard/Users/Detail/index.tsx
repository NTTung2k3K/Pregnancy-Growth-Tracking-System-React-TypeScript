import { IconBadge } from "@/components/IconBadge";
import {
  Baby,
  CircleArrowLeft,
  Image,
  ShieldCheck,
  UserPen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { BASE_URL } from "@/services/config";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ROUTES } from "@/routes";
import { formatDate } from "@/lib/text";
import { User } from "../components/IUser";
import { API_ROUTES } from "@/routes/api";
import { Child } from "../../Children/components/IChild";

const UserDetailContainer = () => {
  const { id } = useParams();
  const [user, setUser] = useState<User>();

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
      setUser(fetchedEmployee);
    } catch (error) {
      console.error("Failed to fetch employee:", error);
    }
  };

  useEffect(() => {
    fetchEmployee();
  }, []);

  return (
    <>
      <div className="p-6">
        <Link to={ROUTES.DASHBOARD_USERS}>
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={UserPen} />
              <h2 className="text-xl text-sky-900 font-semibold">
                User Profile
              </h2>
            </div>
            <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
              <div className="font-medium flex items-center mr-10">ID</div>
              <p className="flex-1 p-2">{user?.id}</p>
            </div>
            <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
              <div className="font-medium flex items-center mr-10">
                Full Name
              </div>
              <p className="flex-1 p-2">{user?.fullName}</p>
            </div>
            <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
              <div className="font-medium flex items-center mr-10">
                Date Of Birth
              </div>
              <p className="flex-1 p-2">{formatDate(user?.dateOfBirth!)}</p>
            </div>
            <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
              <div className="font-medium flex items-center mr-10">Address</div>
              <p className="flex-1 p-2">{user?.address}</p>
            </div>
            <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
              <div className="font-medium flex items-center mr-10">Gender</div>
              <p className="flex-1 p-2">{user?.gender}</p>
            </div>
            <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
              <div className="font-medium flex items-center mr-10">Email</div>
              <p className="flex-1 p-2">{user?.email}</p>
            </div>
            <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
              <div className="font-medium flex items-center mr-10">
                Blood Group
              </div>
              <p className="flex-1 p-2">{user?.bloodGroup}</p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={ShieldCheck} />
                <h2 className="text-xl text-sky-900 font-semibold">Role</h2>
              </div>
              <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
                <div className="font-medium flex items-center mr-10">Role</div>
                {/* <p className="flex-1 p-2">{employee?.role}</p> */}
              </div>
              <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
                <div className="font-medium flex items-center mr-10">
                  Status
                </div>
                <p className="flex-1 p-2">{user?.status}</p>
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
                  src={user?.image || ""}
                  alt="Img"
                />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={Baby} />
                <h2 className="text-xl text-sky-900 font-semibold">Children</h2>
              </div>
              <div className="flex items-center justify-center mt-4 border bg-slate-100 rounded-md p-4">
                {user?.childs.map((child: Child) => (
                  <div className="">huan</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserDetailContainer;
