import { Button } from "@/components/ui/button";
import { Column, ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, Pen, Trash, UserPen } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";
import { ROUTES } from "@/routes";
import { AppointmentTemplates } from "./IAppointmentTemplates";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import axios from "axios";
import { BASE_URL, configHeaders } from "@/services/config";
import { API_ROUTES } from "@/routes/api";
import toast from "react-hot-toast";

const columnFields: { key: keyof AppointmentTemplates; label: string }[] = [
  { key: "name", label: "Name" },
  { key: "description", label: "Description" },
];

const convertDaysToWeeks = (days: number) => {
  const weeks = Math.abs(Math.floor(days / 7)); // Get absolute weeks

  if (days < 0) {
    return weeks === 1
      ? "1 week before due date"
      : `${weeks} weeks before due date`;
  } else {
    return weeks === 1
      ? "1 week after due date"
      : `${weeks} weeks after due date`;
  }
};

const formatToVND = (amount: number) => {
  return new Intl.NumberFormat("vi-VN").format(amount) + " VND";
};

export const columns: ColumnDef<AppointmentTemplates>[] = [
  ...columnFields.map(({ key, label }) => ({
    accessorKey: key,
    header: ({ column }: { column: Column<AppointmentTemplates> }) => {
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
    accessorKey: "daysFromBirth",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Days From Birth
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return <p>{convertDaysToWeeks(row.getValue("daysFromBirth"))}</p>;
    },
  },
  {
    accessorKey: "fee",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Fee
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return <p>{formatToVND(row.getValue("fee"))}</p>;
    },
  },
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
              to={`${ROUTES.DASHBOARD_APPOINTMENT_TEMPLATES_UPDATE.replace(
                ":id",
                String(id)
              )}`}
            >
              <DropdownMenuItem className="cursor-pointer">
                <Pen className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
            </Link>
            <Link
              className="text-sky-800"
              to={`${ROUTES.DASHBOARD_APPOINTMENT_TEMPLATES_DETAIL.replace(
                ":id",
                String(id)
              )}`}
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

const handleDelete = async (id: number) => {
  const confirm = window.confirm(" Do you really want to delete?");
  if (!confirm) return;

  try {
    await axios.delete(
      `${BASE_URL + API_ROUTES.DASHBOARD_APPOINTMENT_TEMPLATES_DELETE}`,
      {
        params: { Id: id },
        headers: configHeaders(),
      }
    );
    window.location.href = `${ROUTES.DASHBOARD_APPOINTMENT_TEMPLATES}`;
    toast.success("Deleted successfully");
  } catch (error) {
    console.error("Failed to delete template:", error);
    toast.error("Please login again to refresh token");
  }
};
