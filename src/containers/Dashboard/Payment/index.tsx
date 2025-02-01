import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "@/services/config";
import { columns } from "@/containers/Dashboard/Payment/components/Columns";
import { DataTable } from "@/containers/Dashboard/Payment/components/DataTable";

export interface Payment {
  id: number;
  paymentDate: string;
  amount: number;
  paymentMethod: string;
  status: string;
  userMembership: UserMembership;
}

export interface UserMembership {
  id: number;
  startDate: string;
  endDate: string;
  status: string;
  user: User;
  package: Package;
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  image: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dateOfBirth: any;
  address: string;
  gender: string;
  bloodGroup: string;
  status: string;
}

export interface Package {
  id: number;
  packageName: string;
  description: string;
  price: number;
  duration: number;
  status: string;
  packageLevel: string;
  originalPrice: number;
  imageUrl: string;
  discount: number;
  showPriority: number;
}

const PaymentContainer = () => {
  const [payments, setPayments] = useState<Payment[]>([]);

  const fetchPayment = async () => {
    const response = await axios.get(`${BASE_URL}/payments/get-all`);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const formattedResult = response.data.resultObj.map((item: any) => ({
      ...item,
    }));
    setPayments(formattedResult || []);
  };

  useEffect(() => {
    fetchPayment();
  }, []);

  return (
    <div className="p-6">
      <DataTable columns={columns} data={payments} />
    </div>
  );
};

export default PaymentContainer;
