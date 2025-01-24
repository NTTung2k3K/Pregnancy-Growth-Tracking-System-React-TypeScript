import { IconBadge } from "@/components/IconBadge";
import { CircleArrowLeft, Image, ShieldCheck, UserPen } from "lucide-react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { BASE_URL } from "@/services/config";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ROUTES } from "@/routes";
import { formatDate } from "@/lib/text";

export interface Employee {
  id: string;
  fullName: string | null;
  image: string | null;
  dateOfBirth: string | null;
  address: string | null;
  gender: string | null;
  status: string;
  role: string | null;
  email: string | null;
}

const EmployeeDetailContainer = () => {
  const { id } = useParams();
  const [employee, setEmployee] = useState<Employee>();

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
        role: response.data.resultObj.role?.name || null,
      };
      setEmployee(fetchedEmployee);
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
        <Link to={ROUTES.DASHBOARD_EMPLOYEES}>
          <Button className="bg-sky-900 text-emerald-400 hover:bg-sky-700">
            <CircleArrowLeft />
            Back
          </Button>
        </Link>
        <div className="flex items-center justify-between mt-8">
          <div className="flex flex-col gap-y-2">
            <h1 className="text-2xl font-medium">Employee Detail</h1>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
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
              <p className="flex-1 p-2">{formatDate(employee?.dateOfBirth!)}</p>
            </div>
            <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
              <div className="font-medium flex items-center mr-10">Address</div>
              <p className="flex-1 p-2">{employee?.address}</p>
            </div>
            <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
              <div className="font-medium flex items-center mr-10">Gender</div>
              <p className="flex-1 p-2">{employee?.gender}</p>
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
                <p className="flex-1 p-2">{employee?.role}</p>
              </div>
              <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
                <div className="font-medium flex items-center mr-10">
                  Status
                </div>
                <p className="flex-1 p-2">{employee?.status}</p>
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
      </div>
    </>
  );
};

export default EmployeeDetailContainer;
