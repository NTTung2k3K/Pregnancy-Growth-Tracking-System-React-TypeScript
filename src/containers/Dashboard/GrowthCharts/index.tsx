import { useEffect, useState } from "react";
import { GrowthChart } from "./components/IGrowthCharts";
import { BASE_URL } from "@/services/config";
import { API_ROUTES } from "@/routes/api";
import axios from "axios";
import { DataTable } from "./components/DataTable";
import { columns } from "./components/Columns";

const GrowthChartsContainer = () => {
  const [charts, setCharts] = useState<GrowthChart[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchCharts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${BASE_URL + API_ROUTES.DASHBOARD_GROWTH_CHARTS_ALL}`
      );
      setCharts(response.data.resultObj || []);
    } catch (error) {
      console.error("Failed to fetch growth charts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCharts();
  }, []);

  return (
    <div className="p-6">
      {loading ? (
        <div className="text-center text-gray-500">Loading growth charts...</div>
      ) : (
        <DataTable columns={columns} data={charts} />
      )}
    </div>
  );
};

export default GrowthChartsContainer;