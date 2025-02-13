import { useState, useEffect } from "react";
import { FaRegMoon, FaRegSun } from "react-icons/fa";
import { IoIosNotifications } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import SearchContainer from "./SearchContainter";
import AuthForm from "./AuthForm";
import { useTheme } from "./theme-provider";
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

const Navbar = () => {
  const { theme, setTheme } = useTheme();
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
    },
    { name: "Growth Chart", link: ROUTES.MY_GROWTH_CHART, isAuth: true },
    { name: "Appointments", link: ROUTES.APPOINTMENT_HISTORY, isAuth: true },
    { name: " My calendar", link: ROUTES.APPOINTMENT_CALENDAR, isAuth: true },
    { name: "Children", link: ROUTES.CHILDREN, isAuth: true },
    {
      name: "Booking Appointment",
      link: ROUTES.APPOINTMENT_BOOKING,
      isAuth: false,
    },
    {
      name: "Membership Packages",
      link: ROUTES.MEMBERSHIP,
      isAuth: false,
    },
  ];

  const handleNavigate = (link: string) => {
    if (userId) {
      navigate(link);
    } else {
      toast.error("Please login to access this function");
    }
  };

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="fixed w-full flex justify-between items-center mt-11 px-32 bg-white z-50">
        <div className="flex text-2xl text-sky-900">
          <SearchContainer />
          <div
            className="hover:bg-slate-100 hover:rounded-full cursor-pointer p-2"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? <FaRegSun /> : <FaRegMoon />}
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
          <div className="mr-2 hover:bg-slate-100 hover:rounded-full cursor-pointer p-2">
            <IoIosNotifications />
          </div>
          {userId ? <UserButton /> : <AuthForm />}
        </div>
      </div>

      {/* Thanh categories với dropdown */}
      <div className="flex justify-between h-10 mt-40 px-32 bg-white z-40">
        {categories.map((category, index) => (
          <div key={index} className="relative group cursor-pointer">
            <div
              onClick={() => handleNavigate(category.link)}
              className="text-sky-900 hover:border-b-2 hover:border-emerald-400 hover:text-sky-900"
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
