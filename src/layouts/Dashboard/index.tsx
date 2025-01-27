import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import { CookiesEmployeeService } from "@/services/cookies.service";
import { accessRules, canAccess } from "@/routes/rules";
import { ROUTES } from "@/routes";

interface DashboardLayoutProps {
  children?: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const location = useLocation();
  const currentPath = location.pathname;

  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  useEffect(() => {
    if (!CookiesEmployeeService.get()) {
      navigate("/");
      return;
    }

    if (role && role in accessRules) {
      const hasAccess = canAccess(
        role as keyof typeof accessRules,
        currentPath
      );

      if (!hasAccess) {
        navigate(ROUTES.DASHBOARD_DOCTOR);
      }
    }
  }, [currentPath, navigate, role]);

  return (
    <div className="h-full">
      <div className="h-[80px] md:pl56 fixed inset-y-0 w-full z-50">
        <Navbar />
      </div>
      <div className="hidden md:flex h-full w-56 flex-col fixed inset-y-0 z-50">
        <Sidebar />
      </div>
      <main className="md:pl-56 pt-[80px] h-full">{children}</main>
    </div>
  );
};

export default DashboardLayout;
