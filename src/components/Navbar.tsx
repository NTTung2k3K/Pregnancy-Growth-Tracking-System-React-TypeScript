import { FaRegMoon, FaRegSun } from "react-icons/fa";
import { IoIosNotifications } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import SearchContainter from "./SearchContainter";
import AuthForm from "./AuthForm";
import { useTheme } from "./theme-provider";
import UserButton from "./UserButton";
import { CookiesService } from "@/services/cookies.service";
import { ROUTES } from "@/routes";
import toast from "react-hot-toast";

const Navbar = () => {
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

  const userId = CookiesService.get();

  const categories = [
    { name: "Appointments", link: ROUTES.APPOINTMENT_HISTORY },
    { name: " My calendar", link: ROUTES.APPOINTMENT_CALENDAR },
    { name: "Children", link: ROUTES.CHILDREN },
    { name: "Growth chart", link: ROUTES.MY_GROWTH_CHART },
    { name: "Booking Appointment", link: ROUTES.APPOINTMENT_BOOKING },
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
      <div className=" fixed w-full flex justify-between items-center mt-11 px-32 bg-white z-20 ">
        <div className="flex text-2xl text-sky-900">
          <SearchContainter />

          {theme === "dark" ? (
            <div className="hover:bg-slate-100 hover:rounded-full cursor-pointer p-2">
              <FaRegSun onClick={() => setTheme("light")} />
            </div>
          ) : (
            <div className="hover:bg-slate-100 hover:rounded-full cursor-pointer p-2">
              <FaRegMoon onClick={() => setTheme("dark")} />
            </div>
          )}
        </div>
        <Link to={"/"} className="hover:cursor-pointer">
          <img src="/assets/images/navbar-logo.png" className="h-[60px]" />
        </Link>
        <div className="flex items-center text-2xl text-sky-900">
          <div className="mr-2 hover:bg-slate-100 hover:rounded-full hover:cursor-pointer p-2">
            <IoIosNotifications />
          </div>
          {userId ? <UserButton /> : <AuthForm />}
        </div>
      </div>
      <div className="flex justify-between h-10 mt-40 px-32 bg-white">
        <div
          className="text-sky-900 hover:border-b-2 font-semibold hover:border-emerald-400 hover:text-sky-900 cursor-pointer"
          onClick={() => navigate(ROUTES.BLOG)}
        >
          Blogs
        </div>
        {categories.map((category, index) => (
          <div
            key={index}
            className="text-sky-900 hover:border-b-2 font-semibold hover:border-emerald-400 hover:text-sky-900 cursor-pointer"
            onClick={() => handleNavigate(category.link)}
          >
            {category.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Navbar;
