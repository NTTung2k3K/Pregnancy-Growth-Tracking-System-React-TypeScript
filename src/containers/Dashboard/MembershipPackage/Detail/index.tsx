import { IconBadge } from "@/components/IconBadge";
import { CircleArrowLeft, Image, ShieldCheck, UserPen } from "lucide-react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { BASE_URL } from "@/services/config";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ROUTES } from "@/routes";

export interface MembershipPackage {
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

const MembershipPackageDetailContainer = () => {
  const { id } = useParams();
  const [MembershipPackage, setMembershipPackage] =
    useState<MembershipPackage>();

  const fetchMembershipPackage = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/MembershipPackages/get-MembershipPackage-by-id`,
        {
          params: { Id: id },
        }
      );
      const fetchedMembershipPackage = {
        ...response.data.resultObj,
        role: response.data.resultObj.role?.name || null,
      };
      setMembershipPackage(fetchedMembershipPackage);
    } catch (error) {
      console.error("Failed to fetch MembershipPackage:", error);
    }
  };

  useEffect(() => {
    fetchMembershipPackage();
  }, []);

  return (
    <>
      <div className="p-6">
        <Link to={ROUTES.DASHBOARD_MembershipPackageS}>
          <Button className="bg-sky-900 text-emerald-400 hover:bg-sky-700">
            <CircleArrowLeft />
            Back
          </Button>
        </Link>
        <div className="flex items-center justify-between mt-8">
          <div className="flex flex-col gap-y-2">
            <h1 className="text-2xl font-medium">MembershipPackage Detail</h1>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={UserPen} />
              <h2 className="text-xl text-sky-900 font-semibold">
                MembershipPackage Profile
              </h2>
            </div>
            <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
              <div className="font-medium flex items-center mr-10">ID</div>
              <p className="flex-1 p-2">{MembershipPackage?.id}</p>
            </div>
            <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
              <div className="font-medium flex items-center mr-10">
                Full Name
              </div>
              <p className="flex-1 p-2">{MembershipPackage?.fullName}</p>
            </div>
            <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
              <div className="font-medium flex items-center mr-10">
                Date Of Birth
              </div>
              <p className="flex-1 p-2">{MembershipPackage?.dateOfBirth}</p>
            </div>
            <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
              <div className="font-medium flex items-center mr-10">Address</div>
              <p className="flex-1 p-2">{MembershipPackage?.address}</p>
            </div>
            <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
              <div className="font-medium flex items-center mr-10">Gender</div>
              <p className="flex-1 p-2">{MembershipPackage?.gender}</p>
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
                <p className="flex-1 p-2">{MembershipPackage?.role}</p>
              </div>
              <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
                <div className="font-medium flex items-center mr-10">
                  Status
                </div>
                <p className="flex-1 p-2">{MembershipPackage?.status}</p>
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
                  src={MembershipPackage?.image || ""}
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

export default MembershipPackageDetailContainer;
