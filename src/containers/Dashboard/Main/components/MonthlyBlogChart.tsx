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
} from "recharts";

interface MonthlyData {
  month: number;
  quantity: number;
}

const MonthlyBlogChart = () => {
  const [data, setData] = useState<MonthlyData[]>();
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const fetchMonthlyBlog = async () => {
    const response = await axios.get(`${BASE_URL + API_ROUTES.MONTHLY_BLOG}`);
    setData(response.data.resultObj);
  };

  useEffect(() => {
    fetchMonthlyBlog();
  }, []);

  return (
    <>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" tickFormatter={(tick) => monthNames[tick - 1]} />
          <YAxis />
          <Tooltip />
          <Bar dataKey="quantity" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </>
  );
};

export default MonthlyBlogChart;
