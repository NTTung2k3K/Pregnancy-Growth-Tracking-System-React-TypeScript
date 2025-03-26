import { useEffect, useState } from "react";
import { columns } from "./components/Columns";
import { DataTable } from "./components/DataTable";
import axios from "axios";
import { BASE_URL } from "@/services/config";

export interface BlogType {
  id: number;
  name: string;
  description: string;
  thumbnail: string | null;
}

const BlogTypesContainer = () => {
  const [blogTypes, setBlogTypes] = useState<BlogType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchBlogTypes = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/blogtype/all`);
      const formattedResult = Array.isArray(response.data.resultObj.items)
        ? response.data.resultObj.items.map((item: any) => ({
            id: item.id,
            name: item.name,
            thumbnail: item.thumbnail,
          }))
        : [];
      setBlogTypes(formattedResult || []);
    } catch (error) {
      console.error("Failed to fetch blog types:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogTypes();
  }, []);

  return (
    <div className="p-6">
      {loading ? (
        <div className="text-center text-gray-500">Loading blog types...</div>
      ) : (
        <DataTable columns={columns} data={blogTypes} />
      )}
    </div>
  );
};

export default BlogTypesContainer;
