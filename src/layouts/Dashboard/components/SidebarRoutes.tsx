import { House, Package, UserCog, Users } from "lucide-react";
import SidebarItem from "./SidebarItem";

const teacherRoutes = [
  {
    icon: House,
    label: "Main",
    href: "/dashboard/main",
  },
  {
    icon: UserCog,
    label: "Employees",
    href: "/dashboard/employees",
  },
  {
    icon: Users,
    label: "Users",
    href: "/dashboard/users",
  },
  {
    icon: Package,
    label: "Membership Packages",
    href: "/dashboard/membership-packages",
  },
];

export const SidebarRoutes = () => {
  return (
    <div className="flex flex-col w-full">
      {teacherRoutes.map((route) => (
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
