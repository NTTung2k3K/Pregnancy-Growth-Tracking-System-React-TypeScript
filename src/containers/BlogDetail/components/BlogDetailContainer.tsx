import { FaRegCalendarAlt, FaRegEye, FaCalendarWeek } from "react-icons/fa";
import { IoThumbsUp } from "react-icons/io5";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "@/services/config";

export interface Blog {
  id: number;
  title: string;
  content: string;
  thumbnail: string;
  status: string;
  sources: string;
  createdTime: string;
  viewCount: number;
  likesCount: number;
  week: number;
  blogTypeModelView: {
    id: number;
    name: string;
  };
  authorResponseModel: {
    id: string;
    role: {
      id: string;
      name: string;
    };
  };
}

const BlogDetailContent = () => {
  const { id } = useParams<{ id: string }>();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [liked, setLiked] = useState(false);
  const [hasUpdatedViewCount, setHasUpdatedViewCount] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  };

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/blog/${id}`);
        setBlog(response.data.resultObj);
      } catch (err) {
        setError("Error fetching blog data");
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  // Cập nhật viewCount (chỉ 1 lần) ngay khi blog được load
  useEffect(() => {
    if (blog && !hasUpdatedViewCount) {
      const updateViewCount = async () => {
        try {
          await axios.post(`${BASE_URL}/blog/update-quantity`, {
            id: blog.id,
            isUpdateLiked: false,
          });
          // Tăng viewCount hiển thị thêm 1
          setBlog((prev) =>
            prev ? { ...prev, viewCount: prev.viewCount + 1 } : prev
          );
          setHasUpdatedViewCount(true);
        } catch (error) {
          console.error("Error updating view count", error);
        }
      };
      updateViewCount();
    }
  }, [blog, hasUpdatedViewCount]);

  const handleLike = async () => {
    if (!blog) return;

    const updatedLikesCount = liked ? blog.likesCount - 1 : blog.likesCount + 1;
    setBlog((prev) =>
      prev ? { ...prev, likesCount: updatedLikesCount } : prev
    );
    setLiked(!liked);

    try {
      await axios.post(`${BASE_URL}/blog/update-quantity`, {
        id: blog.id,
        isUpdateLiked: true, // Now updating likes in DB
      });
    } catch (error) {
      console.error("Error updating likes count", error);
    }
  };

  const likedRef = useRef(liked);
  useEffect(() => {
    likedRef.current = liked;
  }, [liked]);
  const blogRef = useRef(blog);
  useEffect(() => {
    blogRef.current = blog;
  }, [blog]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!blog) return <p>Blog not found</p>;

  return (
    <>
      <div className="w-full px-4 lg:w-8/12">
        <div>
          <h1 className="mb-8 text-3xl font-bold leading-tight text-sky-900 dark:text-white sm:text-4xl sm:leading-tight">
            {blog.title}
          </h1>
          <div className="mb-10 flex flex-wrap items-center justify-between border-b border-body-color border-opacity-10 pb-4 dark:border-white dark:border-opacity-10">
            <div className="flex flex-wrap items-center">
              <div className="mb-5 mr-10 flex items-center">
                <div className="w-full">
                  <span className="mb-1 text-base font-medium text-body-color">
                    By <span>{blog.authorResponseModel.role.name}</span>
                  </span>
                </div>
              </div>
              <div className="mb-5 flex items-center">
                <p className="mr-5 flex items-center text-base font-medium text-body-color">
                  <span className="mr-3">
                    <FaRegCalendarAlt />
                  </span>
                  {formatDate(blog.createdTime)}
                </p>
                <p className="mr-5 flex items-center text-base font-medium text-body-color">
                  <span className="mr-3">
                    <FaCalendarWeek />
                  </span>
                  Week: {blog.week}
                </p>
                <p
                  className="mr-5 flex items-center text-base font-medium text-body-color cursor-pointer"
                  onClick={handleLike}
                >
                  <span className="mr-3">
                    <IoThumbsUp
                      className={liked ? "text-blue-500" : "text-gray-500"}
                    />
                  </span>
                  {blog.likesCount}
                </p>
                <p className="flex items-center text-base font-medium text-body-color">
                  <span className="mr-3">
                    <FaRegEye />
                  </span>
                  {blog.viewCount}
                </p>
              </div>
            </div>
          </div>
          <div>
            <p
              className="mb-10 text-base font-medium leading-relaxed text-body-color sm:text-lg sm:leading-relaxed lg:text-base lg:leading-relaxed xl:text-lg xl:leading-relaxed"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />
            <div className="relative z-10 mb-10 overflow-hidden rounded-md bg-gradient-to-r from-emerald-400 to-emerald-600 text-sky-900 bg-opacity-10 p-8 md:p-9 lg:p-8 xl:p-9">
              <p className="text-center text-base font-medium italic text-body-color">
                {blog.sources}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BlogDetailContent;
