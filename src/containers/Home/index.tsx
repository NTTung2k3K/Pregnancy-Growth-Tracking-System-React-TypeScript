import { useEffect, useState } from "react";
import axios from "axios";
import AdvisoryBoard from "./components/AdvisoryBoard";
import Banner from "./components/Banner";
import Panel from "./components/Panel";
import PlatformOverview from "./components/PlatformOverview";
import PregnancyTimeline from "./components/PregnancyTimeline";
import Tools from "./components/Tools";
import { BASE_URL } from "@/services/config";

// Interface BlogType
export interface BlogType {
  id: number;
  name: string;
  description: string;
  thumbnail: string | null;
}

const HomeContainer = () => {
  const [blogTypes, setBlogTypes] = useState<BlogType[]>([]);

  useEffect(() => {
    const fetchBlogTypes = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/blogtype/all`);
        const result = response.data.resultObj.items;

        // Nếu result là mảng, sử dụng trực tiếp; nếu không thì chuyển nó thành mảng
        const blogTypesData: BlogType[] = Array.isArray(result)
          ? result
          : result
          ? [result]
          : [];

        setBlogTypes(blogTypesData);
      } catch (error) {
        console.error("Error fetching blog types:", error);
      }
    };

    fetchBlogTypes();
  }, []);

  return (
    <div className="flex flex-col mt-10 mb-40 px-32">
      <PlatformOverview />
      <div className="flex flex-col bg-[#F3F2F2] p-4">
        <Banner />
        <p className="text-center text-3xl font-bold text-sky-900">
          My pregnancy week by week
        </p>
        <PregnancyTimeline />
        <div className="flex flex-col items-center justify-center bg-white p-10 mb-10">
          <p className="text-center text-3xl font-bold text-sky-900">
            Popular tools
          </p>
          <Tools />
        </div>

        {/* Render Panel dựa trên dữ liệu blogTypes lấy từ API */}
        {blogTypes.map((blogtype) => (
          <Panel
            key={blogtype.id}
            title={blogtype.name}
            iconUrl={blogtype.thumbnail || ""}
            // Truyền blogtype.id (đã chuyển sang chuỗi) vào prop category
            category={blogtype.id}
            seeAllLink={`/blog/${blogtype.id}`}
            isOpened={false}
          />
        ))}

        <AdvisoryBoard />
      </div>
    </div>
  );
};

export default HomeContainer;