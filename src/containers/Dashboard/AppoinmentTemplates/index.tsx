import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "@/services/config";
import { API_ROUTES } from "@/routes/api";
import { DataTable } from "./components/DataTable";
import { AppointmentTemplates } from "./components/IAppointmentTemplates";
import { columns } from "./components/Columns";

const AppointmentTemplatesDashboardContainer = () => {
  const [templates, setTemplates] = useState<AppointmentTemplates[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchTemplates = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${BASE_URL + API_ROUTES.DASHBOARD_APPOINTMENT_TEMPLATES_ALL}`
      );
      setTemplates(response.data.resultObj || []);
    } catch (error) {
      console.error("Error fetching appointment templates:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  return (
    <div className="p-6">
      {loading ? (
        <div className="text-center text-gray-500">Loading appointment templates...</div>
      ) : (
        <DataTable columns={columns} data={templates} />
      )}
    </div>
  );
};

export default AppointmentTemplatesDashboardContainer;