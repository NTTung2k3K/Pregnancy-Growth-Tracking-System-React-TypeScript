import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "@/services/config";
import { columns } from "@/containers/Dashboard/MembershipPackage/components/Columns";
import { DataTable } from "@/containers/Dashboard/MembershipPackage/components/DataTable";

export interface MembershipPackage {
  id: number;
  packageName: string;
  description: string;
  price: number;
  duration: number;
  status: string;
  packageLevel: string;
  originalPrice: number;
  imageUrl: string;
  discount: number;
  showPriority: number;
  maxRecordAdded: number;
  maxGrowthChartShares: number;
  maxAppointmentCanBooking: number;
  hasGenerateAppointments: boolean;
  hasStandardDeviationAlerts: boolean;
  hasViewGrowthChart: boolean;
}

const MembershipPackageContainer = () => {
  const [MembershipPackage, setMembershipPackage] = useState<
    MembershipPackage[]
  >([]);

  const fetchMembershipPackage = async () => {
    const response = await axios.get(`${BASE_URL}/membershippackages/get-all`);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const formattedResult = response.data.resultObj.map((item: any) => ({
      ...item,
    }));
    setMembershipPackage(formattedResult || []);
  };

  useEffect(() => {
    fetchMembershipPackage();
  }, []);

  return (
    <div className="p-6">
      <DataTable columns={columns} data={MembershipPackage} />
    </div>
  );
};

export default MembershipPackageContainer;
