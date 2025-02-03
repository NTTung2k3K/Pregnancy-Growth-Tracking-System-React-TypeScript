import { IconBadge } from "@/components/IconBadge";
import { CircleArrowLeft, Image, FileText, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { BASE_URL } from "@/services/config";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ROUTES } from "@/routes";
import { Editor } from "@tinymce/tinymce-react";

export interface Blog {
  id: string;
  title: string;
  content: string;
  week: number | null;
  authorId: string;
  blogTypeId: number;
  isFeatured: boolean;
  thumbnail: string | null;
  likesCount: number;
  viewCount: number;
  status: string;
  sources: string;
}

const BlogsDetailContainer = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState<Blog>();

  const fetchBlog = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/blog/${id}`);

      // Giả sử API trả về đối tượng blog trong response.data.resultObj
      setBlog(response.data.resultObj);
    } catch (error) {
      console.error("Failed to fetch blog:", error);
    }
  };

  useEffect(() => {
    fetchBlog();
  }, []);

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
          <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
            <div className="font-medium w-32">ID</div>
            <p className="flex-1 p-2">{blog?.id}</p>
          </div>
          <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
            <div className="font-medium w-32">Title</div>
            <p className="flex-1 p-2">{blog?.title}</p>
          </div>
          <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
            <div className="font-medium w-32">Week</div>
            <p className="flex-1 p-2">{blog?.week}</p>
          </div>
          <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
            <div className="font-medium w-32">Author ID</div>
            <p className="flex-1 p-2">{blog?.authorId}</p>
          </div>
          <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
            <div className="font-medium w-32">Blog Type ID</div>
            <p className="flex-1 p-2">{blog?.blogTypeId}</p>
          </div>
          <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
            <div className="font-medium w-32">Featured</div>
            <p className="flex-1 p-2">{blog?.isFeatured ? "Yes" : "No"}</p>
          </div>
          <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
            <div className="font-medium w-32">Like Count</div>
            <p className="flex-1 p-2">{blog?.likesCount}</p>
          </div>
          <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
            <div className="font-medium w-32">View Count</div>
            <p className="flex-1 p-2">{blog?.viewCount}</p>
          </div>
          <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
            <div className="font-medium w-32">Status</div>
            <p className="flex-1 p-2">{blog?.status}</p>
          </div>
          <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
            <div className="font-medium w-32">Sources</div>
            <p className="flex-1 p-2">{blog?.sources}</p>
          </div>
        </div>

        {/* Cột hiển thị content và thumbnail */}
        <div className="space-y-6">

          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={Image} />
              <h2 className="text-xl text-sky-900 font-semibold">Thumbnail</h2>
            </div>
            <div className="flex items-center justify-center mt-4 border bg-slate-100 rounded-md p-4">
              {blog?.thumbnail ? (
                <img width={200} src={blog.thumbnail} alt="Thumbnail" />
              ) : (
                <p>No Thumbnail</p>
              )}
            </div>
          </div>
        </div>
      </div>
      <div>
        <div className="flex items-center gap-x-2 mt-10">
          <IconBadge icon={FileText} />
          <h2 className="text-xl text-sky-900 font-semibold">Content</h2>
        </div>
        <div className="mt-4 border bg-slate-100 rounded-md p-4">
          {blog?.content && (
            <Editor
              disabled
              apiKey='rcdz0k6v268ooj7bboucuugdnfclrmjyhwihtuxuf7vz8ugk'
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