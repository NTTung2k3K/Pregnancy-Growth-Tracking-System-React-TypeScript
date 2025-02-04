import { useEffect, useState } from "react";
import { columns } from "./components/Columns";
import { DataTable } from "./components/DataTable";
import axios from "axios";
import { BASE_URL } from "@/services/config";

export interface Blog {
    id: number;
    title: string;
    content: string;
    week: number;
    authorId: string;
    likesCount: number;
    viewCount: number;
    status: string;
    sources: string | null;
    thumbnail: string | null;
    blogTypeId: number;
    isFeatured: boolean;
  }

  
const BlogsContainer = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);

  const fetchBlogs = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/blog/all`);

      const formattedResult = Array.isArray(response.data.resultObj.items)
        ? response.data.resultObj.items.map((item: any) => ({
            id: item.id,
            title: item.title,
            thumbnail: item.thumbnail,
            blogTypeId: item.blogTypeId,
            status: item.status,
            week: item.week,
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
