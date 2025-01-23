import { useEffect, useState } from "react";
import { columns } from "./components/Columns";
import { DataTable } from "./components/DataTable";
import axios from "axios";
import { BASE_URL } from "@/services/config";

export interface User {
  id: string;
  email: string | null;
  fullName: string | null;
  image: string | null;
  dateOfBirth: string | null;
  address: string | null;
  gender: string | null;
  bloodGroup: string | null;
  status: string;
  dueDate: string | null;
}

const UsersContainer = () => {
  const [users, setUsers] = useState<User[]>([]);

  const fetchUsers = async () => {
    const response = await axios.get(`${BASE_URL}/users/get-user-pagination`);
    setUsers(response.data.resultObj.items || []);
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
