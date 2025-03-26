import { useEffect, useState } from "react";
import { BASE_URL } from "@/services/config";
import axios from "axios";
import { DataTable } from "./components/DataTable";
import { columns } from "./components/Columns";
import { API_ROUTES } from "@/routes/api";
import { User } from "./components/IUser";

const UsersContainer = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${BASE_URL + API_ROUTES.DASHBOARD_USERS_ALL}`
      );
      const formattedResult = response.data.resultObj.map((item: any) => ({
        ...item,
        role: item.role?.name || null,
      }));
      setUsers(formattedResult || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="p-6">
      {loading ? (
        <div className="text-center text-gray-500">Loading users...</div>
      ) : (
        <DataTable columns={columns} data={users} />
      )}
    </div>
  );
};

export default UsersContainer;
