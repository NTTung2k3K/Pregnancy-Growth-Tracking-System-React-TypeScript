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
import { GrowthCharts } from "./IGrowthCharts";

const columnFields: { key: keyof GrowthCharts; label: string }[] = [
  { key: "topic", label: "Topic" },
  { key: "question", label: "Question" },
  { key: "viewCount", label: "View Count" },
];

export const columns: ColumnDef<GrowthCharts>[] = [
  ...columnFields.map(({ key, label }) => ({
    accessorKey: key,
    header: ({ column }: { column: Column<GrowthCharts> }) => {
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
            row.getValue("status") === "1"
              ? "bg-emerald-400"
              : row.getValue("status") === "3"
              ? "bg-sky-400"
              : "bg-slate-500"
          )}
        >
          {row.getValue("status") === "1"
            ? "Shared"
            : row.getValue("status") === "3"
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
              to={`${ROUTES.DASHBOARD_GROWTH_CHARTS_UPDATE.replace(
                ":id",
                String(id)
              )}`}
            >
              <DropdownMenuItem className="cursor-pointer">
                <UserPen className="h-4 w-4 mr-2" />
                Edit
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
      `${BASE_URL + API_ROUTES.DASHBOARD_GROWTH_CHARTS_DELETE}/${id}`,
      {
        headers: configHeaders(),
      }
    );
    window.location.href = `${ROUTES.DASHBOARD_GROWTH_CHARTS}`;
    toast.success("Deleted successfully");
  } catch (error) {
    console.error("Failed to delete template:", error);
    toast.error("Please login again to refresh token");
  }
};
