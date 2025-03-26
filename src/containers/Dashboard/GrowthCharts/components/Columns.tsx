import { Button } from "@/components/ui/button";
import { Column, ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, Trash, UserPen } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";
import { ROUTES } from "@/routes";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import axios from "axios";
import { BASE_URL, configHeaders } from "@/services/config";
import { API_ROUTES } from "@/routes/api";
import toast from "react-hot-toast";
import { GrowthChart } from "./IGrowthCharts";

const columnFields: { key: keyof GrowthChart; label: string }[] = [
  { key: "topic", label: "Topic" },
  { key: "question", label: "Question" },
  { key: "viewCount", label: "View Count" },
];

export const columns: ColumnDef<GrowthChart>[] = [
  ...columnFields.map(({ key, label }) => ({
    accessorKey: key,
    header: ({ column }: { column: Column<GrowthChart> }) => {
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
    accessorKey: "childName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Child Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    accessorFn: (row) => row.childModelView?.name || "", // Extracts name for filtering
    cell: ({ row }) => {
      return <p>{row.original.childModelView?.name}</p>;
    },
  },

  {
    accessorKey: "image",
    header: () => {
      return <Button variant="ghost">Image</Button>;
    },
    cell: ({ row }) => {
      const imageUrl = row.original.childModelView.photoUrl;

      return imageUrl ? (
        <img width={120} src={imageUrl} alt="Image" />
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
      return (
        <Badge
          className={cn(
            row.getValue("status") === "Shared"
              ? "bg-emerald-400"
              : row.getValue("status") === "Answered"
              ? "bg-sky-400"
              : "bg-slate-500"
          )}
        >
          {row.getValue("status") === "Shared"
            ? "Shared"
            : row.getValue("status") === "Answered"
            ? "Answered"
            : "Blocked"}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const { id } = row.original;

      const role = localStorage.getItem("role");
      const isAdmin = role === "Admin";
      const link =
        role === "Admin"
          ? ROUTES.DASHBOARD_GROWTH_CHARTS_UPDATE
          : ROUTES.DASHBOARD_DOCTOR_GROWTH_CHARTS_UPDATE;

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
              to={`${link.replace(":id", String(id))}`}
            >
              {isAdmin ? (
                <DropdownMenuItem className="cursor-pointer">
                  <UserPen className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem className="cursor-pointer">
                  <UserPen className="h-4 w-4 mr-2" />
                  Detail
                </DropdownMenuItem>
              )}
            </Link>
            {isAdmin && (
              <DropdownMenuItem className="cursor-pointer font-semibold">
                <div
                  onClick={() => handleDelete(id)}
                  className="w-full flex items-center"
                >
                  <Trash className="h-4 w-4 mr-2" />
                  <p>Delete</p>
                </div>
              </DropdownMenuItem>
            )}
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
    const res = await axios.delete(
      `${BASE_URL + API_ROUTES.DASHBOARD_GROWTH_CHARTS_DELETE}/${id}`,
      {
        headers: configHeaders(),
      }
    );
    if (res.data.statusCode === 200) {
      window.location.href = `${ROUTES.DASHBOARD_GROWTH_CHARTS}`;
      toast.success("Deleted successfully");
    } else {
      toast.error(res.data.message);
    }
  } catch (error) {
    console.error("Failed to delete template:", error);
    toast.error("Please login again to refresh token");
  }
};
