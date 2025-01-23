import { Users } from "lucide-react";
import SidebarItem from "./SidebarItem";

const teacherRoutes = [
  {
    icon: Users,
    label: "Users",
    href: "/dashboard/users",
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
