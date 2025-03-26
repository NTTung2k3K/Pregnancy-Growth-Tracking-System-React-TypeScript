import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import AuthForm from "./AuthForm";
import UserButton from "./UserButton";
import { ROUTES } from "@/routes";
import { BASE_URL } from "@/services/config";
import { CookiesService } from "@/services/cookies.service";

export interface BlogType {
  id: number;
  name: string;
  description: string;
  thumbnail: string | null;
}

import toast from "react-hot-toast";
import { Baby, CalendarCheck2, ChartLine } from "lucide-react";

const Navbar = () => {
  const userId = CookiesService.get();
  const navigate = useNavigate();

  // Khai báo kiểu cho blogTypes
  const [blogTypes, setBlogTypes] = useState<BlogType[]>([]);

  const fetchBlogTypes = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/blogtype/all`);
      const formattedResult = Array.isArray(response.data.resultObj.items)
        ? response.data.resultObj.items.map((item: any) => ({
            id: item.id,
            name: item.name,
            thumbnail: item.thumbnail,
          }))
        : [];
      setBlogTypes(formattedResult);
    } catch (error) {
      console.error("Failed to fetch blog types:", error);
    }
  };

  useEffect(() => {
    fetchBlogTypes();
  }, []);

  // Cấu trúc mảng categories, trong đó mục Blogs có children là blogTypes lấy từ API
  const categories = [
    {
      name: "Blogs",
      link: ROUTES.BLOG,
      children: blogTypes.map((bt) => ({
        name: bt.name,
        link: `/blog/${bt.id}`,
      })),
      isAuth: false,
    },
    { name: "Growth Chart", link: ROUTES.GROWTH_CHART, isAuth: false },
    { name: "Appointments", link: ROUTES.APPOINTMENT_HISTORY, isAuth: true },
    { name: " My calendar", link: ROUTES.APPOINTMENT_CALENDAR, isAuth: true },
    { name: "Children", link: ROUTES.CHILDREN, isAuth: true },
    {
      name: "Booking Appointment",
      link: ROUTES.APPOINTMENT_BOOKING,
      isAuth: true,
    },
    {
      name: "Membership Packages",
      link: ROUTES.MEMBERSHIP,
      isAuth: false,
    },
  ];

  const handleNavigate = (link: string, isAuth: boolean) => {
    if (isAuth) {
      if (userId) {
        navigate(link);
      } else {
        toast.error("Please login to access this function");
      }
    } else {
      navigate(link);
    }
  };

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="fixed w-full flex justify-between items-center mt-11 px-32 bg-white z-50">
        <div className="flex text-2xl text-sky-900 items-center py-4">
          <div
            onClick={() => handleNavigate(ROUTES.CHILDREN, true)}
            className="mx-2 rounded-full hover:bg-slate-200 p-2 cursor-pointer"
          >
            <Baby className="w-8 h-8" />
          </div>
          <div
            onClick={() => handleNavigate(ROUTES.MY_GROWTH_CHART, true)}
            className="mx-2 rounded-full hover:bg-slate-200 p-2 cursor-pointer"
          >
            <ChartLine className="w-8 h-8" />
          </div>
        </div>
        <Link to="/" className="hover:cursor-pointer">
          <img
            src="/assets/images/navbar-logo.png"
            className="h-[60px]"
            alt="Navbar Logo"
            onError={(e: any) => (e.target.style.display = "none")}
          />
        </Link>
        <div className="flex items-center text-2xl text-sky-900">
          <div
            onClick={() => handleNavigate(ROUTES.APPOINTMENT_HISTORY, true)}
            className="mr-4 rounded-full hover:bg-slate-200 p-2 cursor-pointer"
          >
            <CalendarCheck2 className="w-8 h-8" />
          </div>
          {userId ? <UserButton /> : <AuthForm />}
        </div>
      </div>

      {/* Thanh categories với dropdown */}
      <div className="flex justify-between h-10 mt-40 px-32 bg-white z-30">
        {categories.map((category, index) => (
          <div key={index} className="relative group cursor-pointer">
            <div
              onClick={() => handleNavigate(category.link, category.isAuth)}
              className="text-sky-900 font-semibold pb-2 hover:border-b-2 hover:border-emerald-400 hover:text-sky-900"
            >
              {category.name}
            </div>
            {category.children && category.children.length > 0 && (
              <div className="absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                {category.children.map((child, childIndex) => (
                  <Link
                    key={childIndex}
                    to={child.link}
                    className="block px-4 py-2 text-gray-700 hover:bg-emerald-100"
                  >
                    {child.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Navbar;
