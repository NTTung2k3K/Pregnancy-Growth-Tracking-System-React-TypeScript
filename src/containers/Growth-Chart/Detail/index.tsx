import GrowthChartDetailUI from "@/containers/Growth-Chart/Detail/_components/growth-chart-detail";
import { BASE_URL } from "@/services/config";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";

export default function GrowthChartDetail() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error] = useState(null);

  useEffect(() => {
    let hasUpdatedView = false; // Biến flag để kiểm soát việc gọi API update view

    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/growthchart/get-by-id?id=${id}`
        );
        if (!response.data.isSuccessed) {
          throw new Error("Failed to load growth chart");
        }
        setData(response.data.resultObj);

        // Gọi API update view chỉ khi chưa cập nhật
        if (!hasUpdatedView) {
          await axios.put(`${BASE_URL}/growthchart/update-view`, {
            id: Number(id),
          });
          hasUpdatedView = true; // Đánh dấu là đã cập nhật
        }
      } catch (err) {
        if (err instanceof Error) {
          toast.error(err.message);
        } else {
          toast.error("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!data) return <div>No data available</div>;

  return <GrowthChartDetailUI data={data} />;
}
