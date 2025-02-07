import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "@/services/config";
import { API_ROUTES } from "@/routes/api";
import { DataTable } from "./components/DataTable";
import { AppointmentTemplates } from "./components/IAppointmentTemplates";
import { columns } from "./components/Columns";

const AppointmentTemplatesDashboardContainer = () => {
  const [templates, setTemplates] = useState<AppointmentTemplates[]>([]);

  const fetchTemplates = async () => {
    const response = await axios.get(
      `${BASE_URL + API_ROUTES.DASHBOARD_APPOINTMENT_TEMPLATES_ALL}`
    );
    setTemplates(response.data.resultObj || []);
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  return (
    <div className="p-6">
      <DataTable columns={columns} data={templates} />
    </div>
  );
};

export default AppointmentTemplatesDashboardContainer;
