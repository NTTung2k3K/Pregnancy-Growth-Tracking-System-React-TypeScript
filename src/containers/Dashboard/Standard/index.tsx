import { useEffect, useState } from "react";
import { Standard } from "./components/IStandard";
import axios from "axios";
import { BASE_URL } from "@/services/config";
import { API_ROUTES } from "@/routes/api";
import { DataTable } from "./components/DataTable";
import { columns } from "./components/Columns";

const GrowthStandardContainer = () => {
  const [standards, setStandards] = useState<Standard[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchStandards = async () => {
    setLoading(true);
    try {
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
    } catch (error) {
      console.error("Failed to fetch growth standards:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStandards();
  }, []);

  return (
    <div className="p-6">
      {loading ? (
        <div className="text-center text-gray-500">Loading growth standards...</div>
      ) : (
        <DataTable columns={columns} data={standards} />
      )}
    </div>
  );
};

export default GrowthStandardContainer;
