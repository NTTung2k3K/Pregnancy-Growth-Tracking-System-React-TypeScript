import { FaRegMoon, FaRegSun } from "react-icons/fa";
import { IoIosNotifications } from "react-icons/io";
import { Link } from "react-router-dom";
import SearchContainter from "./SearchContainter";
import AuthForm from "./AuthForm";
import { useTheme } from "./theme-provider";
import UserButton from "./UserButton";
import { CookiesService } from "@/services/cookies.service";
import { ROUTES } from "@/routes";

const Navbar = () => {
  const { theme, setTheme } = useTheme();

  const userId = CookiesService.get();

  const categories = [
    { name: "Community", link: "/community" },
    { name: "Getting Pregnant", link: "/community" },
    { name: "Pregnancy", link: "/community" },
    { name: "Baby Name", link: "/community" },
    { name: "Baby", link: "/community" },
    { name: "Toddler", link: "/community" },
    { name: "Child", link: "/children" },
    { name: "Health", link: "/community" },
    { name: "Family", link: "/community" },
    { name: "Courses", link: "/community" },
    { name: "Registry Builder", link: "/community" },
    { name: "Booking appointment", link: ROUTES.APPOINTMENT_BOOKING },
  ];

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
        {categories.map((category, index) => (
          <Link
            key={index}
            to={category.link}
            className="text-sky-900 hover:border-b-2 hover:border-emerald-400 hover:text-sky-900"
          >
            {category.name}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Navbar;
