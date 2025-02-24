import { IconBadge } from "@/components/IconBadge";
import { CircleArrowLeft, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { BASE_URL } from "@/services/config";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ROUTES } from "@/routes";
import { MembershipPackage } from "@/containers/Dashboard/MembershipPackage";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const MembershipPackageDetailContainer = () => {
  const { id } = useParams();
  const [membershipPackage, setMembershipPackage] =
    useState<MembershipPackage>();

  const fetchMembershipPackage = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/membershippackages/get-by-id`,
        {
          params: { id: id },
        }
      );
      const fetchedMembershipPackage = {
        ...response.data.resultObj,
      };
      setMembershipPackage(fetchedMembershipPackage);
    } catch (error) {
      console.error("Failed to fetch MembershipPackage:", error);
    }
  };

  useEffect(() => {
    fetchMembershipPackage();
  }, []);

  console.log(membershipPackage);

  return (
    <>
      <div className="p-6">
        <Link to={ROUTES.DASHBOARD_MEMBERSHIPPACKAGE}>
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
            {/* Package Name */}
            <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
              <div className="font-medium flex items-center mr-10 w-1/6">
                Package Name
              </div>
              <p className="flex-1 p-2">{membershipPackage?.packageName}</p>
            </div>

            {/* Description */}
            <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
              <div className="font-medium flex items-center mr-10 w-1/6">
                Description
              </div>
              <p className="flex-1 p-2">{membershipPackage?.description}</p>
            </div>

            {/* Original Price */}
            <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
              <div className="font-medium flex items-center mr-10 w-1/6">
                Original Price
              </div>
              <p className="flex-1 p-2">{membershipPackage?.originalPrice}</p>
            </div>

            {/* Discount */}
            <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
              <div className="font-medium flex items-center mr-10 w-1/6">
                Discount (%)
              </div>
              <p className="flex-1 p-2">{membershipPackage?.discount}</p>
            </div>

            {/* Duration */}
            <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
              <div className="font-medium flex items-center mr-10 w-1/6">
                Duration
              </div>
              <p className="flex-1 p-2">{membershipPackage?.duration} days</p>
            </div>
            <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
              <div className="font-medium flex items-center mr-10 w-1/6">
                Max Record Added
              </div>
              <p className="flex-1 p-2">{membershipPackage?.maxRecordAdded}</p>
            </div>
            <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
              <div className="font-medium flex items-center mr-10 w-1/6">
                Max Growth Chart Shares
              </div>
              <p className="flex-1 p-2">
                {membershipPackage?.maxGrowthChartShares}
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Show Priority */}
            <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
              <div className="font-medium flex items-center mr-10 w-1/6">
                Show Priority
              </div>
              <p className="flex-1 p-2">{membershipPackage?.showPriority}</p>
            </div>

            {/* Package Level */}
            <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
              <div className="font-medium flex items-center mr-10 w-1/6">
                Package Level
              </div>
              <p className="flex-1 p-2">{membershipPackage?.packageLevel}</p>
            </div>

            {/* Status */}
            <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
              <div className="font-medium flex items-center mr-10 w-1/6">
                Status
              </div>
              <p className="flex-1 p-2">{membershipPackage?.status}</p>
            </div>
            <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
              <div className="font-medium flex items-center mr-10 w-1/6">
                Has Generate Appointments
              </div>
              <p className="flex-1 p-2">
                {membershipPackage?.hasGenerateAppointments ? "true" : "false"}
              </p>
            </div>
            <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
              <div className="font-medium flex items-center mr-10 w-1/6">
                Has Standard Deviation Alerts
              </div>
              <p className="flex-1 p-2">
                {membershipPackage?.hasStandardDeviationAlerts
                  ? "true"
                  : "false"}
              </p>
            </div>
            <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
              <div className="font-medium flex items-center mr-10 w-1/6">
                Has View Growth Chart
              </div>
              <p className="flex-1 p-2">
                {membershipPackage?.hasViewGrowthChart ? "true" : "false"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MembershipPackageDetailContainer;
