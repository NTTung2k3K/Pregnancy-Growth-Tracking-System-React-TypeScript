import { API_ROUTES } from "@/routes/api";
import { BASE_URL } from "@/services/config";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface MonthlyData {
  month: number;
  transactionCount: number;
  totalAmount: number;
}

const MonthlyPaymentChart = () => {
  const [data, setData] = useState<MonthlyData[]>([]);
  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  const fetchMonthlyPayments = async () => {
    try {
      const response = await axios.get(`${BASE_URL + API_ROUTES.MONTHLY_PAYMENTS}`);
      setData(response.data.resultObj);
    } catch (error) {
      console.error("Error fetching monthly payments:", error);
    }
  };

  useEffect(() => {
    fetchMonthlyPayments();
  }, []);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" tickFormatter={(tick) => monthNames[tick - 1]} />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="transactionCount" fill="#8884d8" name="Transactions" />
        <Bar dataKey="totalAmount" fill="#82ca9d" name="Total Amount ($)" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default MonthlyPaymentChart;
