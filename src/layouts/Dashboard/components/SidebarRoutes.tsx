import { BookHeart, House, Newspaper, Users } from "lucide-react";
import SidebarItem from "./SidebarItem";

const teacherRoutes = [
  {
    icon: House ,
    label: "Main",
    href: "/dashboard/main",
  },
  {
    icon: Users,
    label: "Employees",
    href: "/dashboard/employees",
  },
  {
    icon: Newspaper,
    label: "Blogs",
    href: "/dashboard/blogs"
  },
  {
    icon: BookHeart,
    label: "BlogTypes",
    href: "/dashboard/blogtypes"
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
