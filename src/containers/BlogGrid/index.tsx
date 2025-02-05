import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { truncate } from "@/lib/text";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "@/services/config";

export interface BlogType {
  id: number;
  name: string;
  description: string;
  thumbnail: string | null;
}

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

interface BlogHeroProps {
  blogType: BlogType;
}

const BlogHero = ({ blogType }: BlogHeroProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4 py-8 md:py-12 bg-gray-50">
      <div className="relative h-[400px] rounded-2xl overflow-hidden">
        <img
          src={blogType.thumbnail || "/placeholder.svg?height=400&width=400"}
          alt={blogType.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex flex-col justify-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900">{blogType.name}</h1>
        <p className="text-lg text-gray-600">{blogType.description}</p>
      </div>
    </div>
  );
};

const BlogGridContainer = () => {
  const { type } = useParams();
  const blogTypeId = Number(type);

  // State cho danh sách blog
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isLoadingBlogs, setIsLoadingBlogs] = useState(true);

  // State cho thông tin blog type
  const [blogTypeDetails, setBlogTypeDetails] = useState<BlogType | null>(null);
  const [isLoadingType, setIsLoadingType] = useState(true);

  // State cho số lượng blog hiển thị
  const [visibleCount, setVisibleCount] = useState(4);
  const [showAll, setShowAll] = useState(false);

  // Gọi API lấy toàn bộ blog
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/blog/all`);
        console.log("Response blogs:", response.data);
        const items = response.data.resultObj.items;
        if (Array.isArray(items)) {
          setBlogs(items);
        } else {
          console.error("Expected an array for blogs, but got:", items);
          setBlogs([]);
        }
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setIsLoadingBlogs(false);
      }
    };

    fetchBlogs();
  }, []);

  // Gọi API lấy chi tiết blog type theo blogTypeId
  useEffect(() => {
    const fetchBlogType = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/blogtype/${blogTypeId}`);
        console.log("Response blog type:", response.data);
        // Giả sử dữ liệu chi tiết blog type nằm trong response.data.resultObj
        const blogTypeData = response.data.resultObj;
        if (blogTypeData) {
          setBlogTypeDetails(blogTypeData);
        } else {
          console.error("Blog type data not found:", response.data);
        }
      } catch (error) {
        console.error("Error fetching blog type details:", error);
      } finally {
        setIsLoadingType(false);
      }
    };

    // Nếu blogTypeId hợp lệ, gọi API
    if (!isNaN(blogTypeId)) {
      fetchBlogType();
    } else {
      setIsLoadingType(false);
    }
  }, [blogTypeId]);

  // Lọc blog theo blogTypeId
  const filteredBlogs = blogs.filter((blog) => blog.blogTypeId === blogTypeId);

  const toggleShowMore = () => {
    if (showAll) {
      setVisibleCount(4);
    } else {
      setVisibleCount(filteredBlogs.length);
    }
    setShowAll(!showAll);
  };

  // Nếu đang tải dữ liệu (blog hoặc blog type), hiển thị loading
  if (isLoadingBlogs || isLoadingType) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Nếu có blogTypeDetails, hiển thị BlogHero */}
      {blogTypeDetails && <BlogHero blogType={blogTypeDetails} />}

      <div className="flex flex-col items-center justify-center my-10 px-32">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-10">
          {filteredBlogs.slice(0, visibleCount).map((blog) => (
            <Link to={`/blog-detail/${blog.id}`} className="p-1" key={blog.id}>
              <Card>
                <CardContent className="w-full h-80 flex aspect-square p-0 border-r-4 border-b-4 border-r-emerald-300 border-b-emerald-300 rounded-xl">
                  <div className="flex flex-col">
                    <img
                      className="rounded-t-lg h-44 object-cover"
                      src={blog.thumbnail || "/placeholder.svg?height=160&width=160"}
                      alt={blog.title}
                    />
                    <div className="p-4 leading-6">
                      <p className="text-lg text-sky-900 font-semibold">
                        {truncate(blog.title, 47)}
                      </p>
                      <p className="mt-1">Week: {blog.week}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
        {filteredBlogs.length > 4 && (
          <Button
            className="w-36 bg-white text-emerald-400 border-2 border-emerald-400 rounded-full p-6 my-10 text-xl hover:bg-white hover:border-emerald-400 hover:text-emerald-400"
            onClick={toggleShowMore}
          >
            {showAll ? "Show Less" : "Show More"}
          </Button>
        )}
      </div>
    </div>
  );
};

export default BlogGridContainer;
