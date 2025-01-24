import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

interface SidebarProps {
  icon: LucideIcon;
  label: string;
  href: string;
}

const SidebarItem = ({ icon: Icon, label, href }: SidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive =
    (location.pathname === "/" && href === "/") ||
    location.pathname === href ||
    location.pathname.startsWith(`${href}/`);

  const onClick = () => {
    navigate(href);
  };

  return (
    <button
      onClick={onClick}
      type="button"
      className={cn(
        "flex items-center gap-x-2 text-slate-500 text-sm font-[500] pl-6 transition-all hover:text-slate-600 hover:bg-slate-300/20",
        isActive &&
          "text-sky-900 bg-sky-200/20 hover:bg-sky-200/20 hover:text-sky-900"
      )}
    >
      <div className="flex items-center gap-x-2 py-4">
        <Icon
          size={22}
          className={cn("text-slate-500", isActive && "text-sky-900")}
        />
        {label}
      </div>
      <div
        className={cn(
          "ml-auto opacity-0 border-2 border-emerald-400 h-full transition-all",
          isActive && "opacity-100"
        )}
      ></div>
    </button>
  );
};

export default SidebarItem;
