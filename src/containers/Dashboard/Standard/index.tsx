import { useEffect, useState } from "react";
import { Standard } from "./components/IStandard";
import axios from "axios";
import { BASE_URL } from "@/services/config";
import { API_ROUTES } from "@/routes/api";
import { DataTable } from "./components/DataTable";
import { columns } from "./components/Columns";

const GrowthStandardContainer = () => {
  const [standards, setStandards] = useState<Standard[]>([]);

  const fetchStandards = async () => {
    const response = await axios.get(
      `${BASE_URL + API_ROUTES.DASHBOARD_GROWTH_STANDARD_ALL}`,
      {
        params: {
          pageNumber: 1,
          pageSize: 100,
        },
      }
    );
    setStandards(response.data.resultObj.items || []);
  };

  useEffect(() => {
    fetchStandards();
  }, []);
  return (
    <div className="p-6">
      <DataTable columns={columns} data={standards} />
    </div>
  );
};

export default GrowthStandardContainer;
