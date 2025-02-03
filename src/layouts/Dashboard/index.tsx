import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CookiesEmployeeService } from "@/services/cookies.service";
import { accessRules, canAccess } from "@/routes/rules";
import { ROUTES } from "@/routes";
import AuthWatcher from "@/containers/Dashboard/AutoWatcher";
import { setupAxiosInterceptors } from "@/services/config";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/ui/app-sidebar";

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
  setupAxiosInterceptors(); // Kích hoạt interceptor trước khi app chạy

  return (
    <SidebarProvider>
      <AppSidebar />
      {/* <Sidebar /> */}
      <main className="flex-grow">
        <SidebarTrigger />
        {children}
      </main>
      <AuthWatcher />
    </SidebarProvider>
  );
};

export default DashboardLayout;

// <div className="h-full">
//   <div className="h-[80px] md:pl56 fixed inset-y-0 w-full z-50">
//     <Navbar />
//   </div>
//   <div className="hidden md:flex h-full w-56 flex-col fixed inset-y-0 z-50">
//     <Sidebar />
//   </div>
//   <main className="md:pl-56 pt-[80px] h-full">{children}</main>
//   <AuthWatcher />
// </div>
