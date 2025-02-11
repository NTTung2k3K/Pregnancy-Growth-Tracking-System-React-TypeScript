import { useEffect, useState } from "react";
import { columns } from "./components/Columns";
import { DataTable } from "./components/DataTable";
import axios from "axios";
import { BASE_URL } from "@/services/config";

export interface Blog {
  id: number;
  title: string;
  thumbnail: string;
  status: string;
  week: number;
  blogTypeModelView: {
    id: number;
    name: string;
    description: string;
    thumbnail: string;
  };
  authorResponseModel: {
    id: string;
    fullName: string | null;
    image: string | null;
    dateOfBirth: string | null;
    address: string | null;
    gender: string | null;
    phoneNumber: string | null;
    createdBy: string | null;
    email: string;
    lastUpdatedBy: string | null;
    status: string;
    role: {
      id: string;
      name: string;
    };
  };
}

  
const BlogsContainer = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);

  const fetchBlogs = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/blog/all-admin`);

      const formattedResult = Array.isArray(response.data.resultObj.items)
      ? response.data.resultObj.items.map((item: any) => ({
          id: item.id,
          title: item.title,
          thumbnail: item.thumbnail,
          status: item.status,
          week: item.week,
          blogTypeModelView: item.blogTypeModelView,
          authorResponseModel: item.authorResponseModel,
        }))
      : [];    
      setBlogs(formattedResult || []);
    } catch (error) {
      console.error("Failed to fetch blogs:", error);
    }
  };
  

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <div className="p-6">
      <DataTable columns={columns} data={blogs} />
    </div>
  );
};

export default BlogsContainer;
