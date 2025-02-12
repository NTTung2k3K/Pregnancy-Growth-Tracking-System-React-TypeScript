

import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "@/services/config";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

// Import các component BlogCard và BlogFilters (đường dẫn tùy chỉnh theo dự án của bạn)
import { BlogCard } from "@/containers/Blog/components/blog-card";
import { BlogFilters } from "@/containers/Blog/components/filter";
import { getBlogsPaginated } from "@/containers/Blog/components/api-handler";

// --- Thành phần hiển thị phần hero (tiêu đề Blog) ---
const BlogHero = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4 py-8 md:py-12 bg-gray-50">
      <div className="relative h-[400px] rounded-2xl overflow-hidden">
        <img
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-q5bawyrrqwVf7uO4iIOpBX4lbsOkLe.png"
          alt="Blog hero"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex flex-col justify-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900">Blog</h1>
        <p className="text-lg text-gray-600">
          Welcome to our blog — where knowledge meets inspiration! Explore our diverse
          collection of articles covering everything from technology to lifestyle. Find in-depth guides,
          expert insights, and engaging stories across various topics.
        </p>
      </div>
    </div>
  );
};

// --- Định nghĩa kiểu cho BlogType ---
export interface BlogType {
  id: number;
  name: string;
  description: string;
  thumbnail: string | null;
}

// =====================
// Thành phần chính BlogContainer
// =====================

const PAGE_SIZE = 10;

const BlogContainer = () => {
  // --- Phần load blog type để làm filter ---
  const [blogTypes, setBlogTypes] = useState<BlogType[]>([]);
  const [isLoadingTypes, setIsLoadingTypes] = useState(true);

  useEffect(() => {
    const fetchBlogTypes = async () => {
      try {
        // Gọi API lấy tất cả Blog Types
        const response = await axios.get(`${BASE_URL}/blogtype/all`);
        // Giả sử API trả về kết quả ở resultObj.items
        const items = response.data.resultObj.items;
        setBlogTypes(items);
      } catch (error) {
        console.error("Error fetching blog types:", error);
      } finally {
        setIsLoadingTypes(false);
      }
    };

    fetchBlogTypes();
  }, []);

  // --- Phần hiển thị danh sách Blog ---
  const [blogs, setBlogs] = useState<any[]>([]);
  // Ban đầu filter có blogTypeId undefined, thay vì trạng thái active/InActive
  const [filters, setFilters] = useState({
    pageIndex: 1,
    pageSize: PAGE_SIZE,
    isDescending: true,
    blogTypeId: undefined,
  });
  const [loadingBlogs, setLoadingBlogs] = useState(false);
  const [hasMoreBlogs, setHasMoreBlogs] = useState(false);

  // Load danh sách Blog theo bộ lọc (filters)
  useEffect(() => {
    const loadBlogs = async () => {
        setLoadingBlogs(true);
        try {
            const result = await getBlogsPaginated(filters);
            if (result.isSuccessed) {
                if (filters.pageIndex === 1) {
                    setBlogs(result.resultObj.items);
                } else {
                    setBlogs((prev) => [...prev, ...result.resultObj.items]);
                }
                setHasMoreBlogs(result.resultObj.hasNextPage);
            }
        } catch (error) {
            console.error("Error fetching blogs:", error);
        } finally {
            setLoadingBlogs(false);
        }
    };
    loadBlogs();
}, [filters]);


  // Hàm xử lý thay đổi filter khi người dùng chọn blog type
  const handleFilterChange = (newFilters: any) => {
    const updatedFilters = {
      ...filters,
      ...newFilters,
      blogTypeId: newFilters.blogTypeId === "all" ? undefined : newFilters.blogTypeId,
      pageIndex: 1,
      pageSize: PAGE_SIZE,
    };

    // Loại bỏ các giá trị undefined để query được gọn gàng
    Object.keys(updatedFilters).forEach(
      (key) => updatedFilters[key] === undefined && delete updatedFilters[key]
    );

    setFilters(updatedFilters);
  };

  // Hàm tải thêm dữ liệu (pagination)
  const loadMoreBlogs = () => {
    setFilters((prev) => ({
      ...prev,
      pageIndex: prev.pageIndex + 1,
    }));
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Phần Hero */}
      <BlogHero />

      {/* Phần filter: sử dụng danh sách blog type để lọc thay cho trạng thái */}
      <div className="container mx-auto py-6 space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Blogs</h1>
          <p className="text-muted-foreground">
            Browse and search through shared blog posts
          </p>
        </div>

        {isLoadingTypes ? (
          <div className="flex justify-center items-center min-h-[150px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          // Giả sử BlogFilters đã được update để nhận prop blogTypes
          <BlogFilters blogTypes={blogTypes} onFilterChange={handleFilterChange} />
        )}

        {/* Danh sách blog */}
        <div className="grid gap-4">
          {blogs.map((blog) => (
            <BlogCard key={blog.id} blog={blog} />
          ))}
        </div>

        {loadingBlogs && (
          <div className="flex justify-center">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        )}

        {!loadingBlogs && hasMoreBlogs && (
          <div className="flex justify-center">
            <Button onClick={loadMoreBlogs} variant="outline">
              Load More
            </Button>
          </div>
        )}

        {!loadingBlogs && blogs.length === 0 && (
          <div className="text-center text-muted-foreground py-10">
            No blogs found
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogContainer;