import { useEffect, useState } from "react";
import { GrowthCharts } from "./components/IGrowthCharts";
import { BASE_URL } from "@/services/config";
import { API_ROUTES } from "@/routes/api";
import axios from "axios";
import { DataTable } from "./components/DataTable";
import { columns } from "./components/Columns";

const GrowthChartsContainer = () => {
  const [charts, setCharts] = useState<GrowthCharts[]>([]);

  const fetchCharts = async () => {
    const response = await axios.get(
      `${BASE_URL + API_ROUTES.DASHBOARD_GROWTH_CHARTS_ALL}`
    );
    setCharts(response.data.resultObj || []);
  };

  useEffect(() => {
    fetchCharts();
  }, []);

  return (
    <div className="p-6">
      <DataTable columns={columns} data={charts} />
    </div>
  );
};

export default GrowthChartsContainer;
