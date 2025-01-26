import { useEffect, useState } from "react";
import { BASE_URL } from "@/services/config";
import axios from "axios";
import { DataTable } from "./components/DataTable";
import { columns } from "./components/Columns";
import { API_ROUTES } from "@/routes/api";
import { User } from "./components/IUser";



const UsersContainer = () => {
  const [users, setUsers] = useState<User[]>([]);

  const fetchUsers = async () => {
    const response = await axios.get(
      `${BASE_URL + API_ROUTES.DASHBOARD_USERS_ALL}`
    );
    const formattedResult = response.data.resultObj.map((item: any) => ({
      ...item,
      role: item.role?.name || null,
    }));
    setUsers(formattedResult || []);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="p-6">
      <DataTable columns={columns} data={users} />
    </div>
  );
};

export default UsersContainer;
