import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "@/services/config";
import { API_ROUTES } from "@/routes/api";
import { Child } from "./components/IChild";
import { DataTable } from "./components/DataTable";
import { columns } from "./components/Colums";

const ChildrenDashboardContainer = () => {
  const [children, setChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchChildren = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${BASE_URL + API_ROUTES.DASHBOARD_CHILDREN_ALL}`
      );
      setChildren(response.data.resultObj.items || []);
    } catch (error) {
      console.error("Failed to fetch children data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChildren();
  }, []);

  return (
    <div className="p-6">
      {loading ? (
        <p className="text-center text-gray-500">Loading children data...</p>
      ) : (
        <DataTable columns={columns} data={children} />
      )}
    </div>
  );
};

export default ChildrenDashboardContainer;
