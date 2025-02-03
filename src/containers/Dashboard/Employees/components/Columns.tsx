import { Button } from "@/components/ui/button";
import { Column, ColumnDef } from "@tanstack/react-table";
import {
  ArrowUpDown,
  MoreHorizontal,
  Pencil,
  Trash,
  UserPen,
} from "lucide-react";

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
import { API_ROUTES } from "@/routes/api";

export interface Employee {
  id: string;
  fullName: string | null;
  image: string | null;
  address: string | null;
  status: string;
  role: string | null;
  email: string | null;
  gender: string | null;
}

const columnFields: { key: keyof Employee; label: string }[] = [
  { key: "fullName", label: "FullName" },
  { key: "email", label: "Email" },
  { key: "gender", label: "Gender" },
  { key: "role", label: "Role" },
];

export const columns: ColumnDef<Employee>[] = [
  ...columnFields.map(({ key, label }) => ({
    accessorKey: key,
    header: ({ column }: { column: Column<Employee> }) => {
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
  {
    accessorKey: "image",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Image
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const isImageUrl = row.getValue("image") || false;
      return isImageUrl ? (
        <img width={120} src={row.getValue("image")} alt="Image" />
      ) : (
        <p>No image</p>
      );
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
              to={`${ROUTES.DASHBOARD_EMPLOYEE_UPDATE.replace(":id", id)}`}
            >
              <DropdownMenuItem className="cursor-pointer">
                <Pencil className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
            </Link>
            <Link
              className="text-sky-800"
              to={`${ROUTES.DASHBOARD_EMPLOYEE_DETAIL.replace(":id", id)}`}
            >
              <DropdownMenuItem className="cursor-pointer">
                <UserPen className="h-4 w-4 mr-2" />
                Detail
              </DropdownMenuItem>
            </Link>
            <DropdownMenuItem className="cursor-pointer font-semibold">
              <div
                onClick={() => handleDelete(id)}
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
  const confirm = window.confirm(" Do you really want to delete?");
  if (!confirm) return;

  try {
    await axios.delete(`${BASE_URL + API_ROUTES.DASHBOARD_EMPLOYEE_DELETE}`, {
      params: { Id: id },
      headers: configHeaders(),
    });
    window.location.href = `${ROUTES.DASHBOARD_EMPLOYEES}`;
    toast.success("Deleted successfully");
  } catch (error) {
    console.error("Failed to delete employee:", error);
    toast.error("Please login again to refresh token");
  }
};
