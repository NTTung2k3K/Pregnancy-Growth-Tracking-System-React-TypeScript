import { IconBadge } from "@/components/IconBadge";
import { CircleArrowLeft, Image, FileText, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { BASE_URL } from "@/services/config";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ROUTES } from "@/routes";
import { Editor } from "@tinymce/tinymce-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export interface Blog {
  id: string;
  title: string;
  content: string;
  week: number | null;
  // authorId ban đầu, nhưng giờ ta sẽ lấy thông tin từ authorResponseModel
  authorResponseModel?: {
    id: string;
    image?: string | null;
    role: {
      id: string;
      name: string;
    };
  };
  // blogTypeId ban đầu, giờ ta lấy thông tin từ blogTypeModelView
  blogTypeModelView?: {
    id: number;
    name: string;
    description?: string;
    thumbnail?: string;
  };
  isFeatured: boolean;
  thumbnail: string | null;
  likesCount: number;
  viewCount: number;
  status: string;
  sources: string;
  // Nếu API trả ra thêm các trường khác, có thể khai báo thêm ở đây
}

interface StatusOption {
  id: string;
  status: string;
}

const BlogsDetailContainer = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState<Blog>();
  const [statusOptions, setStatusOptions] = useState<StatusOption[]>([]);

  const fetchBlog = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/blog/${id}`);

      setBlog(response.data.resultObj);
    } catch (error) {
      console.error("Failed to fetch blog:", error);
    }
  };

  const fetchStatusOptions = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/blog/get-status-handler`);
      setStatusOptions(response.data.resultObj || []);
    } catch (error) {
      console.error("Error fetching status options:", error);
      setStatusOptions([]);
    }
  };

  useEffect(() => {
    fetchBlog();
    fetchStatusOptions();
  }, []);

  // Lấy tên status từ statusOptions dựa trên blog.status
  const getStatusName = () => {
    if (!blog) return "";
    const found = statusOptions.find((s) => s.id === blog.status);
    return found ? found.status : blog.status;
  };

  return (
    <div className="p-6">
      <Link to={ROUTES.DASHBOARD_BLOGS}>
        <Button className="bg-sky-900 text-emerald-400 hover:bg-sky-700">
          <CircleArrowLeft />
          Back
        </Button>
      </Link>
      <div className="flex items-center justify-between mt-8">
        <div className="flex flex-col gap-y-2">
          <h1 className="text-2xl font-medium">Blog Detail</h1>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        {/* Cột thông tin cơ bản của Blog */}
        <div>
          <div className="flex items-center gap-x-2">
            <IconBadge icon={Info} />
            <h2 className="text-xl text-sky-900 font-semibold">
              Blog Information
            </h2>
          </div>
          {/* ID */}
          <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
            <div className="font-medium w-32">ID</div>
            <p className="flex-1 p-2">{blog?.id}</p>
          </div>
          {/* Title */}
          <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
            <div className="font-medium w-32">Title</div>
            <p className="flex-1 p-2">{blog?.title}</p>
          </div>
          {/* Week */}
          <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
            <div className="font-medium w-32">Week</div>
            <p className="flex-1 p-2">{blog?.week}</p>
          </div>
          {/* Author - hiển thị tên */}
          <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
            <div className="font-medium w-32">Author</div>
            <p className="flex-1 p-2">
              {blog?.authorResponseModel?.role.name || "N/A"}
            </p>
          </div>
          {/* Blog Type - hiển thị tên */}
          <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
            <div className="font-medium w-32">Blog Type</div>
            <p className="flex-1 p-2">
              {blog?.blogTypeModelView?.name || "N/A"}
            </p>
          </div>
          {/* Like Count */}
          <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
            <div className="font-medium w-32">Like Count</div>
            <p className="flex-1 p-2">{blog?.likesCount}</p>
          </div>
          {/* View Count */}
          <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
            <div className="font-medium w-32">View Count</div>
            <p className="flex-1 p-2">{blog?.viewCount}</p>
          </div>
          {/* Status */}
          <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
            <div className="font-medium w-32">Status</div>
            <p className="flex-1 p-2">{getStatusName()}</p>
          </div>
          {/* Sources */}
          <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
            <div className="font-medium w-32">Sources</div>
            <p className="flex-1 p-2">{blog?.sources}</p>
          </div>
        </div>

        {/* Cột hiển thị content và thumbnail */}
        <div className="space-y-6">
          {/* Thumbnail */}
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={Image} />
              <h2 className="text-xl text-sky-900 font-semibold">Thumbnail</h2>
            </div>
            <div className="flex justify-center mt-4">
              <Avatar className="h-52 w-52 border text-center">
                <AvatarImage src={blog?.thumbnail || undefined} />
                <AvatarFallback className="flex w-full h-full items-center justify-center bg-sky-800 text-8xl font-light text-emerald-400">
                  ?
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div>
        <div className="flex items-center gap-x-2 mt-10">
          <IconBadge icon={FileText} />
          <h2 className="text-xl text-sky-900 font-semibold">Content</h2>
        </div>
        <div className="mt-4 border bg-slate-100 rounded-md p-4">
          {blog?.content && (
            <Editor
              disabled
              apiKey="fopyhr808wdoc86vvbb3f6wx6ntkawc2mhcpm38t08kk2bxy"
              initialValue={blog.content}
              init={{
                menubar: false,
                toolbar: false,
                height: 300,
                content_style:
                  "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogsDetailContainer;