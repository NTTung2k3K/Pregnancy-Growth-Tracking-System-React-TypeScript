import { IconBadge } from "@/components/IconBadge";
import { ClipboardPlus, Image, UserPen } from "lucide-react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { BASE_URL } from "@/services/config";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

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
  const [, setEmployee] = useState();

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
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-y-2">
            <h1 className="text-2xl font-medium">Update Employee</h1>
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
            <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
              <div className="font-medium flex items-center mr-10">ID</div>
              <input disabled={true} className="flex-1 p-2" />
            </div>
            <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
              <div className="font-medium flex items-center mr-10">
                Full Name
              </div>
              <input className="flex-1 p-2" />
            </div>
            <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
              <div className="font-medium flex items-center mr-10">
                Date Of Birth
              </div>
              <input type="date" className="flex-1 p-2" />
            </div>
            <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
              <div className="font-medium flex items-center mr-10">Address</div>
              <input className="flex-1 p-2" />
            </div>
            <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
              <div className="font-medium flex items-center mr-10">Gender</div>
              <select className="flex-1 p-2">
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
                <h2 className="text-xl text-sky-900 font-semibold">Role</h2>
              </div>
              <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
                <div className="font-medium flex items-center mr-10">Role</div>
                <input className="flex-1 p-2" />
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
                <input type="file" className="flex-1 p-2" />
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
    </>
  );
};

export default EmployeeDetailContainer;
