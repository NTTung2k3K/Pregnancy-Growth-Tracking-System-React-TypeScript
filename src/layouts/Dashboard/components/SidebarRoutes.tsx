import { House, Package, UserCog, UserPen, Users } from "lucide-react";
import SidebarItem from "./SidebarItem";
import { ROUTES } from "@/routes";

const adminRoutes = [
  {
    icon: House,
    label: "Main",
    href: ROUTES.DASHBOARD_MAIN,
  },
  {
    icon: UserCog,
    label: "Employees",
    href: ROUTES.DASHBOARD_EMPLOYEES,
  },
  {
    icon: Users,
    label: "Users",
    href: ROUTES.DASHBOARD_USERS,
  },
  {
    icon: Package,
    label: "Membership Packages",
    href: ROUTES.DASHBOARD_MEMBERSHIPPACKAGE,
  },
  {
    icon: UserPen,
    label: "Profile",
    href: ROUTES.DASHBOARD_EMPLOYEE_PROFILE,
  },
];

const doctorRoutes = [
  {
    icon: House,
    label: "Main",
    href: ROUTES.DASHBOARD_DOCTOR,
  },
  {
    icon: UserPen,
    label: "Profile",
    href: ROUTES.DASHBOARD_EMPLOYEE_PROFILE,
  },
];

export const SidebarRoutes = () => {
  const role = localStorage.getItem("role");
  const routes = role === "Admin" ? adminRoutes : doctorRoutes;

  return (
    <div className="flex flex-col w-full">
      {routes.map((route) => (
        <SidebarItem
          key={route.href}
          icon={route.icon}
          label={route.label}
          href={route.href}
        />
      ))}
    </div>
  );
};
