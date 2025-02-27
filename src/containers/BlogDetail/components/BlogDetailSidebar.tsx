import { useEffect, useState } from "react";
import NewsLatterBox from "./NewsLatterBox";
import RelatedPost from "./RelatedPost";
import { Link } from "react-router-dom";
import { BlogMainDashboard } from "@/containers/Dashboard/Main/components/IBlog";
import axios from "axios";
import { BASE_URL } from "@/services/config";
import { API_ROUTES } from "@/routes/api";
import { ROUTES } from "@/routes";
import { BlogType } from "@/containers/Blog";

const BlogDetailSidebar = () => {
  const [mostView, setMostView] = useState<BlogMainDashboard[]>([]);
  const [blogTypes, setBlogTypes] = useState<BlogType[]>([]);

  const fetchBlogMostView = async () => {
    const response = await axios.get(
      `${BASE_URL + API_ROUTES.BLOG_MOST_VIEW}`,
      {
        params: {
          quantity: 5,
        },
      }
    );
    setMostView(response.data.resultObj);
  };
  const fetchBlogTypes = async () => {
    try {
      // Gọi API lấy tất cả Blog Types
      const response = await axios.get(`${BASE_URL}/blogtype/all`);
      // Giả sử API trả về kết quả ở resultObj.items
      const items = response.data.resultObj.items;
      setBlogTypes(items);
    } catch (error) {
      console.error("Error fetching blog types:", error);
    }
  };

  useEffect(() => {
    fetchBlogTypes();
    fetchBlogMostView();
  }, []);

  return (
    <>
      {" "}
      <div className="w-full px-4 lg:w-4/12">
        <div className="shadow-three dark:bg-gray-dark mb-10 rounded-sm bg-[#F3F2F2] dark:shadow-none">
          <h3 className="border-b border-body-color border-opacity-10 px-8 py-4 text-lg font-semibold text-sky-900 dark:border-white dark:border-opacity-10 dark:text-white">
            Related Posts
          </h3>
          <ul className="p-8">
            {mostView.map((item) => (
              <li className="mb-6 border-b border-body-color border-opacity-10 pb-6 dark:border-white dark:border-opacity-10">
                <RelatedPost
                  title={item.title}
                  image={item.thumbnail}
                  slug={ROUTES.BLOG_DETAIL.replace(":id", item.id.toString())}
                  date={item.createdTime}
                />
              </li>
            ))}
          </ul>
        </div>
        <div className="shadow-three dark:bg-gray-dark mb-10 rounded-sm bg-[#F3F2F2] dark:shadow-none">
          <h3 className="border-b border-body-color border-opacity-10 px-8 py-4 text-lg font-semibold text-sky-900 dark:border-white dark:border-opacity-10 dark:text-white">
            Popular Category
          </h3>
          <ul className="px-8 py-6">
            {blogTypes.map((item) => (
              <li>
                <Link
                  to={`/blog/${item.id}`}
                  className="mb-3 inline-block text-base font-medium text-sky-900/60 hover:text-primary"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <NewsLatterBox />
      </div>
    </>
  );
};

export default BlogDetailSidebar;
