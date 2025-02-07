import { IconBadge } from "@/components/IconBadge";
import { CircleArrowLeft, Image, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { BASE_URL } from "@/services/config";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ROUTES } from "@/routes";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export interface BlogType {
  id: string;
  name: string;
  description: string;
  thumbnail: string | null;
}

const BlogTypeDetailContainer = () => {
  const { id } = useParams();
  const [blogType, setBlogType] = useState<BlogType>();

  const fetchBlogType = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/blogtype/${id}`);
      // Giả sử API trả về đối tượng blogType trong response.data.resultObj
      setBlogType(response.data.resultObj);
    } catch (error) {
      console.error("Failed to fetch blogtype:", error);
    }
  };

  useEffect(() => {
    fetchBlogType();
  }, []);

  return (
    <div className="p-6">
      <Link to={ROUTES.DASHBOARD_BLOGTYPES}>
        <Button className="bg-sky-900 text-emerald-400 hover:bg-sky-700">
          <CircleArrowLeft />
          Back
        </Button>
      </Link>
      <div className="flex items-center justify-between mt-8">
        <div className="flex flex-col gap-y-2">
          <h1 className="text-2xl font-medium">BlogType Detail</h1>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        {/* Cột thông tin cơ bản của BlogType */}
        <div>
          <div className="flex items-center gap-x-2">
            <IconBadge icon={Info} />
            <h2 className="text-xl text-sky-900 font-semibold">
              BlogType Information
            </h2>
          </div>
          <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
            <div className="font-medium w-32">ID</div>
            <p className="flex-1 p-2">{blogType?.id}</p>
          </div>
          <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
            <div className="font-medium w-32">Name</div>
            <p className="flex-1 p-2">{blogType?.name}</p>
          </div>
          <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
            <div className="font-medium w-32">Description</div>
            <p className="flex-1 p-2">{blogType?.description}</p>
          </div>
        </div>

        {/* Cột hiển thị thumbnail sử dụng Avatar */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={Image} />
              <h2 className="text-xl text-sky-900 font-semibold">Thumbnail</h2>
            </div>
            <div className="flex items-center justify-center mt-4">
              <Avatar className="h-52 w-52 border text-center">
                <AvatarImage src={blogType?.thumbnail || undefined} />
                <AvatarFallback className="flex w-full h-full items-center justify-center bg-sky-800 text-8xl font-light text-emerald-400">
                  ?
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogTypeDetailContainer;