import { useEffect, useState } from "react";
import { columns } from "./components/Columns";
import { DataTable } from "./components/DataTable";
import axios from "axios";
import { BASE_URL } from "@/services/config";
import { API_ROUTES } from "@/routes/api";

export interface Employee {
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

const EmployeesContainer = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);

  const fetchEmployees = async () => {
    const response = await axios.get(
      `${BASE_URL + API_ROUTES.DASHBOARD_EMPLOYEES_ALL}`
    );
    const formattedResult = response.data.resultObj.map((item: any) => ({
      ...item,
      role: item.role?.name || null,
    }));
    setEmployees(formattedResult || []);
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  return (
    <div className="p-6">
      <DataTable columns={columns} data={employees} />
    </div>
  );
};

export default EmployeesContainer;
