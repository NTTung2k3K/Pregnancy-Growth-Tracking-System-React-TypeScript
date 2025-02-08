import { useEffect, useState } from "react";
import CardData from "./components/CardData";
import axios from "axios";
import { API_ROUTES } from "@/routes/api";
import { BASE_URL } from "@/services/config";
import MonthlyBlogChart from "./components/MonthlyBlogChart";
import { DataTable } from "./components/DataTable";
import { columns } from "./components/Columns";
import { BlogMainDashboard } from "./components/IBlog";
import { CookiesEmployee2Service } from "@/services/cookies.service";

interface NewUserData {
  inMonth: number;
  inYear: number;
  inDay: number;
}

const dummyBlogs: BlogMainDashboard[] = [
  {
    id: 1,
    title: "Understanding React Hooks",
    content:
      "React Hooks provide a way to use state and lifecycle methods in functional components...",
    likesCount: 120,
    week: 5,
    viewCount: 2300,
    status: "published",
    sources: "https://reactjs.org/docs/hooks-intro.html",
    thumbnail: "https://via.placeholder.com/150",
    blogTypeModelView: {
      id: 1,
      name: "Technology",
      description: "All about the latest in tech and programming.",
      thumbnail: "https://via.placeholder.com/150",
    },
    authorResponseModel: {
      id: "A1",
      fullName: "John Doe",
      image: "https://via.placeholder.com/100",
    },
  },
  {
    id: 2,
    title: "The Rise of AI in 2024",
    content:
      "Artificial Intelligence is evolving rapidly, transforming industries and daily life...",
    likesCount: 85,
    week: 6,
    viewCount: 1800,
    status: "published",
    sources: "https://openai.com/blog/",
    thumbnail: "https://via.placeholder.com/150",
    blogTypeModelView: {
      id: 2,
      name: "Artificial Intelligence",
      description: "Latest trends in AI, ML, and deep learning.",
      thumbnail: "https://via.placeholder.com/150",
    },
    authorResponseModel: {
      id: "A2",
      fullName: "Jane Smith",
      image: "https://via.placeholder.com/100",
    },
  },
  {
    id: 3,
    title: "Mastering TypeScript",
    content:
      "TypeScript is a powerful tool for JavaScript developers, providing strong typing...",
    likesCount: 200,
    week: 7,
    viewCount: 3200,
    status: "draft",
    sources: "https://www.typescriptlang.org/",
    thumbnail: "https://via.placeholder.com/150",
    blogTypeModelView: {
      id: 3,
      name: "Programming",
      description: "Tutorials and tips on different programming languages.",
      thumbnail: "https://via.placeholder.com/150",
    },
    authorResponseModel: {
      id: "A3",
      fullName: "Michael Brown",
      image: "https://via.placeholder.com/100",
    },
  },
  {
    id: 4,
    title: "The Future of Web Development",
    content:
      "Web development is constantly evolving, with new frameworks and technologies...",
    likesCount: 150,
    week: 8,
    viewCount: 2900,
    status: "published",
    sources: "https://web.dev/",
    thumbnail: "https://via.placeholder.com/150",
    blogTypeModelView: {
      id: 4,
      name: "Web Development",
      description: "Frontend and backend development trends.",
      thumbnail: "https://via.placeholder.com/150",
    },
    authorResponseModel: {
      id: "A4",
      fullName: "Emily Johnson",
      image: "https://via.placeholder.com/100",
    },
  },
  {
    id: 5,
    title: "Cybersecurity in the Modern Age",
    content:
      "Cyber threats are increasing, making security more important than ever...",
    likesCount: 95,
    week: 9,
    viewCount: 1400,
    status: "published",
    sources: "https://www.cybersecurity-insights.com/",
    thumbnail: "https://via.placeholder.com/150",
    blogTypeModelView: {
      id: 5,
      name: "Cybersecurity",
      description: "Tips and news on staying secure online.",
      thumbnail: "https://via.placeholder.com/150",
    },
    authorResponseModel: {
      id: "A5",
      fullName: "David Wilson",
      image: "https://via.placeholder.com/100",
    },
  },
];

const DashboardMainContainer = () => {
  const [data, setData] = useState<NewUserData>();
  const admin = JSON.parse(CookiesEmployee2Service.get() || "");

  const fetchNewUserData = async () => {
    const response = await axios.get(`${BASE_URL + API_ROUTES.NEW_DATA_USER}`);
    setData(response.data.resultObj);
  };

  useEffect(() => {
    fetchNewUserData();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-center  text-sky-800 mb-8">
        Welcome, {admin.fullName} 🙌
      </h1>
      <div className="flex items-center justify-around">
        <CardData data={data?.inDay} description={"In Day"} />
        <CardData data={data?.inMonth} description={"In Month"} />
        <CardData data={data?.inYear} description={"In Year"} />
      </div>
      <div className="my-10">
        <MonthlyBlogChart />
      </div>
      <div className="my-10 flex justify-around">
        <div className="">
          <p className="mb-2">Most likes</p>
          <DataTable columns={columns} data={dummyBlogs} />
        </div>
        <div className="">
          <p className="mb-2">Most views</p>
          <DataTable columns={columns} data={dummyBlogs} />
        </div>
      </div>
    </div>
  );
};

export default DashboardMainContainer;
