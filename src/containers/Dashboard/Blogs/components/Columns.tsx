import { Button } from "@/components/ui/button";
import { Column, ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, Pencil, Trash, UserPen } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";
import { ROUTES } from "@/routes";
import axios from "axios";
import { BASE_URL, configHeaders } from "@/services/config";
import toast from "react-hot-toast";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// Interface Blog đã được cập nhật để chứa các đối tượng lồng nhau
export interface Blog {
  id: number;
  title: string;
  thumbnail: string;
  status: string;
  week: number;
  blogTypeModelView: {
    id: number;
    name: string;
    description: string;
    thumbnail: string;
  };
  authorResponseModel: {
    id: string;
    fullName: string | null;
    image: string | null;
    dateOfBirth: string | null;
    address: string | null;
    gender: string | null;
    phoneNumber: string | null;
    createdBy: string | null;
    email: string;
    lastUpdatedBy: string | null;
    status: string;
    role: {
      id: string;
      name: string;
    };
  };
}

// Mảng cột chung cho các trường không cần xử lý riêng (title, week, status)
const commonColumnFields: { key: keyof Blog; label: string }[] = [
  { key: "title", label: "Title" },
  { key: "week", label: "Week" },
];

export const columns: ColumnDef<Blog>[] = [
  // Các cột chung
  ...commonColumnFields.map(({ key, label }) => ({
    accessorKey: key,
    header: ({ column }: { column: Column<Blog> }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {label}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  })),

  // Cột hiển thị Author (lấy role.name từ authorResponseModel)
  {
    id: "authorId",
    header: ({ column }: { column: Column<Blog> }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Author ID
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      // Lấy role.name từ authorResponseModel nếu có, ngược lại hiển thị giá trị mặc định
      const roleName = row.original.authorResponseModel?.role?.name || "N/A";
      return <span>{roleName}</span>;
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const isActive = row.getValue("status") == "Active";
      return (
        <Badge className={cn("bg-slate-500", isActive && "bg-emerald-400")}>
          {isActive ? "Active" : "Inactive"}
        </Badge>
      );
    },
  },

  // Cột hiển thị Blog Type (lấy name từ blogTypeModelView)
  {
    id: "blogTypeId",
    header: ({ column }: { column: Column<Blog> }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Blog Type ID
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const blogTypeName = row.original.blogTypeModelView?.name || "N/A";
      return <span>{blogTypeName}</span>;
    },
  },

  // Cột hiển thị Thumbnail
  {
    accessorKey: "thumbnail",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Thumbnail
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const thumbnailUrl = row.getValue("thumbnail") as string;
      return thumbnailUrl ? (
        <img width={120} src={thumbnailUrl} alt="Thumbnail" />
      ) : (
        <p>No thumbnail</p>
      );
    },
  },

  // Cột hành động
  {
    id: "actions",
    cell: ({ row }) => {
      const { id } = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-4 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="text-sky-800">
            <Link
              className="text-sky-800"
              to={`${ROUTES.DASHBOARD_BLOG_UPDATE.replace(":id", id.toString())}`}
            >
              <DropdownMenuItem className="cursor-pointer">
                <Pencil className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
            </Link>
            <Link
              className="text-sky-800"
              to={`${ROUTES.DASHBOARD_BLOG_DETAIL.replace(":id", id.toString())}`}
            >
              <DropdownMenuItem className="cursor-pointer">
              <UserPen className="h-4 w-4 mr-2" />
                Detail
              </DropdownMenuItem>
            </Link>
            <DropdownMenuItem className="cursor-pointer font-semibold">
              <div
                onClick={() => handleDelete(id.toString())}
                className="w-full flex items-center"
              >
                <Trash className="h-4 w-4 mr-2" />
                <p>Delete</p>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

const handleDelete = async (id: string) => {
  const confirmLeave = window.confirm("Do you really want to delete?");
  if (!confirmLeave) return;

  try {
    await axios.delete(`${BASE_URL}/blog/delete/${id}`, {
      headers: configHeaders(),
    });
    
    window.location.href = `/dashboard/blogs`;
    toast.success("Deleted successfully");
  } catch (error) {
    console.error("Failed to delete blog:", error);
    toast.error("Please login again to refresh token");
  }
};