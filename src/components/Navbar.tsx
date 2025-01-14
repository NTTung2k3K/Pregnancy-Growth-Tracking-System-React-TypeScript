import { FaRegMoon } from "react-icons/fa";
import { IoIosNotifications } from "react-icons/io";
import { Link } from "react-router-dom";
import SearchContainter from "./SearchContainter";
import LoginForm from "./LoginForm";
import AuthForm from "./AuthForm";

const Navbar = () => {
  return (
    <div className="fixed w-full flex justify-between items-center px-60 pt-16 pb-6">
      <div className="flex text-2xl text-sky-900">
        <SearchContainter />

        <div className="hover:bg-slate-100 hover:rounded-full cursor-pointer p-2">
          <FaRegMoon />
        </div>
      </div>
      <Link to={"/"} className="hover:cursor-pointer">
        <img src="/src/assets/images/navbar-logo.png" className="h-[60px]" />
      </Link>
      <div className="flex items-center text-2xl text-sky-900">
        <div className="mr-2 hover:bg-slate-100 hover:rounded-full hover:cursor-pointer p-2">
          <IoIosNotifications />
        </div>
        <AuthForm />
      </div>
    </div>
  );
};

export default Navbar;
