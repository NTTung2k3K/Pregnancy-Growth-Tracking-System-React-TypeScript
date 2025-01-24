import { IconBadge } from "@/components/IconBadge";
import { CircleArrowLeft, ShieldCheck, UserPen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import axios from "axios";
import { BASE_URL } from "@/services/config";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AiOutlineLoading } from "react-icons/ai";
import toast from "react-hot-toast";
import { ROUTES } from "@/routes";

interface MembershipPackageFormValues {
  id: string;
  status: number;
}

export interface MembershipPackage {
  id: string;
  status: number;
}

const MembershipPackageUpdateContainer = () => {
  const { register, handleSubmit, setValue } =
    useForm<MembershipPackageFormValues>();
  const { id } = useParams();
  const [, setMembershipPackage] = useState<MembershipPackage>();
  const [status, setStatus] = useState([]);

  const fetchStatus = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/MembershipPackages/get-MembershipPackage-status`
      );
      setStatus(response.data.resultObj);
    } catch (error) {
      console.error("Failed to fetch MembershipPackage:", error);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchMembershipPackage = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/MembershipPackages/get-MembershipPackage-by-id`,
        {
          params: { Id: id },
        }
      );
      const fetchedMembershipPackage = response.data.resultObj;

      // Set form values using setValue
      setValue("id", fetchedMembershipPackage.id || "");
      setValue("status", fetchedMembershipPackage.status == "Active" ? 1 : 0);

      setMembershipPackage(fetchedMembershipPackage);
    } catch (error) {
      console.error("Failed to fetch MembershipPackage:", error);
    }
  };

  useEffect(() => {
    fetchMembershipPackage();
  }, []);

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
        `${BASE_URL}/MembershipPackages/update-MembershipPackage-status`,
        {
          id: data.id,
          status: Number(data.status),
        }
      );
      if (response.data.statusCode === 200) {
        window.location.href = `/dashboard/MembershipPackages`;
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
        <Link className="p-6" to={ROUTES.DASHBOARD_MembershipPackageS}>
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
              <h1 className="text-2xl font-medium">Update MembershipPackage</h1>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={UserPen} />
                <h2 className="text-xl text-sky-900 font-semibold">
                  MembershipPackage ID
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

export default MembershipPackageUpdateContainer;
