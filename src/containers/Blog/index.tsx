import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "@/services/config"; // Giữ nguyên nếu bạn đã có file config

// Định nghĩa kiểu cho BlogType
export interface BlogType {
  id: number;
  name: string;
  description: string;
  thumbnail: string | null;
}

// Thành phần hiển thị phần hero (tiêu đề blog)
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
          Welcome to our blog — where knowledge meets inspiration! Explore our diverse collection of articles covering
          everything from technology to lifestyle. Find in-depth guides, expert insights, and engaging stories across
          various topics.
        </p>
      </div>
    </div>
  );
};

// Thành phần hiển thị từng BlogType (Card)
const BlogTypeCard = ({ id, name, description, thumbnail }: BlogType) => {
  return (
    <a href={`/blog/${id}`} className="flex flex-col items-center group">
      <div className="relative w-32 h-32 md:w-40 md:h-40 mb-3 rounded-full overflow-hidden transition-transform duration-300 group-hover:scale-105">
        <img
          src={thumbnail || "/placeholder.svg?height=160&width=160"}
          alt={name}
          className="object-cover w-full h-full"
        />
      </div>
      <span className="text-sm md:text-base text-center font-medium text-gray-800">{name}</span>
      <p className="text-xs text-gray-600 text-center mt-1 max-w-[150px] line-clamp-2">{description}</p>
    </a>
  );
};

// Thành phần hiển thị danh sách BlogTypes
const BlogTypes = ({ blogTypes }: { blogTypes: BlogType[] }) => {
  return (
    <div className="py-12 px-4">
      <h2 className="text-3xl font-bold text-center mb-8">Blog Types</h2>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 max-w-6xl mx-auto">
        {blogTypes.map((blogType) => (
          <BlogTypeCard key={blogType.id} {...blogType} />
        ))}
      </div>
    </div>
  );
};

// Thành phần chính chứa toàn bộ nội dung của blog
const BlogContainer = () => {
  const [blogTypes, setBlogTypes] = useState<BlogType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBlogTypes = async () => {
      try {
        // Gọi API đã có sẵn của bạn (đường dẫn được xác định trong BASE_URL)
        const response = await axios.get(`${BASE_URL}/blogtype/all`);
        console.log("Response data:", response.data.resultObj);
        // Lấy mảng items chứa các blog types
        const items = response.data.resultObj.items;
        setBlogTypes(items);
      } catch (error) {
        console.error("Error fetching blog types:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogTypes();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <BlogHero />
      <BlogTypes blogTypes={blogTypes} />
    </div>
  );
}

export default BlogContainer;